import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { deleteProduct, updateProduct } from "../../../actions";
import { ProductForm } from "../../ProductForm";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

function parseSpecsInitial(v: unknown): { label: string; value: string }[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter((s): s is { label: unknown; value: unknown } =>
      typeof s === "object" && s !== null && "label" in s && "value" in s,
    )
    .map((s) => ({ label: String(s.label ?? ""), value: String(s.value ?? "") }))
    .filter((s) => s.label && s.value);
}

export default async function EditProductPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { images: { orderBy: { displayOrder: "asc" } } },
    }),
    prisma.category.findMany({
      orderBy: { displayOrder: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!product) notFound();

  const update = updateProduct.bind(null, product.id);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Products
          </Link>
          <h2 className="mt-1 text-lg font-bold">{product.name}</h2>
          <p className="text-xs text-muted-foreground">SKU {product.sku}</p>
        </div>
        <form action={deleteProduct}>
          <input type="hidden" name="id" value={product.id} />
          <button
            type="submit"
            className="rounded-md border border-destructive/40 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10"
          >
            Delete product
          </button>
        </form>
      </div>

      <ProductForm
        categories={categories}
        action={update}
        submitLabel="Publish changes"
        initial={{
          id: product.id,
          name: product.name,
          sku: product.sku,
          description: product.description,
          brand: product.brand ?? "",
          price: (product.priceCents / 100).toFixed(2),
          salePrice: product.salePriceCents ? (product.salePriceCents / 100).toFixed(2) : "",
          stock: String(product.stock),
          categoryId: product.categoryId,
          isActive: product.isActive,
          isFeatured: product.isFeatured,
          isHotDeal: product.isHotDeal,
          priceOnRequest: product.priceOnRequest,
          specs: parseSpecsInitial(product.specs),
          images: product.images.map((i) => ({ id: i.id, url: i.url })),
        }}
      />
    </div>
  );
}
