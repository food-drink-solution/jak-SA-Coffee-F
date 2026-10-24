import { promises as fs } from "node:fs";
import path from "node:path";
import { z } from "zod";

// Server-side mirror of the client Zod schema (contact-form.tsx) — validation
// must never rely on the client alone.
const contactSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().max(120),
  phone: z.string().regex(/^[+\d\s()-]{7,16}$/),
  message: z.string().min(10).max(4000),
  // Honeypot: real users never see this hidden field, bots do. Validated
  // loosely here (bounded length); a non-empty value is the trip signal.
  company: z.string().max(200).optional(),
});

type Bucket = { count: number; resetAt: number };

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!applyRateLimit(ip)) {
    return Response.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "invalid_payload" }, { status: 400 });
  }

  const { company, ...contact } = parsed.data;

  // Honeypot tripped: answer OK so the bot believes success, store nothing.
  if (company !== undefined && company !== "") {
    return Response.json({ ok: true });
  }

  const record = { receivedAt: new Date().toISOString(), ...contact };
  const line = `${JSON.stringify(record)}\n`;

  try {
    // Durable on the self-hosted Node server. Submissions land in
    // jak-sa/data/contact-inbox.jsonl (git-ignored).
    const inboxDir = path.join(process.cwd(), "data");
    await fs.mkdir(inboxDir, { recursive: true });
    await fs.appendFile(path.join(inboxDir, "contact-inbox.jsonl"), line, "utf8");
  } catch (error) {
    console.error("contact: failed to persist submission", error);
    return Response.json({ error: "store_failed" }, { status: 500 });
  }

  // Optional real-time delivery: point CONTACT_WEBHOOK_URL at an email
  // provider / CRM / n8n hook and every submission is forwarded verbatim.
  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, { method: "POST", headers: { "Content-Type": "application/json" }, body: line });
    } catch (error) {
      console.warn("contact: webhook delivery failed", error);
    }
  }

  return Response.json({ ok: true });
}

function applyRateLimit(ip: string): boolean {
  // Survives route-module reloads (dev HMR).
  interface GlobalWithRateStore {
    __contactRate?: Map<string, Bucket>;
  }
  const globalStore = globalThis as typeof globalThis & GlobalWithRateStore;
  globalStore.__contactRate ??= new Map<string, Bucket>();
  const buckets = globalStore.__contactRate;

  const now = Date.now();
  const bucket = buckets.get(ip);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  bucket.count += 1;
  return bucket.count <= RATE_MAX;
}
