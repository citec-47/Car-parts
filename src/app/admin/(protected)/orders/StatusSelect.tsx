"use client";

import { useTransition } from "react";
import { updateOrderStatus } from "../actions";

const STATUSES = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"] as const;

export function StatusSelect({ orderId, current }: { orderId: string; current: string }) {
  const [pending, startTransition] = useTransition();

  const onChange = (status: string) => {
    const fd = new FormData();
    fd.set("id", orderId);
    fd.set("status", status);
    startTransition(() => updateOrderStatus(fd));
  };

  return (
    <select
      aria-label="Update order status"
      defaultValue={current}
      disabled={pending}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-md border border-border bg-background px-2 py-1 text-xs disabled:opacity-60"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
