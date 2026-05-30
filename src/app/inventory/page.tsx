import { redirect } from "next/navigation";

// Inventory is an alias for Shop — the shop page already lists every
// active product with category and search filters.
export default function InventoryPage() {
  redirect("/shop");
}
