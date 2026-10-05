import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/config/locales";
import type { Category } from "@/types/category";
import { pick } from "@/types/localization";
import { siteConfig } from "@/config/site";
import { getDictionary, t } from "@/lib/i18n/dictionaries";

interface SiteFooterProps {
  locale: Locale;
  categories: Category[];
}

export function SiteFooter({ locale, categories }: SiteFooterProps) {
  const dict = getDictionary(locale);
  return (
    <footer className="mt-20 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-2 gap-8 px-4 py-12 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <Image src="/images/brand/footer-logo.png" alt={siteConfig.name[locale]} width={120} height={48} className="h-12 w-auto" />
          <p className="mt-4 text-sm leading-6 text-[var(--color-muted)]">{siteConfig.description[locale]}</p>
        </div>

        <nav aria-label={t(dict, "footer.sections")}>
          <h3 className="mb-4 font-extrabold">{t(dict, "footer.sections")}</h3>
          <ul className="space-y-2 text-sm text-[var(--color-muted)]">
            {categories.map((c) => (
              <li key={c.id}>
                <Link href={`/${locale}/categories/${c.slug}`} className="hover:text-[var(--color-primary)]">
                  {pick(c.name, locale)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={t(dict, "footer.links")}>
          <h3 className="mb-4 font-extrabold">{t(dict, "footer.links")}</h3>
          <ul className="space-y-2 text-sm text-[var(--color-muted)]">
            <li><Link href={`/${locale}/about`} className="hover:text-[var(--color-primary)]">{t(dict, "nav.about")}</Link></li>
            <li><Link href={`/${locale}/contact`} className="hover:text-[var(--color-primary)]">{t(dict, "nav.contact")}</Link></li>
            <li><Link href={`/${locale}/terms`} className="hover:text-[var(--color-primary)]">{t(dict, "nav.terms")}</Link></li>
            <li><Link href={`/${locale}/privacy`} className="hover:text-[var(--color-primary)]">{t(dict, "nav.privacy")}</Link></li>
            <li><Link href={`/${locale}/profile`} className="hover:text-[var(--color-primary)]">{t(dict, "nav.profile")}</Link></li>
          </ul>
        </nav>

        <div>
          <h3 className="mb-4 font-extrabold">{t(dict, "footer.contact")}</h3>
          <ul className="space-y-2 text-sm text-[var(--color-muted)]">
            <li><a href={`tel:${siteConfig.contact.phoneHref}`} dir="ltr">{siteConfig.contact.phone}</a></li>
            <li><a href={`mailto:${siteConfig.contact.email}`} className="break-all">{siteConfig.contact.email}</a></li>
            <li>{siteConfig.contact.country[locale]}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--color-border)] py-4 text-center text-xs text-[var(--color-muted-foreground)]">
        © {new Date().getFullYear()} {siteConfig.legalName[locale]}. {t(dict, "footer.rights")}.
      </div>
    </footer>
  );
}
