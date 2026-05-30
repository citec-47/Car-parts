import type { ProductSpec } from "@/lib/types";

export function ProductSpecsTable({ specs }: { specs: ProductSpec[] }) {
  if (!specs.length) return null;

  return (
    <div className="overflow-hidden rounded-md border border-border">
      <table className="w-full text-sm">
        <tbody className="divide-y divide-border">
          {specs.map((s, i) => (
            <tr key={i} className="bg-card even:bg-muted/30">
              <th
                scope="row"
                className="w-1/3 px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wide text-muted-foreground"
              >
                {s.label}
              </th>
              <td className="px-4 py-2.5 text-foreground">{s.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
