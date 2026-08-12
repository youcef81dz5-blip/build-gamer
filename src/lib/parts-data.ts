export type Category =
  | "cpu"
  | "gpu"
  | "motherboard"
  | "ram"
  | "storage"
  | "psu"
  | "cooler"
  | "case";

export const CATEGORIES: { id: Category; label: string; labelAr: string }[] = [
  { id: "cpu", label: "Processor", labelAr: "المعالج" },
  { id: "gpu", label: "Graphics Card", labelAr: "بطاقة الرسومات" },
  { id: "motherboard", label: "Motherboard", labelAr: "اللوحة الأم" },
  { id: "ram", label: "Memory", labelAr: "الذاكرة العشوائية" },
  { id: "storage", label: "Storage", labelAr: "التخزين" },
  { id: "psu", label: "Power Supply", labelAr: "مزوّد الطاقة" },
  { id: "cooler", label: "CPU Cooler", labelAr: "مبرّد المعالج" },
  { id: "case", label: "Case", labelAr: "الصندوق" },
];


export type Socket = "AM5" | "AM4" | "LGA1700" | "LGA1851";
export type MemoryType = "DDR4" | "DDR5";
export type FormFactor = "ATX" | "Micro-ATX" | "Mini-ITX";

export interface BasePart {
  id: string;
  name: string;
  brand: string;
  category: Category;
  price: number;
  rating: number;
  tdp: number;
  specs: string[];
}

export interface CpuPart extends BasePart {
  category: "cpu";
  socket: Socket;
  memoryType: MemoryType[];
  cores: number;
  /** relative gaming CPU power, 100 = 5800X3D class */
  cpuScore: number;
  integratedGraphics: boolean;
  coolerIncluded: boolean;
}

export interface GpuPart extends BasePart {
  category: "gpu";
  vram: number;
  lengthMm: number;
  /** relative raster power, 100 = RTX 4070 class */
  gpuScore: number;
  rayTracing: boolean;
  upscaler: "DLSS" | "FSR" | "XeSS";
}

export interface MotherboardPart extends BasePart {
  category: "motherboard";
  socket: Socket;
  memoryType: MemoryType;
  formFactor: FormFactor;
  memorySlots: number;
  maxMemory: number;
}

export interface RamPart extends BasePart {
  category: "ram";
  memoryType: MemoryType;
  capacity: number;
  modules: number;
  speed: number;
}

export interface StoragePart extends BasePart {
  category: "storage";
  capacity: number;
  kind: "NVMe SSD" | "SATA SSD" | "HDD";
}

export interface PsuPart extends BasePart {
  category: "psu";
  wattage: number;
  efficiency: string;
  modular: string;
}

export interface CoolerPart extends BasePart {
  category: "cooler";
  sockets: Socket[];
  heightMm: number;
  coolingCapacity: number;
  kind: "Air" | "AIO Liquid";
}

export interface CasePart extends BasePart {
  category: "case";
  supportedFormFactors: FormFactor[];
  maxGpuLengthMm: number;
  maxCoolerHeightMm: number;
}

export type Part =
  | CpuPart
  | GpuPart
  | MotherboardPart
  | RamPart
  | StoragePart
  | PsuPart
  | CoolerPart
  | CasePart;

const cpus: CpuPart[] = [
  {
    id: "cpu-7800x3d",
    name: "Ryzen 7 7800X3D",
    brand: "AMD",
    category: "cpu",
    price: 71500,
    rating: 4.9,
    tdp: 120,
    socket: "AM5",
    memoryType: ["DDR5"],
    cores: 8,
    cpuScore: 152,
    integratedGraphics: true,
    coolerIncluded: false,
    specs: ["8C/16T", "5.0 GHz Boost", "96MB 3D V-Cache"],
  },
  {
    id: "cpu-9800x3d",
    name: "Ryzen 7 9800X3D",
    brand: "AMD",
    category: "cpu",
    price: 98000,
    rating: 4.9,
    tdp: 120,
    socket: "AM5",
    memoryType: ["DDR5"],
    cores: 8,
    cpuScore: 175,
    integratedGraphics: true,
    coolerIncluded: false,
    specs: ["8C/16T", "5.2 GHz Boost", "Zen 5 3D V-Cache"],
  },
  {
    id: "cpu-7600",
    name: "Ryzen 5 7600",
    brand: "AMD",
    category: "cpu",
    price: 38500,
    rating: 4.7,
    tdp: 65,
    socket: "AM5",
    memoryType: ["DDR5"],
    cores: 6,
    cpuScore: 118,
    integratedGraphics: true,
    coolerIncluded: true,
    specs: ["6C/12T", "5.1 GHz Boost", "Wraith Stealth included"],
  },
  {
    id: "cpu-5600",
    name: "Ryzen 5 5600",
    brand: "AMD",
    category: "cpu",
    price: 24500,
    rating: 4.6,
    tdp: 65,
    socket: "AM4",
    memoryType: ["DDR4"],
    cores: 6,
    cpuScore: 92,
    integratedGraphics: false,
    coolerIncluded: true,
    specs: ["6C/12T", "4.4 GHz Boost", "Budget king"],
  },
  {
    id: "cpu-14600k",
    name: "Core i5-14600K",
    brand: "Intel",
    category: "cpu",
    price: 53000,
    rating: 4.6,
    tdp: 181,
    socket: "LGA1700",
    memoryType: ["DDR4", "DDR5"],
    cores: 14,
    cpuScore: 128,
    integratedGraphics: true,
    coolerIncluded: false,
    specs: ["14C/20T", "5.3 GHz Boost", "Unlocked"],
  },
  {
    id: "cpu-14900k",
    name: "Core i9-14900K",
    brand: "Intel",
    category: "cpu",
    price: 112500,
    rating: 4.5,
    tdp: 253,
    socket: "LGA1700",
    memoryType: ["DDR4", "DDR5"],
    cores: 24,
    cpuScore: 160,
    integratedGraphics: true,
    coolerIncluded: false,
    specs: ["24C/32T", "6.0 GHz Boost", "Needs strong cooling"],
  },
  {
    id: "cpu-265k",
    name: "Core Ultra 7 265K",
    brand: "Intel",
    category: "cpu",
    price: 82000,
    rating: 4.3,
    tdp: 250,
    socket: "LGA1851",
    memoryType: ["DDR5"],
    cores: 20,
    cpuScore: 145,
    integratedGraphics: true,
    coolerIncluded: false,
    specs: ["20C/20T", "5.5 GHz Boost", "Arrow Lake"],
  },
];

const gpus: GpuPart[] = [
  {
    id: "gpu-4060",
    name: "GeForce RTX 4060 8GB",
    brand: "NVIDIA",
    category: "gpu",
    price: 59000,
    rating: 4.2,
    tdp: 115,
    vram: 8,
    lengthMm: 245,
    gpuScore: 62,
    rayTracing: true,
    upscaler: "DLSS",
    specs: ["8GB GDDR6", "DLSS 3", "1080p champion"],
  },
  {
    id: "gpu-4070s",
    name: "GeForce RTX 4070 SUPER",
    brand: "NVIDIA",
    category: "gpu",
    price: 123000,
    rating: 4.8,
    tdp: 220,
    vram: 12,
    lengthMm: 305,
    gpuScore: 118,
    rayTracing: true,
    upscaler: "DLSS",
    specs: ["12GB GDDR6X", "DLSS 3", "1440p high refresh"],
  },
  {
    id: "gpu-4080s",
    name: "GeForce RTX 4080 SUPER",
    brand: "NVIDIA",
    category: "gpu",
    price: 205000,
    rating: 4.8,
    tdp: 320,
    vram: 16,
    lengthMm: 336,
    gpuScore: 165,
    rayTracing: true,
    upscaler: "DLSS",
    specs: ["16GB GDDR6X", "DLSS 3", "4K ready"],
  },
  {
    id: "gpu-5090",
    name: "GeForce RTX 5090",
    brand: "NVIDIA",
    category: "gpu",
    price: 410000,
    rating: 4.9,
    tdp: 575,
    vram: 32,
    lengthMm: 304,
    gpuScore: 275,
    rayTracing: true,
    upscaler: "DLSS",
    specs: ["32GB GDDR7", "DLSS 4", "No compromise 4K"],
  },
  {
    id: "gpu-7800xt",
    name: "Radeon RX 7800 XT",
    brand: "AMD",
    category: "gpu",
    price: 98000,
    rating: 4.6,
    tdp: 263,
    vram: 16,
    lengthMm: 267,
    gpuScore: 112,
    rayTracing: true,
    upscaler: "FSR",
    specs: ["16GB GDDR6", "FSR 3", "Great value 1440p"],
  },
  {
    id: "gpu-9070xt",
    name: "Radeon RX 9070 XT",
    brand: "AMD",
    category: "gpu",
    price: 133000,
    rating: 4.7,
    tdp: 304,
    vram: 16,
    lengthMm: 320,
    gpuScore: 155,
    rayTracing: true,
    upscaler: "FSR",
    specs: ["16GB GDDR6", "FSR 4", "RDNA 4"],
  },
  {
    id: "gpu-b580",
    name: "Arc B580 12GB",
    brand: "Intel",
    category: "gpu",
    price: 51000,
    rating: 4.4,
    tdp: 190,
    vram: 12,
    lengthMm: 272,
    gpuScore: 68,
    rayTracing: true,
    upscaler: "XeSS",
    specs: ["12GB GDDR6", "XeSS 2", "Budget 1440p"],
  },
];

const motherboards: MotherboardPart[] = [
  {
    id: "mb-b650",
    name: "TUF Gaming B650-PLUS",
    brand: "ASUS",
    category: "motherboard",
    price: 36500,
    rating: 4.6,
    tdp: 30,
    socket: "AM5",
    memoryType: "DDR5",
    formFactor: "ATX",
    memorySlots: 4,
    maxMemory: 192,
    specs: ["AM5", "DDR5", "ATX", "PCIe 4.0"],
  },
  {
    id: "mb-x670e",
    name: "ROG Strix X670E-E",
    brand: "ASUS",
    category: "motherboard",
    price: 82000,
    rating: 4.7,
    tdp: 40,
    socket: "AM5",
    memoryType: "DDR5",
    formFactor: "ATX",
    memorySlots: 4,
    maxMemory: 192,
    specs: ["AM5", "DDR5", "ATX", "PCIe 5.0"],
  },
  {
    id: "mb-b650i",
    name: "B650I AORUS Ultra",
    brand: "Gigabyte",
    category: "motherboard",
    price: 51000,
    rating: 4.5,
    tdp: 25,
    socket: "AM5",
    memoryType: "DDR5",
    formFactor: "Mini-ITX",
    memorySlots: 2,
    maxMemory: 96,
    specs: ["AM5", "DDR5", "Mini-ITX", "Wi-Fi 6E"],
  },
  {
    id: "mb-b550",
    name: "MAG B550 TOMAHAWK",
    brand: "MSI",
    category: "motherboard",
    price: 30500,
    rating: 4.7,
    tdp: 25,
    socket: "AM4",
    memoryType: "DDR4",
    formFactor: "ATX",
    memorySlots: 4,
    maxMemory: 128,
    specs: ["AM4", "DDR4", "ATX", "PCIe 4.0"],
  },
  {
    id: "mb-z790",
    name: "Z790 AORUS Elite AX",
    brand: "Gigabyte",
    category: "motherboard",
    price: 53000,
    rating: 4.6,
    tdp: 35,
    socket: "LGA1700",
    memoryType: "DDR5",
    formFactor: "ATX",
    memorySlots: 4,
    maxMemory: 192,
    specs: ["LGA1700", "DDR5", "ATX", "Wi-Fi 6E"],
  },
  {
    id: "mb-b760m",
    name: "PRO B760M-A DDR4",
    brand: "MSI",
    category: "motherboard",
    price: 26500,
    rating: 4.4,
    tdp: 25,
    socket: "LGA1700",
    memoryType: "DDR4",
    formFactor: "Micro-ATX",
    memorySlots: 4,
    maxMemory: 128,
    specs: ["LGA1700", "DDR4", "Micro-ATX"],
  },
  {
    id: "mb-z890",
    name: "Z890 Carbon WiFi",
    brand: "MSI",
    category: "motherboard",
    price: 92000,
    rating: 4.5,
    tdp: 40,
    socket: "LGA1851",
    memoryType: "DDR5",
    formFactor: "ATX",
    memorySlots: 4,
    maxMemory: 256,
    specs: ["LGA1851", "DDR5", "ATX", "PCIe 5.0"],
  },
];

const rams: RamPart[] = [
  {
    id: "ram-ddr5-32-6000",
    name: "Vengeance 32GB (2x16) DDR5-6000",
    brand: "Corsair",
    category: "ram",
    price: 22500,
    rating: 4.8,
    tdp: 10,
    memoryType: "DDR5",
    capacity: 32,
    modules: 2,
    speed: 6000,
    specs: ["DDR5-6000 CL30", "2x16GB", "EXPO/XMP"],
  },
  {
    id: "ram-ddr5-16-5600",
    name: "Fury Beast 16GB (2x8) DDR5-5600",
    brand: "Kingston",
    category: "ram",
    price: 12000,
    rating: 4.5,
    tdp: 8,
    memoryType: "DDR5",
    capacity: 16,
    modules: 2,
    speed: 5600,
    specs: ["DDR5-5600 CL36", "2x8GB"],
  },
  {
    id: "ram-ddr5-64-6400",
    name: "Trident Z5 64GB (2x32) DDR5-6400",
    brand: "G.Skill",
    category: "ram",
    price: 47000,
    rating: 4.7,
    tdp: 12,
    memoryType: "DDR5",
    capacity: 64,
    modules: 2,
    speed: 6400,
    specs: ["DDR5-6400 CL32", "2x32GB", "RGB"],
  },
  {
    id: "ram-ddr4-32-3600",
    name: "Ripjaws V 32GB (2x16) DDR4-3600",
    brand: "G.Skill",
    category: "ram",
    price: 15000,
    rating: 4.7,
    tdp: 10,
    memoryType: "DDR4",
    capacity: 32,
    modules: 2,
    speed: 3600,
    specs: ["DDR4-3600 CL16", "2x16GB"],
  },
  {
    id: "ram-ddr4-16-3200",
    name: "Vengeance LPX 16GB (2x8) DDR4-3200",
    brand: "Corsair",
    category: "ram",
    price: 8000,
    rating: 4.6,
    tdp: 8,
    memoryType: "DDR4",
    capacity: 16,
    modules: 2,
    speed: 3200,
    specs: ["DDR4-3200 CL16", "2x8GB"],
  },
];

const storages: StoragePart[] = [
  {
    id: "ssd-990-1tb",
    name: "990 PRO 1TB NVMe",
    brand: "Samsung",
    category: "storage",
    price: 20500,
    rating: 4.9,
    tdp: 8,
    capacity: 1000,
    kind: "NVMe SSD",
    specs: ["7450 MB/s read", "PCIe 4.0", "1TB"],
  },
  {
    id: "ssd-sn850-2tb",
    name: "WD Black SN850X 2TB",
    brand: "Western Digital",
    category: "storage",
    price: 32500,
    rating: 4.8,
    tdp: 9,
    capacity: 2000,
    kind: "NVMe SSD",
    specs: ["7300 MB/s read", "PCIe 4.0", "2TB"],
  },
  {
    id: "ssd-mx500-1tb",
    name: "MX500 1TB SATA",
    brand: "Crucial",
    category: "storage",
    price: 14000,
    rating: 4.6,
    tdp: 5,
    capacity: 1000,
    kind: "SATA SSD",
    specs: ["560 MB/s read", "2.5 inch", "1TB"],
  },
  {
    id: "hdd-barracuda-4tb",
    name: "BarraCuda 4TB HDD",
    brand: "Seagate",
    category: "storage",
    price: 16000,
    rating: 4.3,
    tdp: 10,
    capacity: 4000,
    kind: "HDD",
    specs: ["5400 RPM", "Mass storage", "4TB"],
  },
];

const psus: PsuPart[] = [
  {
    id: "psu-550",
    name: "CX550M 550W",
    brand: "Corsair",
    category: "psu",
    price: 13000,
    rating: 4.4,
    tdp: 0,
    wattage: 550,
    efficiency: "80+ Bronze",
    modular: "Semi-modular",
    specs: ["550W", "80+ Bronze"],
  },
  {
    id: "psu-750",
    name: "RM750e 750W",
    brand: "Corsair",
    category: "psu",
    price: 22500,
    rating: 4.7,
    tdp: 0,
    wattage: 750,
    efficiency: "80+ Gold",
    modular: "Fully modular",
    specs: ["750W", "80+ Gold", "ATX 3.0"],
  },
  {
    id: "psu-850",
    name: "SuperNOVA 850 G7",
    brand: "EVGA",
    category: "psu",
    price: 30500,
    rating: 4.6,
    tdp: 0,
    wattage: 850,
    efficiency: "80+ Gold",
    modular: "Fully modular",
    specs: ["850W", "80+ Gold"],
  },
  {
    id: "psu-1200",
    name: "Toughpower GF3 1200W",
    brand: "Thermaltake",
    category: "psu",
    price: 47000,
    rating: 4.7,
    tdp: 0,
    wattage: 1200,
    efficiency: "80+ Platinum",
    modular: "Fully modular",
    specs: ["1200W", "80+ Platinum", "12VHPWR"],
  },
];

const coolers: CoolerPart[] = [
  {
    id: "cool-ak620",
    name: "AK620 Dual Tower",
    brand: "DeepCool",
    category: "cooler",
    price: 13000,
    rating: 4.8,
    tdp: 6,
    sockets: ["AM5", "AM4", "LGA1700", "LGA1851"],
    heightMm: 160,
    coolingCapacity: 260,
    kind: "Air",
    specs: ["Dual tower air", "160mm tall"],
  },
  {
    id: "cool-pa120",
    name: "Peerless Assassin 120 SE",
    brand: "Thermalright",
    category: "cooler",
    price: 7000,
    rating: 4.9,
    tdp: 5,
    sockets: ["AM5", "AM4", "LGA1700"],
    heightMm: 155,
    coolingCapacity: 245,
    kind: "Air",
    specs: ["Best value air", "155mm tall"],
  },
  {
    id: "cool-l12s",
    name: "Noctua NH-L12S",
    brand: "Noctua",
    category: "cooler",
    price: 13500,
    rating: 4.7,
    tdp: 4,
    sockets: ["AM5", "AM4", "LGA1700"],
    heightMm: 70,
    coolingCapacity: 120,
    kind: "Air",
    specs: ["Low profile", "70mm tall"],
  },
  {
    id: "cool-aio360",
    name: "Kraken 360 AIO",
    brand: "NZXT",
    category: "cooler",
    price: 36500,
    rating: 4.6,
    tdp: 12,
    sockets: ["AM5", "AM4", "LGA1700", "LGA1851"],
    heightMm: 55,
    coolingCapacity: 320,
    kind: "AIO Liquid",
    specs: ["360mm radiator", "LCD display"],
  },
];

const cases: CasePart[] = [
  {
    id: "case-lancool",
    name: "Lancool 216 ATX",
    brand: "Lian Li",
    category: "case",
    price: 22500,
    rating: 4.8,
    tdp: 0,
    supportedFormFactors: ["ATX", "Micro-ATX", "Mini-ITX"],
    maxGpuLengthMm: 392,
    maxCoolerHeightMm: 180,
    specs: ["Mid tower", "High airflow", "392mm GPU"],
  },
  {
    id: "case-h5flow",
    name: "H5 Flow",
    brand: "NZXT",
    category: "case",
    price: 19500,
    rating: 4.5,
    tdp: 0,
    supportedFormFactors: ["ATX", "Micro-ATX", "Mini-ITX"],
    maxGpuLengthMm: 365,
    maxCoolerHeightMm: 165,
    specs: ["Mid tower", "Tempered glass"],
  },
  {
    id: "case-a4h2o",
    name: "A4-H2O Mini-ITX",
    brand: "Lian Li",
    category: "case",
    price: 26500,
    rating: 4.4,
    tdp: 0,
    supportedFormFactors: ["Mini-ITX"],
    maxGpuLengthMm: 322,
    maxCoolerHeightMm: 70,
    specs: ["11L SFF", "Vertical GPU"],
  },
  {
    id: "case-4000d",
    name: "4000D Airflow",
    brand: "Corsair",
    category: "case",
    price: 21500,
    rating: 4.8,
    tdp: 0,
    supportedFormFactors: ["ATX", "Micro-ATX", "Mini-ITX"],
    maxGpuLengthMm: 360,
    maxCoolerHeightMm: 170,
    specs: ["Mid tower", "Airflow front panel"],
  },
];

export const PARTS: Part[] = [
  ...cpus,
  ...gpus,
  ...motherboards,
  ...rams,
  ...storages,
  ...psus,
  ...coolers,
  ...cases,
];

export const PARTS_BY_ID: Record<string, Part> = Object.fromEntries(
  PARTS.map((p) => [p.id, p]),
);

export function partsFor(category: Category): Part[] {
  return PARTS.filter((p) => p.category === category);
}

export type Build = Partial<Record<Category, string>>;
