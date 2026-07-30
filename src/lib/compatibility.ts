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
  messageAr: string;
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
      messageAr: `عدم تطابق المقبس: ${cpu.name} يستخدم ${cpu.socket} بينما ${motherboard.name} يستخدم ${motherboard.socket}.`,
    });
  }

  if (ram && motherboard && ram.memoryType !== motherboard.memoryType) {
    issues.push({
      level: "error",
      message: `Memory mismatch: ${ram.memoryType} modules cannot fit a ${motherboard.memoryType} motherboard.`,
      messageAr: `عدم تطابق الذاكرة: شرائح ${ram.memoryType} لا تعمل مع لوحة أم من نوع ${motherboard.memoryType}.`,
    });
  }

  if (ram && cpu && !cpu.memoryType.includes(ram.memoryType)) {
    issues.push({
      level: "error",
      message: `${cpu.name} does not support ${ram.memoryType} memory.`,
      messageAr: `المعالج ${cpu.name} لا يدعم ذاكرة ${ram.memoryType}.`,
    });
  }

  if (ram && motherboard && ram.modules > motherboard.memorySlots) {
    issues.push({
      level: "error",
      message: `${ram.name} needs ${ram.modules} slots, board has ${motherboard.memorySlots}.`,
      messageAr: `${ram.name} تحتاج ${ram.modules} منافذ، واللوحة توفّر ${motherboard.memorySlots} فقط.`,
    });
  }

  if (motherboard && pcCase && !pcCase.supportedFormFactors.includes(motherboard.formFactor)) {
    issues.push({
      level: "error",
      message: `${pcCase.name} does not support ${motherboard.formFactor} motherboards.`,
      messageAr: `الصندوق ${pcCase.name} لا يدعم اللوحات من قياس ${motherboard.formFactor}.`,
    });
  }

  if (gpu && pcCase && gpu.lengthMm > pcCase.maxGpuLengthMm) {
    issues.push({
      level: "error",
      message: `${gpu.name} is ${gpu.lengthMm}mm long, ${pcCase.name} fits up to ${pcCase.maxGpuLengthMm}mm.`,
      messageAr: `طول ${gpu.name} هو ${gpu.lengthMm} ملم، بينما ${pcCase.name} يتسع حتى ${pcCase.maxGpuLengthMm} ملم.`,
    });
  }

  if (cooler && pcCase && cooler.kind === "Air" && cooler.heightMm > pcCase.maxCoolerHeightMm) {
    issues.push({
      level: "error",
      message: `${cooler.name} is ${cooler.heightMm}mm tall, ${pcCase.name} clears only ${pcCase.maxCoolerHeightMm}mm.`,
      messageAr: `ارتفاع ${cooler.name} هو ${cooler.heightMm} ملم، و${pcCase.name} يسمح بـ ${pcCase.maxCoolerHeightMm} ملم فقط.`,
    });
  }

  if (cooler && cpu && !cooler.sockets.includes(cpu.socket)) {
    issues.push({
      level: "error",
      message: `${cooler.name} has no mounting kit for ${cpu.socket}.`,
      messageAr: `${cooler.name} لا يحتوي على قاعدة تثبيت لمقبس ${cpu.socket}.`,
    });
  }

  if (cooler && cpu && cooler.coolingCapacity < cpu.tdp) {
    issues.push({
      level: "warning",
      message: `${cooler.name} (${cooler.coolingCapacity}W) may throttle ${cpu.name} (${cpu.tdp}W).`,
      messageAr: `${cooler.name} بقدرة ${cooler.coolingCapacity} واط قد يخفض أداء ${cpu.name} (${cpu.tdp} واط).`,
    });
  }

  if (!cooler && cpu && !cpu.coolerIncluded) {
    issues.push({
      level: "warning",
      message: `${cpu.name} ships without a cooler — add one.`,
      messageAr: `المعالج ${cpu.name} يأتي بدون مبرّد — يُنصح بإضافة مبرّد.`,
    });
  }

  const watts = estimatedWattage(b);
  if (psu) {
    if (psu.wattage < watts) {
      issues.push({
        level: "error",
        message: `${psu.wattage}W supply is below the estimated ${watts}W load.`,
        messageAr: `مزوّد طاقة بقدرة ${psu.wattage} واط أقل من الاستهلاك التقديري ${watts} واط.`,
      });
    } else if (psu.wattage < recommendedPsu(watts)) {
      issues.push({
        level: "warning",
        message: `${psu.wattage}W works but ${recommendedPsu(watts)}W is recommended for transient spikes.`,
        messageAr: `${psu.wattage} واط كافية لكن يُنصح بـ ${recommendedPsu(watts)} واط لتحمّل الارتفاعات المفاجئة.`,
      });
    }
  }

  if (ram && ram.capacity < 16) {
    issues.push({
      level: "warning",
      message: "16GB or more is recommended for modern games.",
      messageAr: "يُنصح بـ 16 جيجابايت أو أكثر للألعاب الحديثة.",
    });
  }

  if (!b.storage) {
    issues.push({
      level: "info",
      message: "No storage selected — pick an NVMe SSD for fast loads.",
      messageAr: "لم يتم اختيار وحدة تخزين — اختر قرص NVMe SSD لتحميل أسرع.",
    });
  }

  if (gpu && cpu && gpu.gpuScore > cpu.cpuScore * 1.6) {
    issues.push({
      level: "warning",
      message: `CPU bottleneck likely: ${cpu.name} may hold back ${gpu.name} at 1080p.`,
      messageAr: `اختناق محتمل في المعالج: ${cpu.name} قد يحدّ من أداء ${gpu.name} عند دقة 1080p.`,
    });
  }

  if (cpu && gpu && cpu.cpuScore > gpu.gpuScore * 2.2) {
    issues.push({
      level: "info",
      message: `GPU is the limiting part in this build — a faster card would scale better.`,
      messageAr: `بطاقة الرسومات هي العنصر المحدِّد في هذه التجميعة — بطاقة أقوى ستعطي أداءً أفضل.`,
    });
  }

  return issues;
}

export function buildStatus(issues: Issue[]): "error" | "warning" | "ok" {
  if (issues.some((i) => i.level === "error")) return "error";
  if (issues.some((i) => i.level === "warning")) return "warning";
  return "ok";
}

/**
 * True when adding `part` to the current build introduces no new hard conflict.
 * Used to hide/flag incompatible options in the part browser.
 */
export function isPartCompatible(part: Part, resolved: ResolvedBuild): boolean {
  const base: ResolvedBuild = { ...resolved };
  delete base[part.category as keyof ResolvedBuild];
  const baseErrors = checkCompatibility(base).filter((i) => i.level === "error").length;
  const withPart = checkCompatibility({
    ...base,
    [part.category]: part,
  } as ResolvedBuild).filter((i) => i.level === "error").length;
  return withPart <= baseErrors;
}
