"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { Trash2, Upload } from "lucide-react";

type Category = { id: string; name: string };

type ExistingImage = { id: string; url: string };

export type ProductFormInitial = {
  id?: string;
  name: string;
  sku: string;
  description: string;
  brand: string;
  price: string;
  salePrice: string;
  stock: string;
  categoryId: string;
  isActive: boolean;
  isFeatured: boolean;
  isHotDeal: boolean;
  images: ExistingImage[];
};

export function ProductForm({
  initial,
  categories,
  action,
  submitLabel,
  onDeleteImage,
}: {
  initial: ProductFormInitial;
  categories: Category[];
  action: (formData: FormData) => Promise<void> | void;
  submitLabel: string;
  onDeleteImage?: (formData: FormData) => Promise<void> | void;
}) {
  const [pending, startTransition] = useTransition();
  const [files, setFiles] = useState<File[]>([]);

  const previews = files.map((f) => ({ name: f.name, src: URL.createObjectURL(f) }));

  const onSubmit = (formData: FormData) => {
    startTransition(() => action(formData));
  };

  return (
    <form action={onSubmit} className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <section className="rounded-lg border border-border bg-card p-5">
          <h3 className="text-sm font-semibold mb-4">Basics</h3>
          <div className="grid gap-4">
            <Field label="Name" name="name" required defaultValue={initial.name} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="SKU" name="sku" required defaultValue={initial.sku} />
              <Field label="Brand" name="brand" defaultValue={initial.brand} />
            </div>
            <label className="block text-sm">
              <span className="font-medium">Description</span>
              <textarea
                name="description"
                rows={4}
                defaultValue={initial.description}
                className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand/30"
              />
            </label>
          </div>
        </section>

        <section className="rounded-lg border border-border bg-card p-5">
          <h3 className="text-sm font-semibold mb-4">Pricing & inventory</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field
              label="Price (USD)"
              name="price"
              type="number"
              step="0.01"
              min="0"
              required
              defaultValue={initial.price}
            />
            <Field
              label="Sale price (USD)"
              name="salePrice"
              type="number"
              step="0.01"
              min="0"
              defaultValue={initial.salePrice}
              hint="Optional"
            />
            <Field
              label="Stock"
              name="stock"
              type="number"
              min="0"
              defaultValue={initial.stock}
            />
          </div>
        </section>

        <section className="rounded-lg border border-border bg-card p-5">
          <h3 className="text-sm font-semibold mb-4">Images</h3>
          {initial.images.length ? (
            <div className="mb-4 grid gap-3 grid-cols-2 sm:grid-cols-4">
              {initial.images.map((img) => (
                <div key={img.id} className="relative aspect-square overflow-hidden rounded-md border border-border bg-muted">
                  <Image src={img.url} alt="" fill sizes="160px" className="object-cover" />
                  {onDeleteImage ? (
                    <form action={onDeleteImage} className="absolute right-1 top-1">
                      <input type="hidden" name="imageId" value={img.id} />
                      <input type="hidden" name="productId" value={initial.id ?? ""} />
                      <button
                        type="submit"
                        title="Remove image"
                        className="rounded-md bg-black/60 p-1 text-white hover:bg-black/80"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </form>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}

          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-border bg-background py-8 hover:bg-muted/40">
            <Upload className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Click to add image(s)
            </span>
            <input
              type="file"
              name="images"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
              className="sr-only"
            />
          </label>

          {previews.length ? (
            <div className="mt-4 grid gap-3 grid-cols-2 sm:grid-cols-4">
              {previews.map((p) => (
                <div key={p.src} className="relative aspect-square overflow-hidden rounded-md border border-border bg-muted">
                  <Image src={p.src} alt={p.name} fill sizes="160px" className="object-cover" unoptimized />
                </div>
              ))}
            </div>
          ) : null}
          <p className="mt-2 text-xs text-muted-foreground">
            New images upload to Cloudinary on save.
          </p>
        </section>
      </div>

      <aside className="space-y-6">
        <section className="rounded-lg border border-border bg-card p-5">
          <h3 className="text-sm font-semibold mb-4">Category</h3>
          <select
            name="categoryId"
            required
            defaultValue={initial.categoryId}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="">Choose a category…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </section>

        <section className="rounded-lg border border-border bg-card p-5">
          <h3 className="text-sm font-semibold mb-4">Publishing</h3>
          <div className="space-y-3 text-sm">
            <Toggle name="isActive" defaultChecked={initial.isActive} label="Active" hint="Visible in shop" />
            <Toggle
              name="isFeatured"
              defaultChecked={initial.isFeatured}
              label="Featured"
              hint="Shown on home page"
            />
            <Toggle
              name="isHotDeal"
              defaultChecked={initial.isHotDeal}
              label="Hot deal"
              hint="Shown in Hot Deals on home page"
            />
          </div>
        </section>

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground hover:bg-brand/90 disabled:opacity-60"
        >
          {pending ? "Saving…" : submitLabel}
        </button>
      </aside>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  defaultValue,
  hint,
  step,
  min,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
  hint?: string;
  step?: string;
  min?: string;
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
        defaultValue={defaultValue}
        step={step}
        min={min}
        className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand/30"
      />
    </label>
  );
}

function Toggle({
  name,
  label,
  hint,
  defaultChecked,
}: {
  name: string;
  label: string;
  hint?: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-start gap-2 cursor-pointer">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="mt-0.5 h-4 w-4 rounded border-border"
      />
      <span>
        <span className="font-medium">{label}</span>
        {hint ? <span className="ml-1 text-xs text-muted-foreground">— {hint}</span> : null}
      </span>
    </label>
  );
}
