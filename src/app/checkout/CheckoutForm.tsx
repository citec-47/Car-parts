"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Lock, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice, calculateShipping } from "@/lib/format";
import { SHIPPING } from "@/lib/constants";
import { placeOrderAction } from "./actions";

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

const initial: FormState = {
  fullName: "",
  email: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "United States",
};

export function CheckoutForm() {
  const router = useRouter();
  const { cart, subtotalCents, clear, isHydrated } = useCart();
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const shipping = calculateShipping(
    subtotalCents,
    SHIPPING.freeShippingThresholdCents,
    SHIPPING.flatRateCents,
  );
  const total = subtotalCents + shipping;

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((s) => ({ ...s, [k]: e.target.value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSubmitError(null);
    startTransition(async () => {
      const res = await placeOrderAction({
        address: form,
        items: cart.items,
      });
      if (!res.ok) {
        setSubmitError(res.error);
        if (res.fieldErrors) setErrors(res.fieldErrors);
        return;
      }
      clear();
      router.push(`/checkout/confirmation/${res.orderNumber}`);
    });
  };

  if (isHydrated && cart.items.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-border p-8 text-center text-muted-foreground">
        Your cart is empty. <a className="text-brand underline" href="/shop">Browse parts</a>.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-8">
        <section className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-base font-bold uppercase tracking-wide">Contact</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Full name" name="fullName" value={form.fullName} onChange={set("fullName")} errors={errors.fullName} required />
            <Field label="Email" name="email" type="email" value={form.email} onChange={set("email")} errors={errors.email} required />
            <Field label="Phone (optional)" name="phone" value={form.phone} onChange={set("phone")} errors={errors.phone} />
          </div>
        </section>

        <section className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-base font-bold uppercase tracking-wide">Shipping address</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field className="sm:col-span-2" label="Address line 1" name="line1" value={form.line1} onChange={set("line1")} errors={errors.line1} required />
            <Field className="sm:col-span-2" label="Address line 2 (optional)" name="line2" value={form.line2} onChange={set("line2")} errors={errors.line2} />
            <Field label="City" name="city" value={form.city} onChange={set("city")} errors={errors.city} required />
            <Field label="State / Province" name="state" value={form.state} onChange={set("state")} errors={errors.state} required />
            <Field label="Postal code" name="postalCode" value={form.postalCode} onChange={set("postalCode")} errors={errors.postalCode} required />
            <Field label="Country" name="country" value={form.country} onChange={set("country")} errors={errors.country} required />
          </div>
        </section>

        <section className="rounded-lg border border-dashed border-border bg-muted/30 p-6">
          <div className="flex items-start gap-3">
            <CreditCard className="h-5 w-5 text-brand mt-0.5" />
            <div>
              <h2 className="text-base font-bold uppercase tracking-wide">Payment</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Payment is a placeholder in v1 — your order will be marked unpaid. Real
                Stripe/PayPal will be wired up later.
              </p>
            </div>
          </div>
        </section>
      </div>

      <aside className="rounded-lg border border-border bg-card p-5 h-fit lg:sticky lg:top-4">
        <h2 className="text-base font-bold uppercase tracking-wide">Your order</h2>
        <ul className="mt-4 space-y-3 max-h-64 overflow-y-auto pr-1">
          {cart.items.map((i) => (
            <li key={i.productId} className="flex justify-between gap-2 text-sm">
              <span className="line-clamp-2 flex-1">
                {i.name} <span className="text-muted-foreground">× {i.quantity}</span>
              </span>
              <span className="font-semibold tabular-nums">
                {formatPrice(i.unitPriceCents * i.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-1.5 border-t border-border pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Subtotal</dt>
            <dd className="font-semibold">{formatPrice(subtotalCents)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Shipping</dt>
            <dd className="font-semibold">
              {shipping === 0 ? <span className="text-emerald-600">Free</span> : formatPrice(shipping)}
            </dd>
          </div>
          <div className="mt-2 flex justify-between border-t border-border pt-2 text-base">
            <dt className="font-bold">Total</dt>
            <dd className="font-extrabold text-brand">{formatPrice(total)}</dd>
          </div>
        </dl>
        {submitError ? (
          <p className="mt-3 text-xs text-destructive">{submitError}</p>
        ) : null}
        <button
          type="submit"
          disabled={isPending || cart.items.length === 0}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-brand px-5 py-3 text-sm font-semibold text-brand-foreground hover:bg-brand/90 transition-colors disabled:opacity-60"
        >
          {isPending ? "Placing order…" : <>Place order <ArrowRight className="h-4 w-4" /></>}
        </button>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
          <Lock className="h-3 w-3" /> Guest checkout — no account needed
        </p>
      </aside>
    </form>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  required,
  errors,
  className = "",
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  errors?: string[];
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-1.5 text-sm ${className}`}>
      <span className="font-medium text-foreground">
        {label}
        {required ? <span className="text-destructive ml-0.5">*</span> : null}
      </span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/40"
      />
      {errors?.length ? (
        <span className="text-xs text-destructive">{errors[0]}</span>
      ) : null}
    </label>
  );
}
