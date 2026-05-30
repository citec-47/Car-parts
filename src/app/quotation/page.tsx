import Link from "next/link";
import { ChevronRight, FileText, Phone, Mail } from "lucide-react";
import { SITE } from "@/lib/constants";

export const metadata = { title: "Request a Quotation" };

export default function QuotationPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-brand">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">Quotation</span>
      </nav>

      <header className="mb-10">
        <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand">
          <FileText className="h-4 w-4" /> Request a Quote
        </p>
        <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold text-foreground">
          Tell us what you need.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Fill out the form below with as much detail as you can about the part or
          engine you&apos;re looking for. We&apos;ll get back to you within 24 hours
          with availability, price, and shipping options.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <form
          action={`mailto:${SITE.email}`}
          method="post"
          encType="text/plain"
          className="space-y-5 rounded-lg border border-border bg-card p-6"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full name" name="name" required />
            <Field label="Email" name="email" type="email" required />
            <Field label="Phone" name="phone" />
            <Field label="Country" name="country" />
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="Vehicle make" name="make" hint="e.g. Honda" />
            <Field label="Vehicle model" name="model" hint="e.g. Civic" />
            <Field label="Year" name="year" hint="e.g. 2005" />
          </div>

          <Field label="Part or engine code" name="partCode" hint="e.g. B16A, K20A, SR20DET" />

          <label className="block text-sm">
            <span className="font-medium">What are you looking for?</span>
            <textarea
              name="message"
              rows={6}
              required
              placeholder="Describe the part you need, any modifications, target condition, and where you'd like it shipped."
              className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-md bg-brand px-5 py-3 text-sm font-bold uppercase tracking-wider text-brand-foreground hover:bg-brand/90"
          >
            Send quotation request
          </button>

          <p className="text-[11px] text-muted-foreground">
            Submitting opens your email client with the details pre-filled. You can
            edit before sending.
          </p>
        </form>

        <aside className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-sm font-bold uppercase tracking-wide">Prefer to talk?</h2>
            <p className="mt-2 text-xs text-muted-foreground">
              Direct line during business hours, or email anytime.
            </p>
            <div className="mt-4 space-y-3 text-sm">
              <a
                href={`tel:${SITE.hotline.replace(/\D/g, "")}`}
                className="inline-flex items-center gap-2 text-foreground hover:text-brand"
              >
                <Phone className="h-4 w-4 text-brand" /> {SITE.hotline}
              </a>
              <a
                href={`mailto:${SITE.email}`}
                className="flex items-center gap-2 text-foreground hover:text-brand"
              >
                <Mail className="h-4 w-4 text-brand" /> {SITE.email}
              </a>
            </div>
          </div>

          <div className="rounded-lg bg-zinc-950 p-6 text-white">
            <h2 className="text-sm font-bold uppercase tracking-wide">
              What we&apos;ll send back
            </h2>
            <ul className="mt-3 space-y-2 text-xs text-white/80">
              <li>• Availability confirmation</li>
              <li>• Price (and any active discount)</li>
              <li>• Mileage / inspection report</li>
              <li>• Shipping cost to your country</li>
              <li>• Expected delivery timeline</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  hint,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  hint?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium">
        {label}
        {hint ? <span className="ml-1 text-xs text-muted-foreground">({hint})</span> : null}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand/30"
      />
    </label>
  );
}
