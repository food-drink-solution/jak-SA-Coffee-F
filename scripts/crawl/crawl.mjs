/**
 * JAK migration crawler.
 *
 * Publicly accessible sources only:
 *  - Storefront JSON: GET /{locale}/search?ajax=1&page=N (public catalog pagination)
 *  - Public HTML pages: /, /page/*, /contact-us, /{locale} variants
 *
 * Safety: sequential page fetches, configurable delay, timeout, retries with
 * backoff, no auth, no cart/checkout, no customer data.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const BASE = process.env.JAK_BASE_URL ?? "https://jak.sa.com";
const CONCURRENCY = 4;
const DELAY_MS = 350;
const TIMEOUT_MS = 30_000;
const MAX_RETRIES = 3;

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchWithRetry(url, opts = {}) {
  let lastErr;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
      const res = await fetch(url, {
        redirect: "follow",
        headers: { "User-Agent": UA, "Accept-Language": "ar-SA,ar;q=0.9,en;q=0.8", ...opts.headers },
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
      return res;
    } catch (err) {
      lastErr = err;
      if (attempt < MAX_RETRIES) await sleep(400 * 2 ** attempt);
    }
  }
  throw lastErr;
}

async function fetchJson(url) {
  const res = await fetchWithRetry(url, { headers: { "X-Requested-With": "XMLHttpRequest" } });
  return res.json();
}

async function fetchText(url) {
  const res = await fetchWithRetry(url);
  return res.text();
}

async function downloadFile(url, dest) {
  const res = await fetchWithRetry(url);
  const buf = Buffer.from(await res.arrayBuffer());
  await mkdir(path.dirname(dest), { recursive: true });
  await writeFile(dest, buf);
  return buf.length;
}

async function mapLimit(items, limit, fn) {
  const out = [];
  let i = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await fn(items[idx], idx);
    }
  });
  await Promise.all(workers);
  return out;
}

const decodeEntities = (s) =>
  s
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

const stripTags = (s) => decodeEntities(s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());

const slugify = (input) => {
  const s = input
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\u0600-\u06FF]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
  return s || "item";
};

/* ---------------- Products ---------------- */

async function crawlLocaleProducts(locale) {
  const first = await fetchJson(`${BASE}/${locale}/search?ajax=1&page=1`);
  const total = first.data.total;
  const lastPage = first.data.last_page;
  console.log(`[${locale}] total=${total} pages=${lastPage}`);
  const all = [...first.data.data];
  for (let p = 2; p <= lastPage; p++) {
    await sleep(DELAY_MS);
    const page = await fetchJson(`${BASE}/${locale}/search?ajax=1&page=${p}`);
    all.push(...page.data.data);
    console.log(`[${locale}] page ${p}/${lastPage} -> +${page.data.data.length}`);
  }
  return all;
}

/* ---------------- Categories ---------------- */

async function crawlHomepage(localePath) {
  return fetchText(`${BASE}${localePath}`);
}

function extractCategoryBlocks(html) {
  // Card images appear right before their category's title/footer links.
  // Pair each non-icon category photo with the NEXT category link that follows it.
  const events = [];
  for (const m of html.matchAll(/<img[^>]+src="([^"]*\/uploads\/category-(?!icon)[^"']+)"[^>]*>/g)) {
    const alt = (m[0].match(/alt="([^"]*)"/) || [, ""])[1].trim();
    events.push({ index: m.index ?? 0, type: "img", value: m[1], alt });
  }
  for (const m of html.matchAll(/href="\/search\?category_id=(?:%5B|\[)(\d+)(?:%5D|\])"/g)) {
    events.push({ index: m.index ?? 0, type: "link", value: m[1], alt: "" });
  }
  events.sort((a, b) => a.index - b.index);
  const seen = new Map();
  for (let i = 0; i < events.length; i++) {
    if (events[i].type !== "img") continue;
    const next = events.slice(i + 1).find((e) => e.type === "link");
    if (next && !seen.has(next.value)) {
      seen.set(next.value, { id: Number(next.value), image: events[i].value, alt: events[i].alt || null });
    }
  }
  return [...seen.values()];
}

function extractCategoryNamesFromProducts(arProds, enProds) {
  const map = new Map();
  for (const p of arProds) {
    if (p.category_id && p.category_name && !map.has(p.category_id))
      map.set(p.category_id, { id: p.category_id, nameAr: p.category_name, nameEn: "" });
  }
  for (const p of enProds) {
    const e = map.get(p.category_id);
    if (e && !e.nameEn && p.category_name) e.nameEn = p.category_name;
    if (!e && p.category_id) map.set(p.category_id, { id: p.category_id, nameAr: "", nameEn: p.category_name });
  }
  return [...map.values()];
}

/* ---------------- Pages ---------------- */

function extractPageContent(html) {
  const title = stripTags((html.match(/<title>([\s\S]*?)<\/title>/) || [, ""])[1]).replace(/\s*-\s*جاك.*$/u, "").trim();
  // Remove scripts/styles/nav/footer
  let body = html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ");
  const mainMatch = body.match(/<main[\s\S]*?<\/main>/i) || body.match(/<article[\s\S]*?<\/article>/i);
  const zone = mainMatch ? mainMatch[0] : body;
  const lines = zone
    .replace(/<\/(h[1-6]|p|li|div|section|tr)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<[^>]+>/g, " ")
    .split("\n")
    .map((l) => stripTags(l))
    .filter((l) => l.length > 1)
    .filter((l) => !/^(الرئيسية|بحث|EN|تسوق الان|اطلب الأن?|تسجيل الدخول)$/u.test(l));
  // Some source pages embed their copy as base64 images
  const embeddedImages = [...zone.matchAll(/<img[^>]+src="data:image\/([a-zA-Z+]+);base64,([^"]+)"/g)].map(
    (m) => ({ ext: m[1].replace("jpeg", "jpg").replace("+", ""), data: m[2] }),
  );
  return { title, paragraphs: [...new Set(lines)].slice(0, 80), embeddedImages };
}

/* ---------------- Company / assets ---------------- */

function extractCompany(html) {
  const links = [...new Set([...html.matchAll(/href="(https?:\/\/[^"]+)"/g)].map((m) => m[1]))];
  return {
    phone: (html.match(/(\+?\d[\d\s()-]{7,})/) || [, null])[1],
    email: (html.match(/[\w.+-]+@[\w-]+\.[\w.-]+/) || [null])[0],
    appStore: links.find((l) => l.includes("apps.apple.com")) ?? null,
    googlePlay: links.find((l) => l.includes("play.google.com")) ?? null,
    social: {
      instagram: links.find((l) => l.includes("instagram.com")) ?? null,
      x: links.find((l) => l.includes("twitter.com") || l.includes("x.com")) ?? null,
      tiktok: links.find((l) => l.includes("tiktok.com")) ?? null,
      snapchat: links.find((l) => l.includes("snapchat.com")) ?? null,
      youtube: links.find((l) => l.includes("youtube.com")) ?? null,
    },
    documents: links.filter((l) => /\.pdf($|\?)/i.test(l)),
  };
}

/* ---------------- Main ---------------- */

async function main() {
  const report = { startedAt: new Date().toISOString(), steps: [], errors: [] };
  console.log("== Crawling products (AR) ==");
  const arProds = await crawlLocaleProducts("ar");
  console.log("== Crawling products (EN) ==");
  const enProds = await crawlLocaleProducts("en");
  report.steps.push({ step: "products", ar: arProds.length, en: enProds.length });

  console.log("== Fetching homepage ==");
  const homeHtml = await crawlHomepage("/");
  const docs = [...homeHtml.matchAll(/href="([^"]+\.pdf[^"]*)"/g)].map((m) => m[1]);
  const company = extractCompany(homeHtml);
  const categoryImgs = extractCategoryBlocks(homeHtml);
  let enHomeHtml = "";
  try { enHomeHtml = await crawlHomepage("/en"); } catch {}
  const enCategoryImgs = enHomeHtml ? extractCategoryBlocks(enHomeHtml) : [];
  console.log("categories with image blocks:", categoryImgs.length, "| pdf docs:", docs.length);

  // Merge localized products
  const enById = new Map(enProds.map((p) => [p.id, p]));
  const merged = arProds.map((p) => {
    const e = enById.get(p.id) ?? {};
    return { ar: p, en: e };
  });

  // Collect image jobs
  const imageJobs = [];
  for (const { ar } of merged) {
    for (const key of ["photo", "thumb"]) {
      const url = ar[key];
      if (url && /^https?:/.test(url)) {
        const file = url.split("/").pop().split("?")[0];
        imageJobs.push({ url, dest: path.join(ROOT, "public/images/products", file), publicPath: `/images/products/${file}` });
      }
    }
  }
  for (const c of categoryImgs) {
    if (c.image) {
      const url = c.image.startsWith("http") ? c.image : `${BASE}${c.image}`;
      const file = url.split("/").pop().split("?")[0];
      imageJobs.push({ url, dest: path.join(ROOT, "public/images/categories", file), publicPath: `/images/categories/${file}` });
    }
  }
  const uniq = new Map(imageJobs.map((j) => [j.url, j]));
  console.log(`== Downloading ${uniq.size} images ==`);
  let okImages = 0;
  await mapLimit([...uniq.values()], CONCURRENCY, async (job) => {
    try {
      await downloadFile(job.url, job.dest);
      okImages++;
    } catch (e) {
      report.errors.push({ type: "image", url: job.url, error: e.message });
    }
    await sleep(120);
  });
  console.log(`images ok: ${okImages}/${uniq.size}`);
  report.steps.push({ step: "images", ok: okImages, total: uniq.size });

  const imageMap = new Map([...uniq.values()].map((j) => [j.url, j.publicPath]));

  // Categories
  const catMeta = extractCategoryNamesFromProducts(arProds, enProds);
  // Include homepage card categories that have no products (e.g. beverages)
  for (const block of categoryImgs) {
    if (!catMeta.find((c) => c.id === block.id)) {
      catMeta.push({ id: block.id, nameAr: block.alt ?? String(block.id), nameEn: enCategoryImgs.find((e) => e.id === block.id)?.alt ?? block.alt ?? "" });
    }
  }
  const categories = catMeta.map((c) => {
    const img = categoryImgs.find((ci) => ci.id === c.id)?.image;
    const abs = img ? (img.startsWith("http") ? img : `${BASE}${img}`) : null;
    return {
      id: String(c.id),
      slug: slugify(c.nameEn || c.nameAr || String(c.id)),
      name: { ar: c.nameAr || c.nameEn, en: c.nameEn || c.nameAr },
      image: abs ? imageMap.get(abs) ?? abs : undefined,
    };
  });

  // Products normalized
  const products = merged.map(({ ar: a, en: e }) => {
    const photoAbs = a.photo;
    const thumbAbs = a.thumb;
    const publicPhoto = photoAbs ? imageMap.get(photoAbs) ?? photoAbs : undefined;
    const publicThumb = thumbAbs ? imageMap.get(thumbAbs) ?? thumbAbs : undefined;
    return {
      id: String(a.id),
      slug: slugify(e.title && !/[\u0600-\u06FF]/.test(e.title) ? e.title : a.title || `product-${a.id}`) + `-${a.id}`,
      name: { ar: stripTags(a.title ?? ""), en: stripTags(e.title ?? a.title ?? "") },
      description: { ar: stripTags(a.description ?? ""), en: stripTags(e.description ?? "") },
      categoryIds: a.category_id ? [String(a.category_id)] : [],
      subcategoryName: { ar: a.subcategory_name ?? "", en: e.subcategory_name ?? "" },
      images: [
        ...(publicPhoto ? [{ src: publicPhoto, alt: { ar: stripTags(a.title ?? ""), en: stripTags(e.title ?? a.title ?? "") } }] : []),
      ],
      thumb: publicThumb,
      price: typeof a.price === "number" && a.price > 0 ? { amount: a.price, currency: "SAR" } : undefined,
      priceIncludesTax: true,
      availability: "in_stock",
      attributes: [
        a.measurement_unit ? { key: "size", label: { ar: "الحجم", en: "Size" }, value: { ar: a.measurement_unit, en: e.measurement_unit ?? a.measurement_unit } } : null,
        a.weight ? { key: "weight", label: { ar: "الوزن", en: "Weight" }, value: { ar: `${a.weight} جم`, en: `${e.weight ?? a.weight} g` } } : null,
        a.expiry ? { key: "shelfLife", label: { ar: "مدة الصلاحية", en: "Shelf life" }, value: { ar: a.expiry, en: e.expiry ?? a.expiry } } : null,
        a.temperature ? { key: "temperature", label: { ar: "درجة الحرارة", en: "Temperature" }, value: { ar: a.temperature, en: e.temperature ?? a.temperature } } : null,
        a.dimensions ? { key: "dimensions", label: { ar: "الأبعاد", en: "Dimensions" }, value: { ar: a.dimensions, en: e.dimensions ?? a.dimensions } } : null,
        typeof a.calorie === "number" && a.calorie > 0 ? { key: "calories", label: { ar: "السعرات", en: "Calories" }, value: { ar: `${a.calorie} kcal/100g`, en: `${e.calorie ?? a.calorie} kcal/100g` } } : null,
      ].filter(Boolean),
      tags: [a.category_name, a.subcategory_name].filter(Boolean),
      requiresCooling: /تبريد|frozen|cool/i.test(a.temperature ?? "") || /تبريد/i.test(a.delivery_status ?? ""),
      deliveryTemperature: a.temperature ?? undefined,
      shelfLife: a.expiry ?? undefined,
      weightGrams: typeof a.weight === "number" ? a.weight : undefined,
      packageSize: a.measurement_unit ?? undefined,
      categoryName: { ar: a.category_name ?? "", en: e.category_name ?? "" },
    };
  });

  // Pages
  const pageSpecs = [
    ["about", "/page/about-us", "/en/page/about-us"],
    ["contact", "/contact-us", "/en/contact-us"],
    ["terms", "/page/conditions", "/en/page/conditions"],
    ["privacy", "/page/privacy", "/en/page/privacy"],
  ];
  const pages = [];
  for (const [id, arPath, enPath] of pageSpecs) {
    try {
      const [arHtml, enHtml] = await Promise.all([fetchText(`${BASE}${arPath}`), fetchText(`${BASE}${enPath}`)]);
      const ar = extractPageContent(arHtml);
      const en = extractPageContent(enHtml);
      const images = {};
      for (const [locale, parsed] of [["ar", ar], ["en", en]]) {
        if (parsed.embeddedImages && parsed.embeddedImages.length) {
          const ext = parsed.embeddedImages[0].ext;
          const file = `${id}-${locale}.${ext}`;
          const buf = Buffer.from(parsed.embeddedImages[0].data, "base64");
          await mkdir(path.join(ROOT, "public/images/pages"), { recursive: true });
          await writeFile(path.join(ROOT, "public/images/pages", file), buf);
          images[locale] = `/images/pages/${file}`;
        }
      }
      pages.push({ id, slug: id, title: { ar: ar.title, en: en.title || ar.title }, content: { ar: ar.paragraphs, en: en.paragraphs }, images });
      console.log(`page ${id}: ar=${ar.paragraphs.length} en=${en.paragraphs.length}`);
    } catch (e) {
      report.errors.push({ type: "page", id, error: e.message });
    }
    await sleep(DELAY_MS);
  }
  report.steps.push({ step: "pages", count: pages.length });

  // Profile documents (discovered on /ar/profile landing page)
  const documents = [];
  const profileUrls = ["/ar/profile", "/en/profile"];
  const docUrls = new Set();
  for (const p of profileUrls) {
    try {
      const html = await fetchText(`${BASE}${p}`);
      for (const m of html.matchAll(/href="([^"]+\.pdf[^"]*)"/g)) docUrls.add(m[1]);
    } catch (e) {
      report.errors.push({ type: "profile", url: p, error: e.message });
    }
    await sleep(DELAY_MS);
  }
  for (const d of [...docUrls]) {
    const url = d.startsWith("http") ? d : `${BASE}${d}`;
    const file = url.split("/").pop().split("?")[0];
    try {
      await downloadFile(url, path.join(ROOT, "public/documents", file));
      const isArabic = /arabic/i.test(file);
      documents.push({
        id: file.replace(/\.[^.]+$/, ""),
        title: {
          ar: file.includes("products") ? "كتالوج المنتجات" : file.includes("united") ? "ملف شركة الأطعمة المتحدة" : "الملف التعريفي لجاك",
          en: file.includes("products") ? "Products catalog" : file.includes("united") ? "United Foods company profile" : "JAK company profile",
        },
        type: "pdf",
        url: `/documents/${file}`,
        locale: file.includes("english") ? "en" : isArabic ? "ar" : "both",
      });
    } catch (e) {
      report.errors.push({ type: "document", url, error: e.message });
    }
  }
  report.steps.push({ step: "documents", count: documents.length });

  const FRONTEND = path.join(ROOT, "jak-sa");

  // Logos
  for (const [src, dest] of [
    ["/images/logo.png", "public/images/brand/logo.png"],
    ["/images/footer_logo.png", "public/images/brand/footer-logo.png"],
  ]) {
    try {
      await downloadFile(`${BASE}${src}`, path.join(FRONTEND, dest));
    } catch (e) {
      report.errors.push({ type: "asset", url: src, error: e.message });
    }
  }

  // Navigation (from homepage nav)
  const nav = [
    { id: "home", label: { ar: "الرئيسية", en: "Home" }, href: "/" },
    ...categories.map((c) => ({ id: `cat-${c.id}`, label: c.name, href: `/categories/${c.slug}` })),
  ];

  // Write data
  const out = (p, data) => writeFile(path.join(FRONTEND, p), JSON.stringify(data, null, 2), "utf8");
  await mkdir(path.join(FRONTEND, "src/data/products"), { recursive: true });
  await mkdir(path.join(FRONTEND, "src/data/categories"), { recursive: true });
  await mkdir(path.join(FRONTEND, "src/data/pages"), { recursive: true });
  await mkdir(path.join(FRONTEND, "src/data/navigation"), { recursive: true });
  await mkdir(path.join(FRONTEND, "src/data/company"), { recursive: true });
  await mkdir(path.join(ROOT, "docs"), { recursive: true });

  await out("src/data/products/products.json", products);
  await out("src/data/products/products.ar.json", products.map((p) => ({ ...p, name: p.name.ar, description: p.description.ar })));
  await out("src/data/products/products.en.json", products.map((p) => ({ ...p, name: p.name.en, description: p.description.en })));
  await out("src/data/categories/categories.json", categories);
  await out("src/data/categories/categories.ar.json", categories.map((c) => ({ ...c, name: c.name.ar })));
  await out("src/data/categories/categories.en.json", categories.map((c) => ({ ...c, name: c.name.en })));
  await out("src/data/pages/pages.json", pages);
  await out("src/data/navigation/navigation.json", nav);
  await out("src/data/company/company.json", { ...company, documents });

  report.finishedAt = new Date().toISOString();
  await writeFile(path.join(ROOT, "docs/migration-report.json"), JSON.stringify(report, null, 2), "utf8");
  console.log("DONE. products:", products.length, "categories:", categories.length, "pages:", pages.length, "documents:", documents.length, "errors:", report.errors.length);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
