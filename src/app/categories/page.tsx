import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata = { title: "Categories" };

export default async function CategoriesIndexPage() {
  let categories: { id: string; name: string; slug: string; _count: { products: number } }[] = [];
  try {
    categories = await prisma.category.findMany({
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
      include: { _count: { select: { products: true } } },
    });
  } catch (err) {
    console.error("[CategoriesIndex] DB lookup failed:", err);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-brand">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">Categories</span>
      </nav>

      <header className="mb-10">
        <h1 className="text-3xl font-extrabold text-foreground">All Categories</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {categories.length} {categories.length === 1 ? "category" : "categories"} available
        </p>
      </header>

      {categories.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-16 text-center text-sm text-muted-foreground">
          No categories yet — check back soon.
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <li key={c.id}>
              <Link
                href={`/categories/${c.slug}`}
                className="group flex items-center justify-between rounded-lg border border-border bg-card p-5 transition-all hover:border-brand/40 hover:shadow-sm"
              >
                <span>
                  <p className="text-base font-bold text-foreground group-hover:text-brand">
                    {c.name}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {c._count.products} {c._count.products === 1 ? "product" : "products"}
                  </p>
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-brand" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
