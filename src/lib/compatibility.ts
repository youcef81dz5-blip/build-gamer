import {
  PARTS_BY_ID,
  type Build,
  type CasePart,
  type CoolerPart,
  type CpuPart,
  type GpuPart,
  type MotherboardPart,
  type Part,
  type PsuPart,
  type RamPart,
} from "./parts-data";

export interface Issue {
  level: "error" | "warning" | "info";
  message: string;
}

export interface ResolvedBuild {
  cpu?: CpuPart;
  gpu?: GpuPart;
  motherboard?: MotherboardPart;
  ram?: RamPart;
  storage?: Part;
  psu?: PsuPart;
  cooler?: CoolerPart;
  case?: CasePart;
}

export function resolveBuild(build: Build): ResolvedBuild {
  const out: Record<string, Part | undefined> = {};
  for (const [category, id] of Object.entries(build)) {
    if (id && PARTS_BY_ID[id]) out[category] = PARTS_BY_ID[id];
  }
  return out as ResolvedBuild;
}

export function totalPrice(b: ResolvedBuild): number {
  return Object.values(b).reduce((sum, p) => sum + (p?.price ?? 0), 0);
}

/** Estimated load wattage plus a 30% headroom recommendation. */
export function estimatedWattage(b: ResolvedBuild): number {
  const base = 60; // fans, drives overhead, board misc
  const sum = Object.values(b).reduce((s, p) => s + (p?.tdp ?? 0), 0);
  return Math.round(base + sum);
}

export function recommendedPsu(watts: number): number {
  return Math.ceil((watts * 1.35) / 50) * 50;
}

export function checkCompatibility(b: ResolvedBuild): Issue[] {
  const issues: Issue[] = [];
  const { cpu, gpu, motherboard, ram, psu, cooler } = b;
  const pcCase = b.case;

  if (cpu && motherboard && cpu.socket !== motherboard.socket) {
    issues.push({
      level: "error",
      message: `Socket mismatch: ${cpu.name} is ${cpu.socket} but ${motherboard.name} is ${motherboard.socket}.`,
    });
  }

  if (ram && motherboard && ram.memoryType !== motherboard.memoryType) {
    issues.push({
      level: "error",
      message: `Memory mismatch: ${ram.memoryType} modules cannot fit a ${motherboard.memoryType} motherboard.`,
    });
  }

  if (ram && cpu && !cpu.memoryType.includes(ram.memoryType)) {
    issues.push({
      level: "error",
      message: `${cpu.name} does not support ${ram.memoryType} memory.`,
    });
  }

  if (ram && motherboard && ram.modules > motherboard.memorySlots) {
    issues.push({
      level: "error",
      message: `${ram.name} needs ${ram.modules} slots, board has ${motherboard.memorySlots}.`,
    });
  }

  if (motherboard && pcCase && !pcCase.supportedFormFactors.includes(motherboard.formFactor)) {
    issues.push({
      level: "error",
      message: `${pcCase.name} does not support ${motherboard.formFactor} motherboards.`,
    });
  }

  if (gpu && pcCase && gpu.lengthMm > pcCase.maxGpuLengthMm) {
    issues.push({
      level: "error",
      message: `${gpu.name} is ${gpu.lengthMm}mm long, ${pcCase.name} fits up to ${pcCase.maxGpuLengthMm}mm.`,
    });
  }

  if (cooler && pcCase && cooler.kind === "Air" && cooler.heightMm > pcCase.maxCoolerHeightMm) {
    issues.push({
      level: "error",
      message: `${cooler.name} is ${cooler.heightMm}mm tall, ${pcCase.name} clears only ${pcCase.maxCoolerHeightMm}mm.`,
    });
  }

  if (cooler && cpu && !cooler.sockets.includes(cpu.socket)) {
    issues.push({
      level: "error",
      message: `${cooler.name} has no mounting kit for ${cpu.socket}.`,
    });
  }

  if (cooler && cpu && cooler.coolingCapacity < cpu.tdp) {
    issues.push({
      level: "warning",
      message: `${cooler.name} (${cooler.coolingCapacity}W) may throttle ${cpu.name} (${cpu.tdp}W).`,
    });
  }

  if (!cooler && cpu && !cpu.coolerIncluded) {
    issues.push({
      level: "warning",
      message: `${cpu.name} ships without a cooler — add one.`,
    });
  }

  const watts = estimatedWattage(b);
  if (psu) {
    if (psu.wattage < watts) {
      issues.push({
        level: "error",
        message: `${psu.wattage}W supply is below the estimated ${watts}W load.`,
      });
    } else if (psu.wattage < recommendedPsu(watts)) {
      issues.push({
        level: "warning",
        message: `${psu.wattage}W works but ${recommendedPsu(watts)}W is recommended for transient spikes.`,
      });
    }
  }

  if (ram && ram.capacity < 16) {
    issues.push({ level: "warning", message: "16GB or more is recommended for modern games." });
  }

  if (!b.storage) {
    issues.push({ level: "info", message: "No storage selected — pick an NVMe SSD for fast loads." });
  }

  if (gpu && cpu && gpu.gpuScore > cpu.cpuScore * 1.6) {
    issues.push({
      level: "warning",
      message: `CPU bottleneck likely: ${cpu.name} may hold back ${gpu.name} at 1080p.`,
    });
  }

  if (cpu && gpu && cpu.cpuScore > gpu.gpuScore * 2.2) {
    issues.push({
      level: "info",
      message: `GPU is the limiting part in this build — a faster card would scale better.`,
    });
  }

  return issues;
}

export function buildStatus(issues: Issue[]): "error" | "warning" | "ok" {
  if (issues.some((i) => i.level === "error")) return "error";
  if (issues.some((i) => i.level === "warning")) return "warning";
  return "ok";
}
