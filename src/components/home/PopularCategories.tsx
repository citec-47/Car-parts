import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { HEADER_CATEGORIES, POPULAR_CATEGORY_SLUGS } from "@/lib/constants";
import { SectionHeading } from "./SectionHeading";

const SAMPLE_SUB = ["Bumpers & Components", "Fenders & Components", "Grilles & Components"];

const CATEGORY_IMAGES: Record<string, string> = {
  "body-parts":
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=400&fit=crop&auto=format",
  electronics:
    "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=400&fit=crop&auto=format",
  lightings:
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&h=400&fit=crop&auto=format",
  performance:
    "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=400&h=400&fit=crop&auto=format",
  "repair-parts":
    "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?w=400&h=400&fit=crop&auto=format",
  suspensions:
    "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?w=400&h=400&fit=crop&auto=format",
};

export function PopularCategories() {
  const categories = POPULAR_CATEGORY_SLUGS.map(
    (slug) => HEADER_CATEGORIES.find((c) => c.slug === slug)!,
  );
  return (
    <section className="mx-auto max-w-7xl px-4 mt-12">
      <SectionHeading>Popular Categories</SectionHeading>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <article
            key={c.slug}
            className="group relative overflow-hidden rounded-lg border border-border bg-card p-5 hover:border-brand/40 hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-foreground">{c.name}</h3>
                <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                  {SAMPLE_SUB.map((s) => (
                    <li key={s} className="flex items-center gap-1.5">
                      <span className="h-1 w-1 rounded-full bg-muted-foreground/60" /> {s}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/categories/${c.slug}`}
                  className="mt-3 inline-flex items-center gap-1 text-xs font-semibold uppercase text-brand hover:gap-2 transition-all"
                >
                  Shop all <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-muted">
                <Image
                  src={CATEGORY_IMAGES[c.slug]}
                  alt={c.name}
                  fill
                  sizes="96px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
