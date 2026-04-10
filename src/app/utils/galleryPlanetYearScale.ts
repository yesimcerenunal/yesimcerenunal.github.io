import portfolioContentEn from "../data/portfolio-content-en.json";

/** En küçük gezegen (en eski yıl) — `base * YEAR_SCALE_MIN`. */
export const GALLERY_YEAR_PLANET_SCALE_MIN = 0.76;
/** En büyük gezegen (en yeni yıl) — `base * YEAR_SCALE_MAX`. */
export const GALLERY_YEAR_PLANET_SCALE_MAX = 1.24;

/**
 * `year` alanındaki tüm 4 haneli yılları bulur; **en büyüğü** “güncellik” kabul edilir
 * (`"2021-2024"` → 2024).
 */
export function parseYearStringToRecencyYear(yearStr: string): number | null {
  const s = yearStr.trim();
  if (!s) return null;
  const matches = s.match(/\b(19|20)\d{2}\b/g);
  if (!matches?.length) return null;
  return Math.max(...matches.map(Number));
}

/**
 * Aynı uzunlukta `projectKeys` için çarpanlar: **daha yeni yıl → daha büyük** (min–max arası lineer).
 * Yıl yoksa veya tüm işler aynı yılda → hepsi ~1.
 */
export function galleryYearScaleFactorsForProjectKeys(
  projectKeys: readonly string[],
): number[] {
  const en = portfolioContentEn as Record<string, { year?: string } | undefined>;
  const recency: (number | null)[] = projectKeys.map((k) => {
    const raw = en[k]?.year;
    return typeof raw === "string" ? parseYearStringToRecencyYear(raw) : null;
  });
  const defined = recency.filter((y): y is number => y != null);
  if (defined.length === 0) {
    return projectKeys.map(() => 1);
  }
  const minY = Math.min(...defined);
  const maxY = Math.max(...defined);
  const span = maxY - minY;
  const mid = (GALLERY_YEAR_PLANET_SCALE_MIN + GALLERY_YEAR_PLANET_SCALE_MAX) * 0.5;
  if (span < 1e-6) {
    return projectKeys.map(() => 1);
  }
  return recency.map((y) => {
    if (y == null) return mid;
    const t = (y - minY) / span;
    return (
      GALLERY_YEAR_PLANET_SCALE_MIN +
      t * (GALLERY_YEAR_PLANET_SCALE_MAX - GALLERY_YEAR_PLANET_SCALE_MIN)
    );
  });
}
