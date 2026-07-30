import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "ar" | "en";

type Dict = Record<string, { ar: string; en: string }>;

export const STRINGS: Dict = {
  tagline: { ar: "ركّب · تحقّق · قِس الأداء", en: "Build · Verify · Benchmark" },
  heroTitle: { ar: "منصّة نيونفورج لتركيب الحاسب", en: "NEONFORGE PC BUILDER" },
  heroDesc: {
    ar: "اختر قطعك، واكتشف فوراً تعارضات المقبس والذاكرة والمساحة والطاقة، ثم شاهد عدد الإطارات التي يقدمها جهازك في ألعابك المفضلة.",
    en: "Pick your parts, catch socket, memory, clearance and power conflicts in real time, then see how many frames the rig actually pushes in the games you play.",
  },
  module01: { ar: "الوحدة 01", en: "Module 01" },
  module02: { ar: "الوحدة 02", en: "Module 02" },
  partSelection: { ar: "اختيار القطع", en: "Part Selection" },
  reset: { ar: "تصفير", en: "Reset" },
  notSelected: { ar: "لم يتم الاختيار", en: "Not selected" },
  buildSummary: { ar: "ملخّص التجميعة", en: "Build Summary" },
  totalPrice: { ar: "السعر الإجمالي", en: "Total price" },
  estLoad: { ar: "الاستهلاك التقديري", en: "Est. load" },
  recommendedPsu: { ar: "مزوّد الطاقة المقترح:", en: "Recommended PSU:" },
  orHigher: { ar: "واط أو أعلى", en: "W or higher" },
  compatible: { ar: "متوافقة", en: "Compatible" },
  compatibleWarn: { ar: "متوافقة مع تنبيهات", en: "Compatible with warnings" },
  conflicts: { ar: "توجد تعارضات", en: "Conflicts detected" },
  share: { ar: "مشاركة التجميعة", en: "Share build" },
  copied: { ar: "تم نسخ الرابط", en: "Link copied" },
  pdf: { ar: "PDF", en: "PDF" },
  compatibility: { ar: "التوافق", en: "Compatibility" },
  noIssues: { ar: "لا توجد مشاكل توافق.", en: "No compatibility issues detected." },
  footer: {
    ar: "نيونفورج · أرقام الإطارات تقديرية وليست قياسات فعلية",
    en: "Neonforge · FPS figures are model estimates, not measured benchmarks",
  },
  choose: { ar: "اختر", en: "Choose" },
  close: { ar: "إغلاق", en: "Close" },
  search: { ar: "ابحث في", en: "Search" },
  allBrands: { ar: "كل العلامات", en: "All brands" },
  max: { ar: "حتى", en: "Max" },
  anyRating: { ar: "أي تقييم", en: "Any rating" },
  price: { ar: "السعر", en: "Price" },
  topRated: { ar: "الأعلى تقييماً", en: "Top rated" },
  noResults: { ar: "لا توجد قطع مطابقة لهذه الفلاتر.", en: "No parts match these filters." },
  compatibleOnly: { ar: "المتوافقة فقط", en: "Compatible only" },
  incompatible: { ar: "غير متوافقة", en: "Incompatible" },
  hiddenCount: { ar: "قطعة غير متوافقة مخفية", en: "incompatible parts hidden" },
  fpsTitle: { ar: "مقدّر أداء الألعاب", en: "Game Performance Estimator" },
  presetUltra: { ar: "فائق", en: "Ultra" },
  presetHigh: { ar: "عالي", en: "High" },
  presetMedium: { ar: "متوسط", en: "Medium" },
  filterAll: { ar: "الكل", en: "All" },
  filterAAA: { ar: "AAA", en: "AAA" },
  filterEsports: { ar: "رياضات إلكترونية", en: "Esports" },
  needCpuGpu: {
    ar: "اختر معالجاً وبطاقة رسومات لعرض توقعات الإطارات.",
    en: "Select a CPU and a graphics card to unlock FPS predictions.",
  },
  fpsUnit: { ar: "إطار/ث", en: "FPS" },
  preset: { ar: "إعداد", en: "preset" },
  limitedBy: { ar: "المحدِّد للأداء:", en: "Limited by" },
  langToggle: { ar: "English", en: "العربية" },
};

interface Ctx {
  lang: Lang;
  dir: "rtl" | "ltr";
  t: (key: keyof typeof STRINGS | string) => string;
  toggle: () => void;
}

const LanguageContext = createContext<Ctx>({
  lang: "ar",
  dir: "rtl",
  t: (k) => STRINGS[k]?.ar ?? String(k),
  toggle: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("ar");

  useEffect(() => {
    const saved = localStorage.getItem("nf-lang") as Lang | null;
    if (saved === "ar" || saved === "en") setLang(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    localStorage.setItem("nf-lang", lang);
  }, [lang]);

  const t = useCallback((key: string) => STRINGS[key]?.[lang] ?? key, [lang]);
  const toggle = useCallback(() => setLang((l) => (l === "ar" ? "en" : "ar")), []);

  return (
    <LanguageContext.Provider value={{ lang, dir: lang === "ar" ? "rtl" : "ltr", t, toggle }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}

/** Picks the localized side of a bilingual string pair. */
export function pick(pair: { ar: string; en: string }, lang: Lang) {
  return pair[lang];
}
