import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { DeleteCategoryButton } from "../DeleteCategoryButton";

export const dynamic = "force-dynamic";

export default async function DeleteCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      <div className="mb-4">
        <Link
          href="/admin/categories"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to categories
        </Link>
        <h2 className="mt-1 text-lg font-bold">Delete category</h2>
        <p className="text-xs text-muted-foreground">
          Click <span className="font-semibold text-destructive">Delete</span> on any
          category below. You'll be asked to confirm before anything is removed.
        </p>
      </div>

      <div className="mb-4 flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
        <span>
          Deleting a category <strong>also deletes every product</strong> in it, along
          with all of those products' images. Orders that referenced those products are
          preserved (they keep the original name, price, and image), but the products
          themselves and the category will be permanently gone.
        </span>
      </div>

      {categories.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-10 text-center text-sm text-muted-foreground">
          No categories to delete.{" "}
          <Link href="/admin/categories/new" className="text-brand hover:underline">
            Create one first
          </Link>
          .
        </div>
      ) : (
        <ul className="divide-y divide-border rounded-lg border border-border bg-card">
          {categories.map((c) => (
            <li
              key={c.id}
              className="flex items-center justify-between gap-4 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="font-semibold">{c.name}</p>
                <p className="text-xs text-muted-foreground">
                  <code>{c.slug}</code> ·{" "}
                  {c._count.products === 0 ? (
                    <span>no products</span>
                  ) : (
                    <span className="text-amber-700">
                      {c._count.products} product
                      {c._count.products === 1 ? "" : "s"} will also be deleted
                    </span>
                  )}
                </p>
              </div>
              <DeleteCategoryButton
                id={c.id}
                name={c.name}
                productCount={c._count.products}
                variant="full"
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
