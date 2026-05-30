import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Check, Truck, ShieldCheck, RefreshCw, Mail } from "lucide-react";
import {
  getCategoryBySlug,
  getProductBySlug,
  getProductsByCategory,
} from "@/lib/data";
import { formatPrice, calculateDiscountPercent } from "@/lib/format";
import { StarRating } from "@/components/product/StarRating";
import { ProductDetailActions } from "@/components/product/ProductDetailActions";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductSpecsTable } from "@/components/product/ProductSpecsTable";
import { ProductDetailTabs } from "@/components/product/ProductDetailTabs";

type RouteParams = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: RouteParams }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return { title: product?.name ?? "Product" };
}

export default async function ProductPage({ params }: { params: RouteParams }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [category, relatedAll] = await Promise.all([
    getCategoryBySlug(product.categorySlug),
    getProductsByCategory(product.categorySlug),
  ]);
  const related = relatedAll.filter((p) => p.id !== product.id);
  const discount = product.salePriceCents
    ? calculateDiscountPercent(product.priceCents, product.salePriceCents)
    : 0;
  const inStock = product.stock > 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-brand">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/shop" className="hover:text-brand">Shop</Link>
        {category ? (
          <>
            <ChevronRight className="h-3 w-3" />
            <Link href={`/categories/${category.slug}`} className="hover:text-brand">
              {category.name}
            </Link>
          </>
        ) : null}
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery
          images={product.images}
          name={product.name}
          discount={discount}
        />

        <div>
          {product.brand ? (
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {product.brand}
            </p>
          ) : null}
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-foreground">
            {product.name}
          </h1>
          <div className="mt-3 flex items-center gap-3">
            <StarRating value={product.rating} count={product.reviewCount} />
            <span className="text-xs text-muted-foreground">SKU: {product.sku}</span>
          </div>

          {product.specs.length > 0 ? (
            <div className="mt-5">
              <ProductSpecsTable specs={product.specs} />
            </div>
          ) : null}

          {product.priceOnRequest ? (
            <div className="mt-6">
              <p className="text-lg font-bold text-foreground">Contact for Price</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Price varies by inspection. Send us an enquiry and we&apos;ll get back
                within 24 hours.
              </p>
            </div>
          ) : (
            <div className="mt-5 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-brand">
                {formatPrice(product.salePriceCents ?? product.priceCents)}
              </span>
              {product.salePriceCents ? (
                <span className="text-base text-muted-foreground line-through">
                  {formatPrice(product.priceCents)}
                </span>
              ) : null}
            </div>
          )}

          <div className="mt-4 flex items-center gap-2 text-sm">
            {inStock ? (
              <>
                <Check className="h-4 w-4 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">
                  In stock — Ships in 24hrs
                </span>
              </>
            ) : (
              <span className="text-destructive font-semibold">Out of stock</span>
            )}
          </div>

          <div className="mt-6">
            {product.priceOnRequest ? (
              <a
                href={`mailto:?subject=${encodeURIComponent(
                  `Enquiry: ${product.name} (SKU ${product.sku})`,
                )}`}
                className="inline-flex items-center gap-2 rounded-md bg-brand px-6 py-3 text-sm font-bold uppercase tracking-wide text-brand-foreground hover:bg-brand/90"
              >
                <Mail className="h-4 w-4" /> Product / Price Enquiry
              </a>
            ) : (
              <ProductDetailActions product={product} />
            )}
          </div>

          <ul className="mt-8 grid gap-3 sm:grid-cols-3 text-xs">
            <li className="flex items-center gap-2 rounded-md border border-border p-3">
              <Truck className="h-4 w-4 text-brand" /> Free shipping over $60
            </li>
            <li className="flex items-center gap-2 rounded-md border border-border p-3">
              <RefreshCw className="h-4 w-4 text-brand" /> 7-day returns
            </li>
            <li className="flex items-center gap-2 rounded-md border border-border p-3">
              <ShieldCheck className="h-4 w-4 text-brand" /> Secure payment
            </li>
          </ul>
        </div>
      </div>

      <ProductDetailTabs
        description={product.description}
        rating={product.rating}
        reviewCount={product.reviewCount}
      />

      {related.length > 0 ? (
        <section className="mt-16">
          <h2 className="mb-6 text-lg font-extrabold uppercase tracking-wide">Related products</h2>
          <ProductGrid products={related.slice(0, 4)} />
        </section>
      ) : null}
    </div>
  );
}
