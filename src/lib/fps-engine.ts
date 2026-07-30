import type { ResolvedBuild } from "./compatibility";

export type Resolution = "1080p" | "1440p" | "4K";
export type Preset = "Ultra" | "High" | "Medium";

export interface Game {
  id: string;
  title: string;
  genre: "AAA" | "Esports";
  /** GPU score needed for ~60fps at 1080p Ultra */
  gpuDemand: number;
  /** CPU score needed for ~60fps */
  cpuDemand: number;
  vramNeed: number;
  /** how much the CPU limits framerate (esports = high) */
  cpuWeight: number;
  accent: string;
}

export const GAMES: Game[] = [
  { id: "cyberpunk", title: "Cyberpunk 2077", genre: "AAA", gpuDemand: 78, cpuDemand: 90, vramNeed: 8, cpuWeight: 0.3, accent: "#f5e663" },
  { id: "gta5", title: "Grand Theft Auto V", genre: "AAA", gpuDemand: 26, cpuDemand: 70, vramNeed: 4, cpuWeight: 0.45, accent: "#7ce8a4" },
  { id: "gta6", title: "Grand Theft Auto VI", genre: "AAA", gpuDemand: 105, cpuDemand: 120, vramNeed: 12, cpuWeight: 0.35, accent: "#ff8fb1" },
  { id: "warzone", title: "Call of Duty: Warzone", genre: "AAA", gpuDemand: 62, cpuDemand: 95, vramNeed: 8, cpuWeight: 0.4, accent: "#ffa958" },
  { id: "eldenring", title: "Elden Ring", genre: "AAA", gpuDemand: 55, cpuDemand: 85, vramNeed: 8, cpuWeight: 0.3, accent: "#e0c88a" },
  { id: "hogwarts", title: "Hogwarts Legacy", genre: "AAA", gpuDemand: 72, cpuDemand: 95, vramNeed: 10, cpuWeight: 0.35, accent: "#b48cff" },
  { id: "valorant", title: "VALORANT", genre: "Esports", gpuDemand: 10, cpuDemand: 55, vramNeed: 4, cpuWeight: 0.75, accent: "#ff5470" },
  { id: "fortnite", title: "Fortnite", genre: "Esports", gpuDemand: 34, cpuDemand: 75, vramNeed: 6, cpuWeight: 0.5, accent: "#59b8ff" },
  { id: "cs2", title: "Counter-Strike 2", genre: "Esports", gpuDemand: 18, cpuDemand: 60, vramNeed: 4, cpuWeight: 0.7, accent: "#ffd166" },
  { id: "apex", title: "Apex Legends", genre: "Esports", gpuDemand: 24, cpuDemand: 68, vramNeed: 6, cpuWeight: 0.6, accent: "#ff6b3d" },
  { id: "lol", title: "League of Legends", genre: "Esports", gpuDemand: 6, cpuDemand: 45, vramNeed: 2, cpuWeight: 0.8, accent: "#4fd6c8" },
  { id: "starfield", title: "Starfield", genre: "AAA", gpuDemand: 80, cpuDemand: 110, vramNeed: 10, cpuWeight: 0.4, accent: "#8fd8ff" },
];

const RES_COST: Record<Resolution, number> = { "1080p": 1, "1440p": 1.72, "4K": 3.35 };
const PRESET_COST: Record<Preset, number> = { Ultra: 1, High: 0.78, Medium: 0.6 };

export interface FpsResult {
  fps: number;
  limitedBy: "GPU" | "CPU" | "VRAM";
  tier: "excellent" | "great" | "playable" | "poor";
}

export function estimateFps(
  build: ResolvedBuild,
  game: Game,
  resolution: Resolution,
  preset: Preset,
): FpsResult | null {
  const { cpu, gpu } = build;
  if (!cpu || !gpu) return null;

  const load = game.gpuDemand * RES_COST[resolution] * PRESET_COST[preset];
  const gpuFps = (gpu.gpuScore / load) * 60;

  // CPU framerate ceiling barely moves with resolution
  const cpuFps = (cpu.cpuScore / game.cpuDemand) * 60 * (1 + game.cpuWeight);

  let limitedBy: FpsResult["limitedBy"] = gpuFps <= cpuFps ? "GPU" : "CPU";
  let fps = Math.min(gpuFps, cpuFps);

  const vramNeed = game.vramNeed * (resolution === "4K" ? 1.5 : resolution === "1440p" ? 1.2 : 1);
  if (gpu.vram < vramNeed) {
    fps *= gpu.vram / vramNeed;
    limitedBy = "VRAM";
  }

  const ramGb = build.ram?.capacity ?? 16;
  if (ramGb < 16) fps *= 0.85;

  fps = Math.max(8, Math.round(fps));
  const tier: FpsResult["tier"] =
    fps >= 144 ? "excellent" : fps >= 90 ? "great" : fps >= 50 ? "playable" : "poor";

  return { fps, limitedBy, tier };
}

export function bottleneckSummary(build: ResolvedBuild): { en: string; ar: string } | null {
  const { cpu, gpu } = build;
  if (!cpu || !gpu) return null;
  const ratio = gpu.gpuScore / cpu.cpuScore;
  if (ratio > 1.6)
    return {
      en: `CPU bottleneck detected — ${cpu.name} limits ${gpu.name} at lower resolutions.`,
      ar: `تم رصد اختناق في المعالج — ${cpu.name} يحدّ من ${gpu.name} عند الدقات المنخفضة.`,
    };
  if (ratio < 0.45)
    return {
      en: `GPU bottleneck detected — ${gpu.name} is the weak link for ${cpu.name}.`,
      ar: `تم رصد اختناق في بطاقة الرسومات — ${gpu.name} هي الحلقة الأضعف مع ${cpu.name}.`,
    };
  return {
    en: "Balanced build — CPU and GPU are well matched.",
    ar: "تجميعة متوازنة — المعالج وبطاقة الرسومات متناسبان.",
  };
}

