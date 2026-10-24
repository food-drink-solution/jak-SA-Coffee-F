import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-md)] text-sm font-bold transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)] disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        primary: "bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-dark)] active:scale-[0.98]",
        secondary: "bg-[var(--color-surface)] text-[var(--color-foreground)] border border-[var(--color-border)] hover:bg-[var(--color-surface-muted)] active:scale-[0.98]",
        ghost: "text-[var(--color-foreground)] hover:bg-black/5 active:scale-[0.98]",
        accent: "bg-[var(--color-accent)] text-[var(--color-accent-foreground)] hover:brightness-95 active:scale-[0.98]",
      },
      size: {
        sm: "h-9 min-h-[36px] px-3.5 text-xs sm:text-sm",
        md: "h-11 min-h-[44px] px-5 text-sm",
        lg: "h-12 sm:h-13 min-h-[48px] px-7 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { buttonVariants };
