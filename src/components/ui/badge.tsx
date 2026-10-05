import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { HTMLAttributes } from "react";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center rounded-full bg-[var(--color-primary)]/10 px-3 py-1 text-xs font-bold text-[var(--color-primary)]",
          className,
        ),
      )}
      {...props}
    />
  );
}
