import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  LayoutDashboard,
  Pencil,
  Plus,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { deleteProduct, togglePublishFlag } from "../../../actions";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ ok?: string; name?: string }>;

export default async function CategoryProductsWorkflowPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { id } = await params;
  const { ok, name: okName } = await searchParams;

  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      products: {
        orderBy: { createdAt: "desc" },
        include: {
          images: { take: 1, orderBy: { displayOrder: "asc" }, select: { url: true } },
        },
      },
    },
  });
  if (!category) notFound();

  const productCount = category.products.length;

  return (
    <div>
      <div className="mb-4">
        <Link
          href="/admin/categories"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Categories
        </Link>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
              Step 2 · Add products
            </p>
            <h2 className="mt-1 text-2xl font-extrabold">{category.name}</h2>
            <p className="text-xs text-muted-foreground">
              {productCount} {productCount === 1 ? "product" : "products"} so far
            </p>
          </div>
          <Link
            href={`/admin/products/new?categoryId=${category.id}&flow=1`}
            className="inline-flex items-center gap-1.5 rounded-md bg-brand px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-brand-foreground hover:bg-brand/90"
          >
            <Plus className="h-4 w-4" /> Add product to {category.name}
          </Link>
        </div>
      </div>

      {ok === "category-created" ? (
        <div className="mb-4 inline-flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
          <CheckCircle2 className="h-4 w-4" />
          Category created. Now add products to it.
        </div>
      ) : ok === "product-created" ? (
        <div className="mb-4 inline-flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
          <CheckCircle2 className="h-4 w-4" />
          Published &ldquo;{okName ?? "product"}&rdquo;. Add another, or move on to the next category.
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-4 py-3 font-semibold">Product</th>
              <th className="px-4 py-3 font-semibold">SKU</th>
              <th className="px-4 py-3 font-semibold text-right">Price</th>
              <th className="px-4 py-3 font-semibold text-right">Stock</th>
              <th className="px-4 py-3 font-semibold">Publishing</th>
              <th className="px-4 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {productCount === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-16 text-center">
                  <p className="text-sm text-muted-foreground">
                    No products yet in {category.name}.
                  </p>
                  <Link
                    href={`/admin/products/new?categoryId=${category.id}&flow=1`}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add the first one
                  </Link>
                </td>
              </tr>
            ) : null}
            {category.products.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                      {p.images[0] ? (
                        <Image
                          src={p.images[0].url}
                          alt=""
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
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
                <td className="px-4 py-3 text-right font-semibold tabular-nums">
                  {formatPrice(p.salePriceCents ?? p.priceCents)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">{p.stock}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge active={p.isActive}>Active</Badge>
                    <Badge active={p.isFeatured}>Featured</Badge>
                    <Badge active={p.isHotDeal}>Hot deal</Badge>
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
                        Delete
                      </button>
                    </form>
                    <form action={togglePublishFlag}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="field" value="isFeatured" />
                      <button
                        type="submit"
                        className="hidden text-xs"
                        aria-hidden
                      />
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link
          href="/admin/categories/new"
          className="group flex items-center justify-between rounded-lg border border-brand bg-brand/5 px-5 py-4 transition-colors hover:bg-brand/10"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-brand">
              Done with {category.name}?
            </p>
            <p className="mt-0.5 text-sm font-semibold text-foreground">
              Create the next category
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-brand transition-transform group-hover:translate-x-1" />
        </Link>

        <Link
          href="/admin"
          className="group flex items-center justify-between rounded-lg border border-border bg-card px-5 py-4 transition-colors hover:bg-muted/40"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Finished for now
            </p>
            <p className="mt-0.5 text-sm font-semibold text-foreground">
              Back to dashboard
            </p>
          </div>
          <LayoutDashboard className="h-5 w-5 text-muted-foreground" />
        </Link>
      </div>
    </div>
  );
}

function Badge({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase ${
        active
          ? "border-brand bg-brand/10 text-brand"
          : "border-border text-muted-foreground"
      }`}
    >
      {children}
    </span>
  );
}
