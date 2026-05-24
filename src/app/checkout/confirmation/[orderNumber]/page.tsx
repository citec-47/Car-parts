import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Package, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import type { ShippingAddress } from "@/lib/types";

type RouteParams = Promise<{ orderNumber: string }>;

export const metadata = { title: "Order Confirmation" };
export const dynamic = "force-dynamic";

export default async function ConfirmationPage({ params }: { params: RouteParams }) {
  const { orderNumber } = await params;
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });
  if (!order) notFound();

  const address = order.shippingAddress as unknown as ShippingAddress;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <div className="text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" strokeWidth={1.5} />
        <h1 className="mt-4 text-3xl font-extrabold">Thanks, {order.customerName.split(" ")[0]}!</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your order <span className="font-semibold text-foreground">{order.orderNumber}</span> has
          been received. A confirmation email will go to{" "}
          <span className="font-semibold text-foreground">{order.email}</span>.
        </p>
        <p className="mt-1 text-xs text-amber-700 bg-amber-50 inline-block px-2 py-1 rounded-md">
          Payment is a placeholder in v1 — no charge was processed.
        </p>
      </div>

      <div className="mt-10 rounded-lg border border-border bg-card">
        <div className="border-b border-border p-5 flex items-center gap-2">
          <Package className="h-4 w-4 text-brand" />
          <h2 className="text-sm font-bold uppercase tracking-wide">Order summary</h2>
        </div>
        <ul className="divide-y divide-border">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-4 p-5 text-sm">
              <div>
                <p className="font-semibold">{item.productName}</p>
                <p className="text-xs text-muted-foreground">
                  Qty {item.quantity} · {formatPrice(item.unitPriceCents)} each
                </p>
              </div>
              <span className="font-semibold tabular-nums">
                {formatPrice(item.lineTotalCents)}
              </span>
            </li>
          ))}
        </ul>
        <dl className="space-y-1.5 border-t border-border p-5 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Subtotal</dt>
            <dd>{formatPrice(order.subtotalCents)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Shipping</dt>
            <dd>
              {order.shippingCents === 0 ? (
                <span className="text-emerald-600">Free</span>
              ) : (
                formatPrice(order.shippingCents)
              )}
            </dd>
          </div>
          <div className="mt-1 flex justify-between border-t border-border pt-2 text-base">
            <dt className="font-bold">Total</dt>
            <dd className="font-extrabold text-brand">{formatPrice(order.totalCents)}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-6 rounded-lg border border-border bg-card p-5 text-sm">
        <h3 className="text-sm font-bold uppercase tracking-wide">Shipping to</h3>
        <address className="mt-3 not-italic text-muted-foreground">
          <p className="text-foreground font-semibold">{order.customerName}</p>
          <p>{address.line1}</p>
          {address.line2 ? <p>{address.line2}</p> : null}
          <p>
            {address.city}, {address.state} {address.postalCode}
          </p>
          <p>{address.country}</p>
        </address>
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground hover:bg-brand/90"
        >
          Continue shopping <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
