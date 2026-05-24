import { CheckoutForm } from "./CheckoutForm";

export const metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-2xl font-extrabold text-foreground">Checkout</h1>
      <p className="mt-1 mb-8 text-sm text-muted-foreground">
        Guest checkout — your order will be emailed to the address you provide.
      </p>
      <CheckoutForm />
    </div>
  );
}
