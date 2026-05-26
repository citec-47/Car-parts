import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/db";
import { updateCategory } from "../../../actions";
import { CategoryForm } from "../../CategoryForm";
import { DeleteCategoryButton } from "../../DeleteCategoryButton";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ ok?: string }>;

export default async function EditCategoryPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { id } = await params;
  const { ok } = await searchParams;

  const category = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { products: true } } },
  });
  if (!category) notFound();

  const update = updateCategory.bind(null, category.id);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <Link
            href="/admin/categories"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Categories
          </Link>
          <h2 className="mt-1 text-lg font-bold">{category.name}</h2>
          <p className="text-xs text-muted-foreground">
            slug <code>{category.slug}</code> · {category._count.products} products
          </p>
        </div>
        <DeleteCategoryButton
          id={category.id}
          name={category.name}
          productCount={category._count.products}
          variant="full"
        />
      </div>

      {ok ? (
        <div className="mb-4 inline-flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
          <CheckCircle2 className="h-4 w-4" />
          {ok === "created" ? "Category created." : "Changes saved."}
        </div>
      ) : null}

      <CategoryForm
        action={update}
        submitLabel="Save changes"
        initial={{
          name: category.name,
          iconKey: category.iconKey ?? "",
          description: category.description ?? "",
          displayOrder: String(category.displayOrder),
          showInFooter: category.showInFooter,
        }}
      />
    </div>
  );
}
