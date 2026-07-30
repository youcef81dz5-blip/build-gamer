import { CATEGORIES, PARTS_BY_ID, type Build, type Category } from "./parts-data";

/** Compact "cpu:id|gpu:id" encoding, base64url'd for the ?b= query param. */
export function encodeBuild(build: Build): string {
  const raw = CATEGORIES.filter((c) => build[c.id])
    .map((c) => `${c.id}:${build[c.id]}`)
    .join("|");
  if (!raw) return "";
  return btoa(raw).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeBuild(code: string): Build {
  try {
    const raw = atob(code.replace(/-/g, "+").replace(/_/g, "/"));
    const build: Build = {};
    for (const chunk of raw.split("|")) {
      const [cat, id] = chunk.split(":");
      if (PARTS_BY_ID[id] && CATEGORIES.some((c) => c.id === cat)) {
        build[cat as Category] = id;
      }
    }
    return build;
  } catch {
    return {};
  }
}
