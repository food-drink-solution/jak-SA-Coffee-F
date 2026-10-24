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
    <section className="container-app py-8 sm:py-12">
      <h1 className="mb-3 text-2xl font-extrabold text-[var(--color-foreground)] sm:text-3xl">{t(dict, "contact.title")}</h1>
      <p className="mb-8 max-w-2xl text-base leading-7 text-[var(--color-muted)] sm:mb-10">{t(dict, "contact.subtitle")}</p>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
        <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm sm:p-8">
          <ContactForm
            labels={{
              name: t(dict, "contact.name"),
              email: t(dict, "contact.email"),
              phone: t(dict, "contact.phone"),
              message: t(dict, "contact.message"),
              send: t(dict, "contact.send"),
              sending: t(dict, "contact.sending"),
              success: t(dict, "contact.success"),
              errorSend: t(dict, "contact.errorSend"),
              errorName: t(dict, "contact.errorName"),
              errorEmail: t(dict, "contact.errorEmail"),
              errorPhone: t(dict, "contact.errorPhone"),
              errorMessage: t(dict, "contact.errorMessage"),
            }}
          />
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
            <h2 className="mb-4 text-base font-extrabold text-[var(--color-foreground)]">{t(dict, "footer.contact")}</h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-xs font-bold text-[var(--color-muted)]">{t(dict, "contact.phone")}</dt>
                <dd className="mt-1 text-base font-extrabold text-[var(--color-foreground)]">
                  <a dir="ltr" href={`tel:${siteConfig.contact.phoneHref}`} className="transition-colors hover:text-[var(--color-primary-text)] focus-ring rounded">{siteConfig.contact.phone}</a>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-bold text-[var(--color-muted)]">{t(dict, "contact.email")}</dt>
                <dd className="mt-1 text-base font-bold text-[var(--color-primary-text)]">
                  <a href={`mailto:${siteConfig.contact.email}`} className="break-all hover:underline focus-ring rounded">{siteConfig.contact.email}</a>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-bold text-[var(--color-muted)]">{lang === "ar" ? "الموقع" : "Location"}</dt>
                <dd className="mt-1 text-sm font-medium text-[var(--color-foreground)]">{siteConfig.contact.country[lang]}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
