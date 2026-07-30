import { useMemo, useState } from "react";
import { Gauge, Cpu, MonitorPlay } from "lucide-react";
import { motion } from "motion/react";
import type { ResolvedBuild } from "@/lib/compatibility";
import {
  GAMES,
  bottleneckSummary,
  estimateFps,
  type Preset,
  type Resolution,
} from "@/lib/fps-engine";

const RESOLUTIONS: Resolution[] = ["1080p", "1440p", "4K"];
const PRESETS: Preset[] = ["Ultra", "High", "Medium"];

const TIER_COLOR: Record<string, string> = {
  excellent: "text-success",
  great: "text-primary",
  playable: "text-warning",
  poor: "text-destructive",
};

export function FpsEstimator({ build }: { build: ResolvedBuild }) {
  const [resolution, setResolution] = useState<Resolution>("1440p");
  const [preset, setPreset] = useState<Preset>("High");
  const [filter, setFilter] = useState<"All" | "AAA" | "Esports">("All");

  const games = useMemo(
    () => GAMES.filter((g) => filter === "All" || g.genre === filter),
    [filter],
  );
  const bottleneck = bottleneckSummary(build);

  return (
    <section className="panel p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-accent">Module 02</p>
          <h2 className="text-2xl font-bold">Game Performance Estimator</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {RESOLUTIONS.map((r) => (
            <Toggle key={r} active={resolution === r} onClick={() => setResolution(r)}>
              {r}
            </Toggle>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <Toggle key={p} active={preset === p} onClick={() => setPreset(p)} tone="accent">
            {p}
          </Toggle>
        ))}
        <span className="mx-1 h-6 w-px bg-border" />
        {(["All", "AAA", "Esports"] as const).map((f) => (
          <Toggle key={f} active={filter === f} onClick={() => setFilter(f)} tone="muted">
            {f}
          </Toggle>
        ))}
      </div>

      {bottleneck && (
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-border bg-surface/60 px-4 py-3 text-sm">
          <Gauge className="mt-0.5 size-4 shrink-0 text-accent" />
          <span>{bottleneck}</span>
        </div>
      )}

      {!build.cpu || !build.gpu ? (
        <p className="mt-6 rounded-lg border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
          Select a CPU and a graphics card to unlock FPS predictions.
        </p>
      ) : (
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {games.map((game, i) => {
            const result = estimateFps(build, game, resolution, preset)!;
            return (
              <motion.article
                key={game.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, duration: 0.3 }}
                className="rounded-xl border border-border bg-surface/70 p-4 transition hover:border-primary/60"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold">{game.title}</h3>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">
                      {game.genre}
                    </p>
                  </div>
                  <span
                    className="mt-1 size-2 rounded-full"
                    style={{ backgroundColor: game.accent, boxShadow: `0 0 12px ${game.accent}` }}
                  />
                </div>

                <div className="mt-3 flex items-end gap-2">
                  <span className={`font-display text-4xl font-bold ${TIER_COLOR[result.tier]}`}>
                    {result.fps}
                  </span>
                  <span className="pb-1 text-sm text-muted-foreground">FPS</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {resolution} · {preset} preset
                </p>

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-background">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: "var(--gradient-neon)" }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (result.fps / 240) * 100)}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>

                <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                  {result.limitedBy === "CPU" ? (
                    <Cpu className="size-3.5" />
                  ) : (
                    <MonitorPlay className="size-3.5" />
                  )}
                  Limited by {result.limitedBy}
                </p>
              </motion.article>
            );
          })}
        </div>
      )}
    </section>
  );
}

function Toggle({
  active,
  onClick,
  children,
  tone = "primary",
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  tone?: "primary" | "accent" | "muted";
}) {
  const activeCls =
    tone === "accent"
      ? "border-accent/60 bg-accent/15 text-accent"
      : tone === "muted"
        ? "border-foreground/30 bg-foreground/10 text-foreground"
        : "neon-ring bg-primary/15 text-primary";
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition ${
        active ? activeCls : "border-border text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
