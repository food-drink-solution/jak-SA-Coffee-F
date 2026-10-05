import Link from "next/link";
import { getDictionary, t } from "@/lib/i18n/dictionaries";

export default function NotFound() {
  // [lang] layout may not have run — fall back to Arabic
  const dict = getDictionary("ar");
  return (
    <section className="mx-auto flex min-h-[60vh] w-full max-w-[1200px] flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <h1 className="text-3xl font-extrabold">{t(dict, "common.notFoundTitle")}</h1>
      <p className="max-w-md text-[var(--color-muted)]">{t(dict, "common.notFoundDesc")}</p>
      <Link href="/ar" className="mt-2 rounded-[var(--radius-md)] bg-[var(--color-primary)] px-6 py-3 text-sm font-extrabold text-white">
        {t(dict, "common.goHome")}
      </Link>
    </section>
  );
}
