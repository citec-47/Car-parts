import Link from "next/link";
import { ChevronRight, MapPin, Phone, Mail, Clock } from "lucide-react";
import { SITE } from "@/lib/constants";

export const metadata = { title: "Contact us" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-brand">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">Contact us</span>
      </nav>

      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground">
          Get in touch.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Questions about an engine, shipping, or warranty? Drop us a line —
          we read every message and reply within one business day.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <form
          action={`mailto:${SITE.email}`}
          method="post"
          encType="text/plain"
          className="space-y-5 rounded-lg border border-border bg-card p-6"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full name" name="name" required />
            <Field label="Email" name="email" type="email" required />
          </div>
          <Field label="Subject" name="subject" required />
          <label className="block text-sm">
            <span className="font-medium">Message</span>
            <textarea
              name="message"
              rows={7}
              required
              className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-md bg-brand px-5 py-3 text-sm font-bold uppercase tracking-wider text-brand-foreground hover:bg-brand/90"
          >
            Send message
          </button>
        </form>

        <aside className="space-y-4">
          <Card icon={<Phone className="h-5 w-5" />} label="Hotline">
            <a href={`tel:${SITE.hotline.replace(/\D/g, "")}`} className="hover:text-brand">
              {SITE.hotline}
            </a>
          </Card>
          <Card icon={<Mail className="h-5 w-5" />} label="Email">
            <a href={`mailto:${SITE.email}`} className="hover:text-brand">
              {SITE.email}
            </a>
          </Card>
          <Card icon={<Clock className="h-5 w-5" />} label="Hours">
            Mon–Fri, 9:00 – 18:00
            <br />
            Sat, 10:00 – 14:00
          </Card>
          <Card icon={<MapPin className="h-5 w-5" />} label="Warehouse">
            Address available on request after order is placed.
          </Card>
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
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium">{label}</span>
      <input
        type={type}
        name={name}
        required={required}
        className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand/30"
      />
    </label>
  );
}

function Card({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-brand/10 text-brand">
          {icon}
        </span>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="mt-1 text-sm text-foreground">{children}</p>
        </div>
      </div>
    </div>
  );
}
