const STATS = [
  { value: "15+", label: "Years in business" },
  { value: "10,000+", label: "Engines shipped" },
  { value: "50+", label: "Countries served" },
  { value: "30 days", label: "Mechanical warranty" },
];

export function StatsStrip() {
  return (
    <section className="mx-auto max-w-7xl px-4 mt-12">
      <div className="grid grid-cols-2 gap-y-8 sm:grid-cols-4 sm:divide-x sm:divide-border">
        {STATS.map((s) => (
          <div key={s.label} className="text-center sm:px-6">
            <p className="text-3xl sm:text-4xl font-black tracking-tight text-brand">
              {s.value}
            </p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
