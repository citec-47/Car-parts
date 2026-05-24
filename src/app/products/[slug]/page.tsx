import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Check, Truck, ShieldCheck, RefreshCw } from "lucide-react";
import { getProductBySlug, getProductsByCategory } from "@/lib/data";
import { formatPrice, calculateDiscountPercent } from "@/lib/format";
import { StarRating } from "@/components/product/StarRating";
import { ProductDetailActions } from "@/components/product/ProductDetailActions";
import { ProductGrid } from "@/components/product/ProductGrid";
import { HEADER_CATEGORIES } from "@/lib/constants";

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

  const category = HEADER_CATEGORIES.find((c) => c.slug === product.categorySlug);
  const related = (await getProductsByCategory(product.categorySlug)).filter(
    (p) => p.id !== product.id,
  );
  const img = product.images[0];
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
        <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-border bg-card">
          {img ? (
            <Image
              src={img.url}
              alt={img.altText ?? product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 600px"
              className="object-cover"
              priority
            />
          ) : (
            <div className="h-full w-full bg-muted" />
          )}
          {discount > 0 ? (
            <span className="absolute left-4 top-4 inline-flex items-center rounded-sm bg-brand px-2.5 py-1 text-xs font-bold text-brand-foreground uppercase">
              -{discount}%
            </span>
          ) : null}
        </div>

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
          <div className="mt-4 flex items-center gap-2 text-sm">
            {inStock ? (
              <>
                <Check className="h-4 w-4 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">
                  In stock — {product.stock} available
                </span>
              </>
            ) : (
              <span className="text-destructive font-semibold">Out of stock</span>
            )}
          </div>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

          <div className="mt-6">
            <ProductDetailActions product={product} />
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

      {related.length > 0 ? (
        <section className="mt-16">
          <h2 className="mb-6 text-lg font-extrabold uppercase tracking-wide">Related products</h2>
          <ProductGrid products={related.slice(0, 4)} />
        </section>
      ) : null}
    </div>
  );
}
