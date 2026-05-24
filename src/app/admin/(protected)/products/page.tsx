import Image from "next/image";
import Link from "next/link";
import { Pencil, Search, Star, Trash2, Zap } from "lucide-react";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { deleteProduct, togglePublishFlag } from "../actions";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{
  q?: string;
  category?: string;
  lowStock?: string;
}>;

const LOW_STOCK_THRESHOLD = 10;

export default async function AdminProductsListPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  const categorySlug = sp.category ?? "";
  const lowStock = sp.lowStock === "1";

  const where: Prisma.ProductWhereInput = {};
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { sku: { contains: q, mode: "insensitive" } },
      { brand: { contains: q, mode: "insensitive" } },
    ];
  }
  if (categorySlug) where.category = { slug: categorySlug };
  if (lowStock) where.stock = { lte: LOW_STOCK_THRESHOLD };

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: { select: { name: true, slug: true } },
        images: { take: 1, orderBy: { displayOrder: "asc" }, select: { url: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { displayOrder: "asc" } }),
  ]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">Products</h2>
          <p className="text-xs text-muted-foreground">{products.length} shown</p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground hover:bg-brand/90"
        >
          + New product
        </Link>
      </div>

      <form className="mb-4 flex flex-wrap items-center gap-2" action="/admin/products">
        <div className="relative grow sm:grow-0">
          <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search by name, SKU, or brand"
            className="w-full sm:w-72 rounded-md border border-border bg-background pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        </div>
        <select
          name="category"
          defaultValue={categorySlug}
          className="rounded-md border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" name="lowStock" value="1" defaultChecked={lowStock} />
          Low stock only
        </label>
        <button
          type="submit"
          className="rounded-md border border-border bg-background px-3 py-2 text-sm hover:bg-muted"
        >
          Apply
        </button>
        {(q || categorySlug || lowStock) ? (
          <Link
            href="/admin/products"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Clear
          </Link>
        ) : null}
      </form>

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-4 py-3 font-semibold">Product</th>
              <th className="px-4 py-3 font-semibold">SKU</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold text-right">Price</th>
              <th className="px-4 py-3 font-semibold text-right">Stock</th>
              <th className="px-4 py-3 font-semibold">Publishing</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                  No products match your filters.
                </td>
              </tr>
            ) : null}
            {products.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                      {p.images[0] ? (
                        <Image src={p.images[0].url} alt="" fill sizes="40px" className="object-cover" />
                      ) : null}
                    </div>
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      className="line-clamp-2 font-medium hover:text-brand"
                    >
                      {p.name}
                    </Link>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{p.sku}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.category.name}</td>
                <td className="px-4 py-3 text-right font-semibold tabular-nums">
                  {formatPrice(p.salePriceCents ?? p.priceCents)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">
                  <span className={p.stock <= LOW_STOCK_THRESHOLD ? "text-amber-600" : ""}>
                    {p.stock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <ToggleButton
                      productId={p.id}
                      field="isActive"
                      active={p.isActive}
                      label="Active"
                    />
                    <ToggleButton
                      productId={p.id}
                      field="isFeatured"
                      active={p.isFeatured}
                      label="Featured"
                      icon={<Star className="h-3 w-3" />}
                    />
                    <ToggleButton
                      productId={p.id}
                      field="isHotDeal"
                      active={p.isHotDeal}
                      label="Hot deal"
                      icon={<Zap className="h-3 w-3" />}
                    />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </Link>
                    <form action={deleteProduct}>
                      <input type="hidden" name="id" value={p.id} />
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </form>
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

function ToggleButton({
  productId,
  field,
  active,
  label,
  icon,
}: {
  productId: string;
  field: "isActive" | "isFeatured" | "isHotDeal";
  active: boolean;
  label: string;
  icon?: React.ReactNode;
}) {
  return (
    <form action={togglePublishFlag}>
      <input type="hidden" name="id" value={productId} />
      <input type="hidden" name="field" value={field} />
      <button
        type="submit"
        title={`Toggle ${label}`}
        className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs ${
          active
            ? "border-brand bg-brand/10 text-brand"
            : "border-border text-muted-foreground hover:bg-muted"
        }`}
      >
        {icon} {label}
      </button>
    </form>
  );
}
