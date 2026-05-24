export function SectionHeading({
  children,
  align = "left",
  right,
}: {
  children: React.ReactNode;
  align?: "left" | "center";
  right?: React.ReactNode;
}) {
  return (
    <div
      className={`flex items-center gap-3 mb-6 ${align === "center" ? "justify-center" : "justify-between"}`}
    >
      <h2 className="inline-flex items-center gap-3 text-lg sm:text-xl font-extrabold uppercase tracking-wide text-foreground">
        <span className="h-[2px] w-6 bg-brand" aria-hidden />
        {children}
      </h2>
      {right ? <div className="flex items-center gap-2">{right}</div> : null}
    </div>
  );
}
