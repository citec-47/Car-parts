"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useTransition } from "react";
import { Upload, X } from "lucide-react";
import { DeleteImageButton } from "./DeleteImageButton";

type Category = { id: string; name: string };

type ExistingImage = { id: string; url: string };

// Fields persisted to the local draft so a refresh / lost connection doesn't
// wipe what the admin already typed while creating a product.
const TEXT_FIELDS = [
  "name",
  "sku",
  "brand",
  "description",
  "price",
  "salePrice",
  "stock",
  "categoryId",
] as const;
const BOOL_FIELDS = [
  "isActive",
  "isFeatured",
  "isHotDeal",
  "priceOnRequest",
] as const;

type DraftData = {
  specs?: { label: string; value: string }[];
} & Record<string, unknown>;

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
  priceOnRequest: boolean;
  specs: { label: string; value: string }[];
  images: ExistingImage[];
};

export function ProductForm({
  initial,
  categories,
  action,
  submitLabel,
  lockedCategoryId,
  flowCategoryId,
}: {
  initial: ProductFormInitial;
  categories: Category[];
  action: (formData: FormData) => Promise<void> | void;
  submitLabel: string;
  lockedCategoryId?: string;
  flowCategoryId?: string;
}) {
  const [pending, startTransition] = useTransition();
  const [files, setFiles] = useState<File[]>([]);
  const [pasteError, setPasteError] = useState<string | null>(null);
  const [specs, setSpecs] = useState<{ label: string; value: string }[]>(
    initial.specs.length > 0 ? initial.specs : [{ label: "", value: "" }],
  );

  // Local draft autosave (create mode only). Restores typed data after a page
  // refresh or a connection drop so the admin can continue where they stopped.
  const isEditing = Boolean(initial.id);
  const draftKey = `revparts:product-draft:${flowCategoryId ?? lockedCategoryId ?? "new"}`;
  const formRef = useRef<HTMLFormElement>(null);
  const [draftRestored, setDraftRestored] = useState(false);

  const draftIsMeaningful = (data: DraftData) =>
    TEXT_FIELDS.some(
      (n) => n !== "categoryId" && String(data[n] ?? "").trim() !== "",
    ) ||
    (Array.isArray(data.specs) &&
      data.specs.some((s) => s.label.trim() !== "" || s.value.trim() !== ""));

  const persistDraft = () => {
    if (isEditing) return;
    const form = formRef.current;
    if (!form) return;
    const fd = new FormData(form);
    const data: DraftData = {};
    for (const name of TEXT_FIELDS) data[name] = String(fd.get(name) ?? "");
    for (const name of BOOL_FIELDS) data[name] = fd.get(name) === "on";
    data.specs = specs;
    try {
      if (draftIsMeaningful(data)) {
        localStorage.setItem(draftKey, JSON.stringify(data));
      } else {
        localStorage.removeItem(draftKey);
      }
    } catch {
      // Storage unavailable / quota exceeded — fail silently.
    }
  };

  const clearDraft = () => {
    try {
      localStorage.removeItem(draftKey);
    } catch {
      // ignore
    }
  };

  const discardDraft = () => {
    clearDraft();
    formRef.current?.reset();
    setSpecs([{ label: "", value: "" }]);
    setFiles([]);
    setDraftRestored(false);
  };

  // Restore any saved draft once, on mount.
  useEffect(() => {
    if (isEditing) return;
    let data: DraftData | null = null;
    try {
      data = JSON.parse(localStorage.getItem(draftKey) || "null");
    } catch {
      data = null;
    }
    if (!data || !draftIsMeaningful(data)) return;

    const form = formRef.current;
    if (form) {
      for (const name of TEXT_FIELDS) {
        const el = form.elements.namedItem(name) as
          | HTMLInputElement
          | HTMLSelectElement
          | HTMLTextAreaElement
          | null;
        if (el && typeof data[name] === "string" && data[name]) {
          el.value = data[name] as string;
        }
      }
      for (const name of BOOL_FIELDS) {
        const el = form.elements.namedItem(name) as HTMLInputElement | null;
        if (el && typeof data[name] === "boolean") el.checked = data[name] as boolean;
      }
    }
    if (Array.isArray(data.specs) && data.specs.length > 0) {
      setSpecs(data.specs);
    }
    setDraftRestored(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Spec rows live in React state, so persist whenever they change.
  useEffect(() => {
    persistDraft();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [specs]);

  const updateSpec = (i: number, field: "label" | "value", v: string) => {
    setSpecs((prev) => prev.map((s, idx) => (idx === i ? { ...s, [field]: v } : s)));
  };
  const addSpecRow = () => setSpecs((prev) => [...prev, { label: "", value: "" }]);
  const removeSpecRow = (i: number) =>
    setSpecs((prev) => (prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev));

  const previews = files.map((f, i) => ({
    key: `${i}-${f.name}-${f.size}`,
    name: f.name,
    src: URL.createObjectURL(f),
  }));

  const addFiles = (incoming: File[]) => {
    if (incoming.length === 0) return;
    setFiles((prev) => [...prev, ...incoming]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onPaste = (e: React.ClipboardEvent<HTMLFormElement>) => {
    // Case 1: an actual image was copied (screenshot, "Copy image", a file).
    const items = Array.from(e.clipboardData.items);
    const imageFiles = items
      .filter((i) => i.kind === "file" && i.type.startsWith("image/"))
      .map((i) => i.getAsFile())
      .filter((f): f is File => f != null);
    if (imageFiles.length > 0) {
      e.preventDefault();
      setPasteError(null);
      addFiles(imageFiles);
      return;
    }

    // Case 2: an image URL was pasted ("Copy image address"). Fetch it into a
    // File so it goes through the same Cloudinary upload on submit.
    const text = e.clipboardData.getData("text").trim();
    if (/^https?:\/\/\S+$/i.test(text)) {
      const looksLikeImage = /\.(png|jpe?g|gif|webp|avif|bmp|svg)(\?\S*)?$/i.test(text);
      const target = e.target as HTMLElement;
      const isTextField =
        target.tagName === "INPUT" || target.tagName === "TEXTAREA";
      // Only hijack the paste when it's clearly an image URL, or when it's not
      // landing in a text field (so URLs in description/SKU still paste normally).
      if (looksLikeImage || !isTextField) {
        e.preventDefault();
        void fetchUrlAsFile(text);
      }
    }
  };

  async function fetchUrlAsFile(url: string) {
    setPasteError(null);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      if (!blob.type.startsWith("image/")) {
        throw new Error("That URL isn't an image");
      }
      const ext = blob.type.split("/")[1]?.split("+")[0] || "png";
      const base = url.split("/").pop()?.split("?")[0] || "pasted-image";
      const name = /\.[a-z0-9]+$/i.test(base) ? base : `${base}.${ext}`;
      addFiles([new File([blob], name, { type: blob.type })]);
    } catch {
      setPasteError(
        "Couldn't load that image URL (the site may block it). Try copying the image itself instead.",
      );
    }
  }

  const onSubmit = (formData: FormData) => {
    // React state is the source of truth — replace any entries the file input
    // contributed with the deduplicated list from state (which includes pastes).
    formData.delete("images");
    for (const file of files) {
      formData.append("images", file);
    }
    startTransition(async () => {
      try {
        await action(formData);
        // Success (incl. redirect) — drop the saved draft.
        clearDraft();
      } catch {
        // Submission failed (e.g. connection dropped). Keep the draft so the
        // admin can retry without re-entering everything.
      }
    });
  };

  return (
    <form
      ref={formRef}
      action={onSubmit}
      onPaste={onPaste}
      onChange={persistDraft}
      className="grid gap-6 lg:grid-cols-3"
    >
      {draftRestored ? (
        <div className="flex items-start justify-between gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 lg:col-span-3">
          <span>
            Restored your unsaved draft from this device — pick up where you left
            off.
            <span className="mt-0.5 block text-xs text-amber-700">
              Any images you had attached before need to be re-added.
            </span>
          </span>
          <button
            type="button"
            onClick={discardDraft}
            className="shrink-0 rounded-md border border-amber-400 bg-white px-3 py-1.5 text-xs font-medium text-amber-800 hover:bg-amber-100"
          >
            Discard draft
          </button>
        </div>
      ) : null}
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
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Specs</h3>
            <span className="text-xs text-muted-foreground">
              Shown in a table on the product page
            </span>
          </div>
          <div className="space-y-2">
            {specs.map((s, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  name="specLabel"
                  placeholder="Label (e.g. Engine Brand)"
                  value={s.label}
                  onChange={(e) => updateSpec(i, "label", e.target.value)}
                  className="w-1/3 rounded-md border border-border bg-background px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  name="specValue"
                  placeholder="Value (e.g. Honda)"
                  value={s.value}
                  onChange={(e) => updateSpec(i, "value", e.target.value)}
                  className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeSpecRow(i)}
                  disabled={specs.length === 1}
                  aria-label="Remove spec row"
                  className="rounded-md border border-border px-2 text-muted-foreground hover:bg-muted disabled:opacity-40"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addSpecRow}
            className="mt-3 text-xs font-medium text-brand hover:underline"
          >
            + Add spec row
          </button>
        </section>

        <section className="rounded-lg border border-border bg-card p-5">
          <h3 className="text-sm font-semibold mb-4">Images</h3>
          {initial.images.length ? (
            <div className="mb-4 grid gap-3 grid-cols-2 sm:grid-cols-4">
              {initial.images.map((img) => (
                <div key={img.id} className="relative aspect-square overflow-hidden rounded-md border border-border bg-muted">
                  <Image src={img.url} alt="" fill sizes="160px" className="object-cover" />
                  {initial.id ? (
                    <DeleteImageButton imageId={img.id} productId={initial.id} />
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}

          <label className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-md border-2 border-dashed border-border bg-background py-8 hover:bg-muted/40">
            <Upload className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Click to add image(s)
            </span>
            <span className="text-xs text-muted-foreground/80">
              or paste an image or image URL (Ctrl + V) anywhere on this form
            </span>
            <input
              type="file"
              name="images"
              accept="image/*"
              multiple
              onChange={(e) => {
                addFiles(Array.from(e.target.files ?? []));
                // Reset so the same file can be re-picked if removed.
                e.target.value = "";
              }}
              className="sr-only"
            />
          </label>

          {previews.length ? (
            <div className="mt-4 grid gap-3 grid-cols-2 sm:grid-cols-4">
              {previews.map((p, i) => (
                <div
                  key={p.key}
                  className="group relative aspect-square overflow-hidden rounded-md border border-border bg-muted"
                >
                  <Image
                    src={p.src}
                    alt={p.name}
                    fill
                    sizes="160px"
                    className="object-cover"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    aria-label="Remove image"
                    title="Remove"
                    className="absolute right-1 top-1 rounded-md bg-black/60 p-1 text-white opacity-0 transition-opacity hover:bg-black/80 group-hover:opacity-100"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : null}
          <p className="mt-2 text-xs text-muted-foreground">
            New images upload to Cloudinary on publish.
            {previews.length > 0 ? ` (${previews.length} queued)` : ""}
          </p>
          {pasteError ? (
            <p className="mt-1 text-xs text-red-600">{pasteError}</p>
          ) : null}
        </section>
      </div>

      <aside className="space-y-6">
        {flowCategoryId ? (
          <input type="hidden" name="flowCategoryId" value={flowCategoryId} />
        ) : null}
        <section className="rounded-lg border border-border bg-card p-5">
          <h3 className="text-sm font-semibold mb-4">Category</h3>
          {lockedCategoryId ? (
            <>
              <input type="hidden" name="categoryId" value={lockedCategoryId} />
              <div className="rounded-md border border-brand/30 bg-brand/5 px-3 py-2 text-sm">
                <span className="font-semibold text-brand">
                  {categories.find((c) => c.id === lockedCategoryId)?.name ?? "Selected"}
                </span>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  Locked by workflow — change category by editing the product after publish.
                </p>
              </div>
            </>
          ) : (
            <select
              name="categoryId"
              required
              aria-label="Category"
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
          )}
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
            <Toggle
              name="priceOnRequest"
              defaultChecked={initial.priceOnRequest}
              label="Contact for price"
              hint="Hide price, show enquiry button"
            />
          </div>
        </section>

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground hover:bg-brand/90 disabled:opacity-60"
        >
          {pending ? "Publishing…" : submitLabel}
        </button>
        {!isEditing ? (
          <p className="text-center text-[11px] text-muted-foreground">
            Your entries save on this device as you type, so a refresh or lost
            connection won&apos;t erase them.
          </p>
        ) : null}
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
