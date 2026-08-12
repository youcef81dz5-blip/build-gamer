import { useMemo, useState } from "react";
import { Check, Search, Star, X } from "lucide-react";
import {
  formatPrice,
  partsFor,
  priceUpdatedLabel,
  type Category,
  type Part,
} from "@/lib/parts-data";
import { isPartCompatible, type ResolvedBuild } from "@/lib/compatibility";
import { useLang } from "@/lib/i18n";

interface Props {
  category: Category;
  label: string;
  selectedId?: string;
  build: ResolvedBuild;
  onSelect: (id: string | undefined) => void;
  onClose: () => void;
}

export function PartBrowser({ category, label, selectedId, build, onSelect, onClose }: Props) {
  const { t, lang } = useLang();
  const all = useMemo(() => partsFor(category), [category]);
  const brands = useMemo(() => [...new Set(all.map((p) => p.brand))].sort(), [all]);
  const maxPrice = useMemo(() => Math.max(...all.map((p) => p.price)), [all]);

  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState<string | null>(null);
  const [budget, setBudget] = useState(maxPrice);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState<"price" | "rating">("price");
  const [compatibleOnly, setCompatibleOnly] = useState(true);

  const compatibility = useMemo(() => {
    const map: Record<string, boolean> = {};
    for (const p of all) map[p.id] = isPartCompatible(p, build);
    return map;
  }, [all, build]);

  const filtered = all
    .filter((p) => (brand ? p.brand === brand : true))
    .filter((p) => p.price <= budget && p.rating >= minRating)
    .filter((p) =>
      (p.name + p.brand + p.specs.join(" ")).toLowerCase().includes(query.toLowerCase()),
    )
    .sort((a, b) => (sort === "price" ? a.price - b.price : b.rating - a.rating));

  const results = compatibleOnly ? filtered.filter((p) => compatibility[p.id]) : filtered;
  const hidden = filtered.length - results.length;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 p-0 backdrop-blur-sm sm:items-center sm:p-6">
      <div className="panel flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-primary">{t("choose")}</p>
            <h2 className="text-xl font-bold">{label}</h2>
          </div>
          <button
            onClick={onClose}
            aria-label={t("close")}
            className="rounded-md border border-border p-2 text-muted-foreground transition hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </header>

        <div className="space-y-3 border-b border-border px-5 py-4">
          <div className="flex items-center gap-2 rounded-md border border-input bg-background/60 px-3">
            <Search className="size-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`${t("search")} ${label}...`}
              className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <FilterChip active={compatibleOnly} onClick={() => setCompatibleOnly((v) => !v)}>
              {t("compatibleOnly")}
            </FilterChip>
            <FilterChip active={brand === null} onClick={() => setBrand(null)}>
              {t("allBrands")}
            </FilterChip>
            {brands.map((b) => (
              <FilterChip key={b} active={brand === b} onClick={() => setBrand(b)}>
                {b}
              </FilterChip>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
            <label className="flex flex-1 items-center gap-3 min-w-52">
              <span className="whitespace-nowrap">
                {t("max")} {formatPrice(budget, lang)}
              </span>
              <input
                type="range"
                min={0}
                max={maxPrice}
                step={500}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full accent-[var(--primary)]"
              />
            </label>
            <div className="flex gap-2">
              <FilterChip active={minRating === 0} onClick={() => setMinRating(0)}>
                {t("anyRating")}
              </FilterChip>
              <FilterChip active={minRating === 4.5} onClick={() => setMinRating(4.5)}>
                4.5+
              </FilterChip>
            </div>
            <div className="flex gap-2">
              <FilterChip active={sort === "price"} onClick={() => setSort("price")}>
                {t("price")}
              </FilterChip>
              <FilterChip active={sort === "rating"} onClick={() => setSort("rating")}>
                {t("topRated")}
              </FilterChip>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto px-5 py-4">
          {results.length === 0 && (
            <p className="py-10 text-center text-sm text-muted-foreground">{t("noResults")}</p>
          )}
          {results.map((p) => (
            <PartRow
              key={p.id}
              part={p}
              selected={p.id === selectedId}
              compatible={compatibility[p.id]}
              incompatibleLabel={t("incompatible")}
              onClick={() => {
                onSelect(p.id === selectedId ? undefined : p.id);
                onClose();
              }}
            />
          ))}
          {compatibleOnly && hidden > 0 && (
            <p className="pt-2 text-center text-xs text-muted-foreground">
              {hidden} {t("hiddenCount")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider transition ${
        active
          ? "neon-ring bg-primary/15 text-primary"
          : "border-border text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function PartRow({
  part,
  selected,
  compatible,
  incompatibleLabel,
  onClick,
}: {
  part: Part;
  selected: boolean;
  compatible: boolean;
  incompatibleLabel: string;
  onClick: () => void;
}) {
  const { lang } = useLang();
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-4 rounded-lg border bg-surface/60 px-4 py-3 text-start transition hover:border-primary/60 ${
        selected ? "neon-ring" : "border-border"
      } ${compatible ? "" : "opacity-60"}`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate font-semibold">{part.name}</span>
          {selected && <Check className="size-4 shrink-0 text-primary" />}
          {!compatible && (
            <span className="shrink-0 rounded-full border border-destructive/60 px-2 py-0.5 text-[10px] font-bold uppercase text-destructive">
              {incompatibleLabel}
            </span>
          )}
        </div>
        <p className="truncate text-xs text-muted-foreground">{part.specs.join(" · ")}</p>
      </div>
      <div className="text-end">
        <p className="font-display text-sm text-primary">{formatPrice(part.price, lang)}</p>
        <p className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
          <Star className="size-3 fill-current text-warning" />
          {part.rating}
        </p>
      </div>
    </button>
  );
}
