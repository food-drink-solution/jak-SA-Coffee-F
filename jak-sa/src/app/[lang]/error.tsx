"use client";

import { useEffect } from "react";
import { FailureState } from "@/components/common/failure-state";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <FailureState kind="error" digest={error.digest} onRetry={reset} />;
}
