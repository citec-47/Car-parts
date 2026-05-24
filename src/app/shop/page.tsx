import { getAllProducts, getProductsByCategory, searchProducts } from "@/lib/data";
import { ProductGrid } from "@/components/product/ProductGrid";
import { HEADER_CATEGORIES } from "@/lib/constants";

type SearchParams = Promise<{ q?: string; category?: string }>;

export const metadata = { title: "Shop" };

export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const { q, category } = await searchParams;
  let products = await getAllProducts();
  if (category) products = await getProductsByCategory(category);
  if (q) {
    const searched = await searchProducts(q);
    products = category ? products.filter((p) => searched.some((s) => s.id === p.id)) : searched;
  }
  const activeCategory = HEADER_CATEGORIES.find((c) => c.slug === category);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-foreground">
          {activeCategory ? activeCategory.name : "All Products"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {products.length} product{products.length === 1 ? "" : "s"}
          {q ? <> matching “{q}”</> : null}
        </p>
      </div>
      <ProductGrid products={products} />
    </div>
  );
}
