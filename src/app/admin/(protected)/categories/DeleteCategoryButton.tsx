"use client";

import { useEffect, useState, useTransition } from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { deleteCategory } from "../actions";

export function DeleteCategoryButton({
  id,
  name,
  productCount,
  variant = "inline",
}: {
  id: string;
  name: string;
  productCount: number;
  variant?: "inline" | "full";
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !pending) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, pending]);

  const confirmDelete = () => {
    const fd = new FormData();
    fd.set("id", id);
    startTransition(() => deleteCategory(fd));
  };

  return (
    <>
      {variant === "full" ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-md border border-destructive/40 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10"
        >
          Delete category
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-3.5 w-3.5" /> Delete
        </button>
      )}

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-category-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => !pending && setOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-xl">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <AlertTriangle className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 id="delete-category-title" className="text-base font-bold">
                  Delete &ldquo;{name}&rdquo;?
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {productCount === 0 ? (
                    <>This category has no products. It will be permanently removed.</>
                  ) : (
                    <>
                      This category has{" "}
                      <span className="font-semibold text-foreground">
                        {productCount} product{productCount === 1 ? "" : "s"}
                      </span>
                      . They will <span className="font-semibold">also be deleted</span>,
                      along with their images. This cannot be undone.
                    </>
                  )}
                </p>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => !pending && setOpen(false)}
                className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={pending}
                className="rounded-md border border-border bg-background px-4 py-2 text-sm hover:bg-muted disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={pending}
                className="inline-flex items-center gap-1.5 rounded-md bg-destructive px-4 py-2 text-sm font-semibold text-white hover:bg-destructive/90 disabled:opacity-60"
              >
                <Trash2 className="h-4 w-4" />
                {pending ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
