"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import type {
  VehicleMake,
  VehicleModel,
  VehicleYearRow,
  VehicleEngineRow,
} from "@/lib/types";

type Props = {
  makes: VehicleMake[];
  models: VehicleModel[];
  years: VehicleYearRow[];
  engines: VehicleEngineRow[];
};

const HERO_BG =
  "https://images.unsplash.com/photo-1518306727298-4c17e1bf6943?w=1600&h=600&fit=crop&auto=format";

export function VehicleFinder({ makes, models, years, engines }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [makeId, setMakeId] = useState("");
  const [modelId, setModelId] = useState("");
  const [year, setYear] = useState("");
  const [engineId, setEngineId] = useState("");

  const availableModels = useMemo(
    () => (makeId ? models.filter((m) => m.makeId === makeId) : []),
    [makeId, models],
  );
  const availableYears = useMemo(
    () => (modelId ? years.filter((y) => y.modelId === modelId).map((y) => y.year) : []),
    [modelId, years],
  );

  useEffect(() => {
    setModelId("");
    setYear("");
    setEngineId("");
  }, [makeId]);

  useEffect(() => {
    setYear("");
    setEngineId("");
  }, [modelId]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (makeId) params.set("make", makeId);
    if (modelId) params.set("model", modelId);
    if (year) params.set("year", year);
    if (engineId) params.set("engine", engineId);
    startTransition(() => router.push(`/shop${params.toString() ? `?${params.toString()}` : ""}`));
  };

  return (
    <section className="mx-auto max-w-7xl px-4 mt-6">
      <div className="relative overflow-hidden rounded-lg bg-zinc-900">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: `url(${HERO_BG})` }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative p-6 sm:p-10 text-white text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            FIND PARTS FOR YOUR VEHICLE
          </h2>
          <p className="mt-1 text-sm text-white/70">
            Over hundreds of brands and tens of thousands of parts
          </p>
          <form
            onSubmit={onSubmit}
            className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5 lg:gap-2"
          >
            <FinderSelect
              label="Select Make"
              value={makeId}
              onChange={setMakeId}
              options={makes.map((m) => ({ value: m.id, label: m.name }))}
            />
            <FinderSelect
              label="Select Model"
              value={modelId}
              onChange={setModelId}
              disabled={!makeId}
              options={availableModels.map((m) => ({ value: m.id, label: m.name }))}
            />
            <FinderSelect
              label="Select Year"
              value={year}
              onChange={setYear}
              disabled={!modelId}
              options={availableYears.map((y) => ({ value: String(y), label: String(y) }))}
            />
            <FinderSelect
              label="Select Engine"
              value={engineId}
              onChange={setEngineId}
              disabled={!year}
              options={engines.map((e) => ({ value: e.id, label: e.name }))}
            />
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground hover:bg-brand/90 transition-colors disabled:opacity-60"
            >
              <Search className="h-4 w-4" />
              {isPending ? "Searching…" : "Search"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function FinderSelect({
  label,
  value,
  onChange,
  options,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      aria-label={label}
      className="rounded-md bg-white text-foreground px-3 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand/40 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      <option value="">{label}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
