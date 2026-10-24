import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/config/locales";
import { getDictionary, t } from "@/lib/i18n/dictionaries";
import { getCompany } from "@/lib/data/catalog";
import { DocumentCard } from "@/components/docs/document-card";
import { alternatesFor } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(isLocale(lang) ? lang : "ar");
  return { title: t(dict, "pages.profileTitle"), alternates: alternatesFor("/profile") };
}

export default async function ProfilePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const company = getCompany();

  return (
    <section className="container-app py-8 sm:py-12">
      <h1 className="mb-3 text-3xl font-extrabold">{t(dict, "pages.profileTitle")}</h1>
      <p className="mb-10 max-w-2xl leading-7 text-[var(--color-muted)]">{t(dict, "pages.profileDesc")}</p>

      <h2 className="mb-4 text-xl font-extrabold">{t(dict, "pages.documents")}</h2>
      {company.documents.length === 0 ? (
        <p className="text-sm text-[var(--color-muted)]">
          {lang === "ar"
            ? "المستندات غير متاحة حالياً. يمكن الحصول عليها من موقع جاك الرسمي."
            : "Documents are currently unavailable. They can be obtained from the official JAK website."}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {company.documents.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} locale={lang} downloadLabel={t(dict, "pages.download")} />
          ))}
        </div>
      )}
    </section>
  );
}
