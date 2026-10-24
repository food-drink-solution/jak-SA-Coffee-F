"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutGrid, List, Search } from "lucide-react";
import type { Locale } from "@/config/locales";
import { Dropdown, type DropdownOption } from "@/components/ui/dropdown";
import { SORT_KEYS, type SortKey } from "@/lib/listing";

export type ListingView = "grid" | "list";

interface ProductToolbarProps {
  basePath: string;
  locale: Locale;
  q?: string;
  category?: string;
  sort: SortKey;
  view: ListingView;
  onViewChange: (view: ListingView) => void;
  categories: Array<{ id: string; name: string }>;
  showSearch: boolean;
  showCategoryFilter: boolean;
  labels: {
    searchPlaceholder: string;
    searchSubmit: string;
    categoryLabel: string;
    allCategories: string;
    sortLabel: string;
    sortOptions: Record<SortKey, string>;
    viewLabel: string;
    viewGrid: string;
    viewList: string;
  };
}

/**
 * Listing controls: search form, category filter and sort as URL-driven
 * dropdowns (via router.replace so the list updates without a full reload),
 * plus a grid/list view toggle.
 */
export function ProductToolbar({
  basePath,
  q,
  category,
  sort,
  view,
  onViewChange,
  categories,
  showSearch,
  showCategoryFilter,
  labels,
}: ProductToolbarProps) {
  const router = useRouter();
  const [qInput, setQInput] = useState(q ?? "");

  // Keep the search box in sync when the URL changes externally (back/forward).
  // Adjust state during render rather than in an effect (react.dev "you might not need an effect").
  const [prevQ, setPrevQ] = useState(q);
  if (prevQ !== q) {
    setPrevQ(q);
    setQInput(q ?? "");
  }

  function navigate(next: { q?: string; category?: string; sort?: SortKey }) {
    const params = new URLSearchParams();
    const query = next.q !== undefined ? next.q : (q ?? "");
    const cat = next.category !== undefined ? next.category : (category ?? "");
    const s = next.sort !== undefined ? next.sort : sort;
    if (query) params.set("q", query);
    if (cat) params.set("category", cat);
    if (s && s !== "default") params.set("sort", s);
    const qs = params.toString();
    // Reset pagination (page 1) on any filter/sort change; never preserve it.
    router.replace(qs ? `${basePath}?${qs}` : basePath, { scroll: false });
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate({ q: qInput });
  }

  const sortOptions: DropdownOption[] = SORT_KEYS.map((key) => ({ value: key, label: labels.sortOptions[key] }));
  const categoryOptions: DropdownOption[] = [
    { value: "", label: labels.allCategories },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ];

  return (
    <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      {showSearch ? (
        <form onSubmit={onSubmit} className="flex w-full flex-1 items-center gap-2 sm:gap-3 lg:max-w-md" role="search">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">{labels.searchPlaceholder}</span>
            <input
              name="q"
              value={qInput}
              onChange={(e) => setQInput(e.target.value)}
              placeholder={labels.searchPlaceholder}
              className="h-11 min-h-[44px] w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] transition-colors focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]/30"
            />
          </label>
          <button
            type="submit"
            className="inline-flex h-11 min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-primary)] px-4 sm:px-6 text-sm font-extrabold text-white transition-all hover:bg-[var(--color-primary-dark)] active:scale-[0.98] focus-ring cursor-pointer"
          >
            <Search className="h-4 w-4" aria-hidden />
            <span className="hidden min-[380px]:inline">{labels.searchSubmit}</span>
          </button>
        </form>
      ) : null}

      <div className={`flex flex-wrap items-center gap-2.5 sm:gap-3 ${showSearch ? "w-full lg:w-auto justify-between lg:justify-end" : "w-full justify-between sm:justify-start"}`}>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 flex-1 sm:flex-initial">
          {showCategoryFilter ? (
            <div className="min-w-[130px] flex-1 sm:flex-initial sm:w-44">
              <Dropdown
                label={labels.categoryLabel}
                value={category ?? ""}
                options={categoryOptions}
                onChange={(value) => navigate({ category: value })}
              />
            </div>
          ) : null}
          <div className="min-w-[130px] flex-1 sm:flex-initial sm:w-44">
            <Dropdown
              label={labels.sortLabel}
              value={sort}
              options={sortOptions}
              onChange={(value) => navigate({ sort: value as SortKey })}
            />
          </div>
        </div>
        <div
          role="group"
          aria-label={labels.viewLabel}
          className="flex shrink-0 overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)]"
        >
          <ViewButton
            active={view === "grid"}
            label={labels.viewGrid}
            onClick={() => onViewChange("grid")}
            icon={<LayoutGrid className="h-4 w-4" aria-hidden />}
          />
          <ViewButton
            active={view === "list"}
            label={labels.viewList}
            onClick={() => onViewChange("list")}
            icon={<List className="h-4 w-4" aria-hidden />}
          />
        </div>
      </div>
    </div>
  );
}

function ViewButton({
  active,
  label,
  onClick,
  icon,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`inline-flex h-11 w-11 items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)] ${
        active ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-surface)] text-[var(--color-foreground)] hover:bg-[var(--color-surface-muted)]"
      }`}
    >
      {icon}
    </button>
  );
}
