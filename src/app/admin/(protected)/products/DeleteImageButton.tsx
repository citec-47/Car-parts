"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteProductImage } from "../actions";

export function DeleteImageButton({
  imageId,
  productId,
}: {
  imageId: string;
  productId: string;
}) {
  const [pending, startTransition] = useTransition();
  const onClick = () => {
    const fd = new FormData();
    fd.set("imageId", imageId);
    fd.set("productId", productId);
    startTransition(() => deleteProductImage(fd));
  };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      title="Remove image"
      className="absolute right-1 top-1 rounded-md bg-black/60 p-1 text-white hover:bg-black/80 disabled:opacity-60"
    >
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  );
}
