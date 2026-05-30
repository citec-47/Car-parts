import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/db";
import { createProduct } from "../../actions";
import { ProductForm } from "../ProductForm";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ categoryId?: string; flow?: string }>;

export default async function NewProductPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { categoryId: preCategoryId, flow } = await searchParams;
  const inFlow = flow === "1";

  const categories = await prisma.category.findMany({
    orderBy: { displayOrder: "asc" },
    select: { id: true, name: true },
  });

  // Resolve the active flow category (if any) so we can show its name in the header.
  const flowCategory =
    inFlow && preCategoryId
      ? categories.find((c) => c.id === preCategoryId) ?? null
      : null;

  return (
    <div>
      <div className="mb-4">
        <Link
          href={flowCategory ? `/admin/categories/${flowCategory.id}/products` : "/admin/products"}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {flowCategory ? `${flowCategory.name} workflow` : "Products"}
        </Link>
        <h2 className="mt-1 text-lg font-bold">
          {flowCategory ? `New product in ${flowCategory.name}` : "New product"}
        </h2>
        {flowCategory ? (
          <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-emerald-700">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Category locked to <strong className="font-semibold">{flowCategory.name}</strong>.
            After publish, you&apos;ll return to the workflow to add another or move on.
          </p>
        ) : null}
      </div>

      <ProductForm
        categories={categories}
        action={createProduct}
        submitLabel={flowCategory ? `Publish in ${flowCategory.name}` : "Publish product"}
        lockedCategoryId={flowCategory?.id}
        flowCategoryId={flowCategory?.id}
        initial={{
          name: "",
          sku: "",
          description: "",
          brand: "",
          price: "",
          salePrice: "",
          stock: "0",
          categoryId: preCategoryId ?? "",
          isActive: true,
          isFeatured: false,
          isHotDeal: false,
          priceOnRequest: false,
          specs: [],
          images: [],
        }}
      />
    </div>
  );
}
