import Link from "next/link";
import { HEADER_CATEGORIES } from "@/lib/constants";
import { CATEGORY_ICONS } from "@/lib/category-icons";

export function CategoryRow({ activeSlug }: { activeSlug?: string }) {
  const effectiveActive = activeSlug ?? HEADER_CATEGORIES[0].slug;
  return (
    <div className="w-full border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex gap-1 overflow-x-auto py-2 -mx-1 scrollbar-thin">
          {HEADER_CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.iconKey];
            const isActive = effectiveActive === cat.slug;
            return (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className={`relative shrink-0 flex flex-col items-center justify-center gap-1.5 px-4 py-3 min-w-[110px] rounded-md transition-colors ${
                  isActive
                    ? "bg-brand text-brand-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {isActive ? (
                  <span
                    aria-hidden
                    className="absolute -top-2 left-1/2 -translate-x-1/2 h-2 w-2 rotate-45 bg-brand"
                  />
                ) : null}
                <Icon className="h-6 w-6" strokeWidth={1.75} />
                <span className="text-[11px] font-semibold uppercase tracking-wide whitespace-nowrap">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
