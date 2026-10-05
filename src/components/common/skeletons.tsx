export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
      <div className="aspect-square rounded-[var(--radius-md)] bg-[var(--color-border)]" />
      <div className="mt-4 space-y-2">
        <div className="h-4 w-3/4 rounded bg-[var(--color-border)]" />
        <div className="h-3 w-1/2 rounded bg-[var(--color-border)]" />
        <div className="h-5 w-1/3 rounded bg-[var(--color-border)]" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4" aria-busy="true">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function PageSectionSkeleton() {
  return (
    <div className="animate-pulse space-y-4 py-10" aria-busy="true">
      <div className="h-8 w-48 rounded bg-[var(--color-border)]" />
      <div className="h-4 w-full max-w-2xl rounded bg-[var(--color-border)]" />
      <div className="h-4 w-full max-w-xl rounded bg-[var(--color-border)]" />
      <div className="h-4 w-full max-w-lg rounded bg-[var(--color-border)]" />
    </div>
  );
}
