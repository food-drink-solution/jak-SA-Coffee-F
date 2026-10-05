import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/config/locales";
import { getDictionary, t } from "@/lib/i18n/dictionaries";
import { pageRepository } from "@/lib/data/catalog";
import { StaticPage } from "@/components/common/static-page";
import { alternatesFor } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(isLocale(lang) ? lang : "ar");
  return { title: t(dict, "pages.privacyTitle"), alternates: alternatesFor("/privacy") };
}

export default async function PrivacyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const page = await pageRepository.getPageBySlug("privacy");
  return <StaticPage page={page} locale={lang} heading={t(dict, "pages.privacyTitle")} />;
}
