"use client";

import { useTransition } from "react";

const ICON_OPTIONS = [
  { value: "", label: "— None —" },
  { value: "body-parts", label: "Body Parts" },
  { value: "electronics", label: "Electronics" },
  { value: "lightings", label: "Lightings" },
  { value: "performance", label: "Performance" },
  { value: "repair-parts", label: "Repair Parts" },
  { value: "suspensions", label: "Suspensions" },
  { value: "accessories", label: "Accessories" },
  { value: "wheels-tires", label: "Wheels & Tires" },
  { value: "tools-garage", label: "Tools & Garage" },
  { value: "engine-drivetrain", label: "Engine & Drivetrain" },
];

export type CategoryFormInitial = {
  name: string;
  iconKey: string;
  description: string;
  displayOrder: string;
  showInFooter: boolean;
};

export function CategoryForm({
  initial,
  action,
  submitLabel,
}: {
  initial: CategoryFormInitial;
  action: (formData: FormData) => Promise<void> | void;
  submitLabel: string;
}) {
  const [pending, startTransition] = useTransition();
  const onSubmit = (fd: FormData) => startTransition(() => action(fd));

  return (
    <form action={onSubmit} className="max-w-2xl space-y-4 rounded-lg border border-border bg-card p-6">
      <label className="block text-sm">
        <span className="font-medium">Name</span>
        <input
          type="text"
          name="name"
          required
          defaultValue={initial.name}
          className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand/30"
        />
      </label>

      <label className="block text-sm">
        <span className="font-medium">
          Icon <span className="text-xs text-muted-foreground">(optional)</span>
        </span>
        <select
          name="iconKey"
          defaultValue={initial.iconKey}
          className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
        >
          {ICON_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm">
        <span className="font-medium">
          Description <span className="text-xs text-muted-foreground">(optional)</span>
        </span>
        <textarea
          name="description"
          rows={3}
          defaultValue={initial.description}
          className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand/30"
        />
      </label>

      <label className="block text-sm">
        <span className="font-medium">
          Display order <span className="text-xs text-muted-foreground">(lower numbers show first)</span>
        </span>
        <input
          type="number"
          name="displayOrder"
          min="0"
          defaultValue={initial.displayOrder}
          className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand/30"
        />
      </label>

      <label className="flex items-start gap-2 cursor-pointer text-sm">
        <input
          type="checkbox"
          name="showInFooter"
          defaultChecked={initial.showInFooter}
          className="mt-0.5 h-4 w-4 rounded border-border"
        />
        <span>
          <span className="font-medium">Show in footer</span>
          <span className="ml-1 text-xs text-muted-foreground">
            — appears in the &ldquo;Shop&rdquo; list at the bottom of every page (max 8)
          </span>
        </span>
      </label>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-brand px-5 py-2 text-sm font-semibold text-brand-foreground hover:bg-brand/90 disabled:opacity-60"
        >
          {pending ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
