"use client";

import { useEffect } from "react";
import { getDictionary, t } from "@/lib/i18n/dictionaries";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const dict = getDictionary("ar");
  return (
    <section className="container-app flex min-h-[60vh] flex-col items-center justify-center gap-4 py-24 text-center">
      <h1 className="text-3xl font-extrabold">{t(dict, "common.errorTitle")}</h1>
      <p className="max-w-md text-[var(--color-muted)]">{t(dict, "common.errorDesc")}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-2 min-h-[44px] inline-flex cursor-pointer items-center rounded-[var(--radius-md)] bg-[var(--color-primary)] px-6 py-3 text-sm font-extrabold text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)] focus-ring"
      >
        {t(dict, "common.retry")}
      </button>
    </section>
  );
}
