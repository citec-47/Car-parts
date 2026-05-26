import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createCategory } from "../../actions";
import { CategoryForm } from "../CategoryForm";

export const dynamic = "force-dynamic";

export default function NewCategoryPage() {
  return (
    <div>
      <div className="mb-4">
        <Link
          href="/admin/categories"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Categories
        </Link>
        <h2 className="mt-1 text-lg font-bold">New category</h2>
      </div>

      <CategoryForm
        action={createCategory}
        submitLabel="Create category"
        initial={{
          name: "",
          iconKey: "",
          description: "",
          displayOrder: "",
          showInFooter: true,
        }}
      />
    </div>
  );
}
