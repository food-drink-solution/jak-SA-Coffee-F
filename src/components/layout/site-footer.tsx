import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/config/locales";
import type { Category } from "@/types/category";
import { pick } from "@/types/localization";
import { siteConfig } from "@/config/site";
import { getDictionary, t } from "@/lib/i18n/dictionaries";
import { FacebookIcon, InstagramIcon, YoutubeIcon } from "@/components/ui/icons";

interface SiteFooterProps {
  locale: Locale;
  categories: Category[];
}

export function SiteFooter({ locale, categories }: SiteFooterProps) {
  const dict = getDictionary(locale);
  
  const socialLinks = [
    { name: t(dict, "footer.facebook"), icon: FacebookIcon, href: "https://www.facebook.com/jak.sa", ariaLabel: t(dict, "footer.facebook") },
    { name: t(dict, "footer.instagram"), icon: InstagramIcon, href: "https://www.instagram.com/jak.sa", ariaLabel: t(dict, "footer.instagram") },
    { name: t(dict, "footer.youtube"), icon: YoutubeIcon, href: "https://www.youtube.com/@jak.sa", ariaLabel: t(dict, "footer.youtube") },
  ];

  return (
    <footer className="mt-20 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-2 gap-8 px-4 py-12 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <Image src="/images/brand/footer-logo.png" alt={siteConfig.name[locale]} width={120} height={48} className="h-12 w-auto" />
          <p className="mt-4 text-sm leading-6 text-[var(--color-muted)]">{siteConfig.description[locale]}</p>
          
          {/* Social Links */}
          <div className="mt-6">
            <h3 className="mb-3 font-extrabold text-sm">{t(dict, "footer.social")}</h3>
            <ul className="flex gap-3" aria-label={t(dict, "footer.social")}>
              {socialLinks.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-surface-muted)] text-[var(--color-muted)] transition-all hover:bg-[var(--color-jak-primary)] hover:text-white"
                    aria-label={social.ariaLabel}
                  >
                    <social.icon className="h-5 w-5" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </div>
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
      <div className="border-t border-[var(--color-border)] py-4">
        <div className="mx-auto max-w-[1200px] px-4">
          <p className="text-center text-xs text-[var(--color-muted-foreground)]">
            © {new Date().getFullYear()} {siteConfig.legalName[locale]}. {t(dict, "footer.rights")}.
          </p>
          <p className="mt-2 text-center text-xs text-[var(--color-muted-foreground)]">
            <Link
              href="https://we3ds.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-jak-primary)] hover:underline font-medium"
            >
              {t(dict, "footer.builtWith")}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
