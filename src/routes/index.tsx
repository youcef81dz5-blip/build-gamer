import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import {
  Cpu,
  MonitorPlay,
  CircuitBoard,
  MemoryStick,
  HardDrive,
  Plug,
  Fan,
  Box,
  Link2,
  Printer,
  RotateCcw,
  Zap,
  ChevronRight,
  Languages,
} from "lucide-react";
import { motion } from "motion/react";
import { CATEGORIES, PARTS_BY_ID, type Build, type Category } from "@/lib/parts-data";
import {
  buildStatus,
  checkCompatibility,
  estimatedWattage,
  recommendedPsu,
  resolveBuild,
  totalPrice,
} from "@/lib/compatibility";
import { decodeBuild, encodeBuild } from "@/lib/share";
import { useLang } from "@/lib/i18n";
import { PartBrowser } from "@/components/PartBrowser";
import { CompatibilityPanel } from "@/components/CompatibilityPanel";
import { FpsEstimator } from "@/components/FpsEstimator";

const ICONS: Record<Category, typeof Cpu> = {
  cpu: Cpu,
  gpu: MonitorPlay,
  motherboard: CircuitBoard,
  ram: MemoryStick,
  storage: HardDrive,
  psu: Plug,
  cooler: Fan,
  case: Box,
};

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>) => ({
    b: typeof search.b === "string" ? search.b : undefined,
  }),
  head: () => ({
    meta: [
      { title: "نيونفورج — تجميع حاسب الألعاب ومقدّر الإطارات" },
      {
        name: "description",
        content:
          "جهّز حاسب ألعاب مع فحص توافق فوري للمقبس والذاكرة والطاقة، وحساب السعر والاستهلاك، وتوقع الإطارات في Cyberpunk 2077 وVALORANT وWarzone وغيرها.",
      },
      { property: "og:title", content: "نيونفورج — تجميع حاسب الألعاب ومقدّر الإطارات" },
      {
        property: "og:description",
        content:
          "اختر القطع، اكتشف تعارضات المقبس والرام والطاقة فوراً، وشاهد الإطارات المتوقعة بدقة 1080p و1440p و4K.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BuilderPage,
});

function BuilderPage() {
  const { lang, t, toggle } = useLang();
  const navigate = useNavigate();
  const search = useSearch({ from: "/" });
  const [build, setBuild] = useState<Build>({});
  const [open, setOpen] = useState<Category | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (search.b) setBuild(decodeBuild(search.b));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resolved = useMemo(() => resolveBuild(build), [build]);
  const issues = useMemo(() => checkCompatibility(resolved), [resolved]);
  const status = buildStatus(issues);
  const price = totalPrice(resolved);
  const watts = estimatedWattage(resolved);

  const labelOf = (c: (typeof CATEGORIES)[number]) => (lang === "ar" ? c.labelAr : c.label);

  const select = (category: Category, id: string | undefined) => {
    const next = { ...build };
    if (id) next[category] = id;
    else delete next[category];
    setBuild(next);
    navigate({ to: "/", search: { b: encodeBuild(next) || undefined }, replace: true });
  };

  const share = async () => {
    const url = `${window.location.origin}/?b=${encodeBuild(build)}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusStyles = {
    ok: "border-[color-mix(in_oklab,var(--success)_60%,transparent)] text-success",
    warning: "border-[color-mix(in_oklab,var(--warning)_60%,transparent)] text-warning",
    error: "border-[color-mix(in_oklab,var(--destructive)_60%,transparent)] text-destructive",
  }[status];

  return (
    <div className="min-h-screen">
      <header className="grid-lines border-b border-border">
        <div className="mx-auto max-w-6xl px-5 py-10 sm:py-14">
          <div className="flex items-start justify-between gap-4">
            <p className="text-xs uppercase tracking-[0.4em] text-accent">{t("tagline")}</p>
            <button
              onClick={toggle}
              className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground transition hover:text-foreground"
            >
              <Languages className="size-3.5" /> {t("langToggle")}
            </button>
          </div>
          <h1 className="mt-3 font-display text-4xl font-black sm:text-6xl">
            {lang === "ar" ? (
              <>
                منصّة <span className="neon-text">NEONFORGE</span> لتركيب الحاسب
              </>
            ) : (
              <>
                <span className="neon-text">NEONFORGE</span> PC BUILDER
              </>
            )}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{t("heroDesc")}</p>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-5 py-8 lg:grid-cols-[1.55fr_1fr]">
        <section className="panel p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-primary">{t("module01")}</p>
              <h2 className="text-2xl font-bold">{t("partSelection")}</h2>
            </div>
            <button
              onClick={() => {
                setBuild({});
                navigate({ to: "/", search: {}, replace: true });
              }}
              className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs uppercase tracking-wider text-muted-foreground transition hover:text-foreground"
            >
              <RotateCcw className="size-3.5" /> {t("reset")}
            </button>
          </div>

          <ul className="mt-5 space-y-2">
            {CATEGORIES.map((category, i) => {
              const { id } = category;
              const part = build[id] ? PARTS_BY_ID[build[id]!] : undefined;
              const Icon = ICONS[id];
              return (
                <motion.li
                  key={id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <button
                    onClick={() => setOpen(id)}
                    className={`flex w-full items-center gap-4 rounded-lg border bg-surface/60 px-4 py-3 text-start transition hover:border-primary/60 ${
                      part ? "border-primary/40" : "border-border"
                    }`}
                  >
                    <span
                      className={`grid size-10 shrink-0 place-items-center rounded-md border ${
                        part ? "neon-ring text-primary" : "border-border text-muted-foreground"
                      }`}
                    >
                      <Icon className="size-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs uppercase tracking-widest text-muted-foreground">
                        {labelOf(category)}
                      </span>
                      <span className="block truncate font-semibold">
                        {part ? part.name : t("notSelected")}
                      </span>
                    </span>
                    {part && <span className="font-display text-sm text-primary">${part.price}</span>}
                    <ChevronRight className="size-4 shrink-0 text-muted-foreground rtl:rotate-180" />
                  </button>
                </motion.li>
              );
            })}
          </ul>
        </section>

        <aside className="space-y-6">
          <section className="panel p-5">
            <h2 className="text-2xl font-bold">{t("buildSummary")}</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Stat label={t("totalPrice")} value={`$${price.toLocaleString()}`} />
              <Stat label={t("estLoad")} value={`${watts} W`} icon />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {t("recommendedPsu")} {recommendedPsu(watts)} {t("orHigher")}
            </p>

            <div
              className={`mt-4 rounded-lg border px-4 py-2 text-center text-sm font-bold uppercase tracking-widest ${statusStyles}`}
            >
              {status === "ok"
                ? t("compatible")
                : status === "warning"
                  ? t("compatibleWarn")
                  : t("conflicts")}
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={share}
                className="flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-bold uppercase tracking-wider text-primary-foreground transition hover:opacity-90"
                style={{ backgroundImage: "var(--gradient-neon)", boxShadow: "var(--glow-primary)" }}
              >
                <Link2 className="size-4" /> {copied ? t("copied") : t("share")}
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-bold uppercase tracking-wider text-muted-foreground transition hover:text-foreground"
              >
                <Printer className="size-4" /> {t("pdf")}
              </button>
            </div>
          </section>

          <section className="panel p-5">
            <h2 className="mb-4 text-2xl font-bold">{t("compatibility")}</h2>
            <CompatibilityPanel issues={issues} />
          </section>
        </aside>

        <div className="lg:col-span-2">
          <FpsEstimator build={resolved} />
        </div>
      </main>

      <footer className="border-t border-border py-8 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
        {t("footer")}
      </footer>

      {open && (
        <PartBrowser
          category={open}
          label={labelOf(CATEGORIES.find((c) => c.id === open)!)}
          selectedId={build[open]}
          build={resolved}
          onSelect={(id) => select(open, id)}
          onClose={() => setOpen(null)}
        />
      )}
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon?: boolean }) {
  return (
    <div className="rounded-lg border border-border bg-surface/60 px-4 py-3">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-1 flex items-center gap-1 font-display text-xl font-bold text-primary">
        {icon && <Zap className="size-4" />}
        {value}
      </p>
    </div>
  );
}
