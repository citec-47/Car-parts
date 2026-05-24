import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { displayOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-bold">Categories</h2>
        <p className="text-xs text-muted-foreground">
          {categories.length} categories. Edit a category by selecting its products.
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Slug</th>
              <th className="px-4 py-3 font-semibold text-right">Products</th>
              <th className="px-4 py-3 font-semibold">Order</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {categories.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.slug}</td>
                <td className="px-4 py-3 text-right tabular-nums">{c._count.products}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.displayOrder}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/products?category=${c.slug}`}
                    className="text-xs text-brand hover:underline"
                  >
                    View products →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
