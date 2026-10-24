import Link from "next/link";
import { getDictionary, t } from "@/lib/i18n/dictionaries";

export default function NotFound() {
  // [lang] layout may not have run — fall back to Arabic
  const dict = getDictionary("ar");
  return (
    <section className="container-app flex min-h-[60vh] flex-col items-center justify-center gap-4 py-24 text-center">
      <h1 className="text-3xl font-extrabold">{t(dict, "common.notFoundTitle")}</h1>
      <p className="max-w-md text-[var(--color-muted)]">{t(dict, "common.notFoundDesc")}</p>
      <Link href="/ar" className="mt-2 min-h-[44px] inline-flex items-center rounded-[var(--radius-md)] bg-[var(--color-primary)] px-6 py-3 text-sm font-extrabold text-[var(--color-primary-foreground)] hover:opacity-90 focus-ring">
        {t(dict, "common.goHome")}
      </Link>
    </section>
  );
}
