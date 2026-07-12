const GALLERY_LIKE_COUNTS_STORAGE_KEY = "portfolio-gallery-like-counts-v1";

/** Placeholder totals until a backend exists — one value per project (30–100). */
export const GALLERY_LIKE_COUNT_SEEDS: Record<string, number> = {
  "work/1": 147,
  "work/2": 30,
  "work/3": 185,
  "work/4": 252,
  "work/5": 38,
  "work/6": 47,
  "work/7": 55,
  "work/8": 33,
  "work/9": 48,
  "work/10": 36,
  "work/11": 30,
  "work/12": 167,
  "work/13": 78,
  "work/14": 338,
  "work/15": 30,
  "work/16": 44,
};

export function defaultGalleryLikeCount(projectKey: string): number {
  return GALLERY_LIKE_COUNT_SEEDS[projectKey] ?? 30;
}

export function readGalleryLikeCounts(): Record<string, number> {
  const merged: Record<string, number> = { ...GALLERY_LIKE_COUNT_SEEDS };
  if (typeof localStorage === "undefined") return merged;
  try {
    const raw = localStorage.getItem(GALLERY_LIKE_COUNTS_STORAGE_KEY);
    if (!raw) return merged;
    const parsed = JSON.parse(raw) as unknown;
    if (parsed === null || typeof parsed !== "object") return merged;
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
        merged[key] = Math.round(value);
      }
    }
  } catch {
    /* ignore */
  }
  return merged;
}

export function persistGalleryLikeCounts(counts: Record<string, number>): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(GALLERY_LIKE_COUNTS_STORAGE_KEY, JSON.stringify(counts));
  } catch {
    /* ignore */
  }
}

export function adjustGalleryLikeCount(
  counts: Record<string, number>,
  projectKey: string,
  delta: 1 | -1,
): Record<string, number> {
  const current = counts[projectKey] ?? defaultGalleryLikeCount(projectKey);
  const floor = defaultGalleryLikeCount(projectKey);
  const nextValue =
    delta === 1 ? current + 1 : Math.max(floor, current - 1);
  return { ...counts, [projectKey]: nextValue };
}
