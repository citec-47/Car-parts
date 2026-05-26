import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/db";
import { SectionHeading } from "./SectionHeading";

const FALLBACK_THUMB =
  "https://images.unsplash.com/photo-1486754735734-325b5831c3ad?w=400&h=400&fit=crop&auto=format";

const SLUG_THUMB: Record<string, string> = {
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

type PopularCategory = {
  name: string;
  slug: string;
  products: { name: string; images: { url: string }[] }[];
};

export async function PopularCategories() {
  let categories: PopularCategory[] = [];
  try {
    categories = await prisma.category.findMany({
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
      take: 6,
      include: {
        products: {
          where: { isActive: true },
          take: 3,
          orderBy: { createdAt: "desc" },
          select: {
            name: true,
            images: { take: 1, orderBy: { displayOrder: "asc" }, select: { url: true } },
          },
        },
      },
    });
  } catch (err) {
    console.error("[PopularCategories] DB lookup failed:", err);
    return null;
  }

  if (categories.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 mt-12">
      <SectionHeading>Popular Categories</SectionHeading>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => {
          const productThumb = c.products[0]?.images[0]?.url;
          const thumb = productThumb ?? SLUG_THUMB[c.slug] ?? FALLBACK_THUMB;
          const sample = c.products.map((p) => p.name);
          return (
            <article
              key={c.slug}
              className="group relative overflow-hidden rounded-lg border border-border bg-card p-5 hover:border-brand/40 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-foreground">{c.name}</h3>
                  {sample.length ? (
                    <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                      {sample.map((s) => (
                        <li key={s} className="flex items-center gap-1.5">
                          <span className="h-1 w-1 rounded-full bg-muted-foreground/60" />
                          <span className="truncate">{s}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-xs text-muted-foreground">
                      No products yet.
                    </p>
                  )}
                  <Link
                    href={`/categories/${c.slug}`}
                    className="mt-3 inline-flex items-center gap-1 text-xs font-semibold uppercase text-brand hover:gap-2 transition-all"
                  >
                    Shop all <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-muted">
                  <Image
                    src={thumb}
                    alt={c.name}
                    fill
                    sizes="96px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
