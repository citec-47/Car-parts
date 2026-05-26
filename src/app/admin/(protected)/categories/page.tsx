import Link from "next/link";
import { CheckCircle2, Pencil } from "lucide-react";
import { prisma } from "@/lib/db";
import { DeleteCategoryButton } from "./DeleteCategoryButton";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{
  ok?: string;
}>;

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const categories = await prisma.category.findMany({
    orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Categories</h2>
          <p className="text-xs text-muted-foreground">{categories.length} categories</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground hover:bg-brand/90"
        >
          + New category
        </Link>
      </div>

      {sp.ok ? (
        <div className="mb-4 inline-flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
          <CheckCircle2 className="h-4 w-4" />
          {sp.ok === "created"
            ? "Category created."
            : sp.ok === "deleted"
              ? "Category deleted."
              : "Saved."}
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Slug</th>
              <th className="px-4 py-3 font-semibold">Icon</th>
              <th className="px-4 py-3 font-semibold text-right">Products</th>
              <th className="px-4 py-3 font-semibold text-right">Order</th>
              <th className="px-4 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                  No categories yet.{" "}
                  <Link href="/admin/categories/new" className="text-brand hover:underline">
                    Create your first one
                  </Link>
                  .
                </td>
              </tr>
            ) : null}
            {categories.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  <code className="text-xs">{c.slug}</code>
                </td>
                <td className="px-4 py-3 text-muted-foreground text-xs">
                  {c.iconKey ?? <span className="text-muted-foreground/60">—</span>}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">
                  <Link
                    href={`/admin/products?category=${c.slug}`}
                    className="text-brand hover:underline"
                  >
                    {c._count.products}
                  </Link>
                </td>
                <td className="px-4 py-3 text-right text-muted-foreground tabular-nums">
                  {c.displayOrder}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/categories/${c.id}/edit`}
                      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </Link>
                    <DeleteCategoryButton
                      id={c.id}
                      name={c.name}
                      productCount={c._count.products}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
