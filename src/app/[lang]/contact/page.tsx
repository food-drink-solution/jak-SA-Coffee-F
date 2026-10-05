import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/config/locales";
import { getDictionary, t } from "@/lib/i18n/dictionaries";
import { ContactForm } from "@/components/forms/contact-form";
import { siteConfig } from "@/config/site";
import { alternatesFor } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(isLocale(lang) ? lang : "ar");
  return { title: t(dict, "nav.contact"), alternates: alternatesFor("/contact") };
}

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 py-12">
      <h1 className="mb-3 text-3xl font-extrabold">{t(dict, "contact.title")}</h1>
      <p className="mb-10 max-w-2xl leading-7 text-[var(--color-muted)]">{t(dict, "contact.subtitle")}</p>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-[var(--shadow-card)]">
          <ContactForm
            labels={{
              name: t(dict, "contact.name"),
              email: t(dict, "contact.email"),
              phone: t(dict, "contact.phone"),
              message: t(dict, "contact.message"),
              send: t(dict, "contact.send"),
              sending: t(dict, "contact.sending"),
              success: t(dict, "contact.success"),
              errorName: t(dict, "contact.errorName"),
              errorEmail: t(dict, "contact.errorEmail"),
              errorPhone: t(dict, "contact.errorPhone"),
              errorMessage: t(dict, "contact.errorMessage"),
            }}
          />
        </div>

        <div>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-bold text-[var(--color-muted)]">{t(dict, "footer.contact")}</dt>
              <dd className="text-lg font-extrabold">
                <a dir="ltr" href={`tel:${siteConfig.contact.phoneHref}`}>{siteConfig.contact.phone}</a>
              </dd>
            </div>
            <div>
              <dd><a href={`mailto:${siteConfig.contact.email}`} className="font-bold text-[var(--color-primary)]">{siteConfig.contact.email}</a></dd>
            </div>
            <div>
              <dd>{siteConfig.contact.country[lang]}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
