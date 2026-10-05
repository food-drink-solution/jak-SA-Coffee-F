"use client";

import { useEffect } from "react";
import { getDictionary, t } from "@/lib/i18n/dictionaries";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const dict = getDictionary("ar");
  return (
    <section className="mx-auto flex min-h-[60vh] w-full max-w-[1200px] flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <h1 className="text-3xl font-extrabold">{t(dict, "common.errorTitle")}</h1>
      <p className="max-w-md text-[var(--color-muted)]">{t(dict, "common.errorDesc")}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-2 rounded-[var(--radius-md)] bg-[var(--color-primary)] px-6 py-3 text-sm font-extrabold text-white"
      >
        {t(dict, "common.retry")}
      </button>
    </section>
  );
}
