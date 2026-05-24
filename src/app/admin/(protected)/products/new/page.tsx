import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { createProduct } from "../../actions";
import { ProductForm } from "../ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { displayOrder: "asc" },
    select: { id: true, name: true },
  });

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
          <h2 className="mt-1 text-lg font-bold">New product</h2>
        </div>
      </div>

      <ProductForm
        categories={categories}
        action={createProduct}
        submitLabel="Create product"
        initial={{
          name: "",
          sku: "",
          description: "",
          brand: "",
          price: "",
          salePrice: "",
          stock: "0",
          categoryId: "",
          isActive: true,
          isFeatured: false,
          isHotDeal: false,
          images: [],
        }}
      />
    </div>
  );
}
