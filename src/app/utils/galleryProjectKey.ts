/**
 * Canonical `projectKey` = `${categoryFolder}/${slug}` after normalization.
 * Use the same rules in manifest JSON and in `translations.ts` keys.
 */
export function normalizeManifestKeyPart(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

/** Build the lookup key used in `portfolio.projects` and `GalleryImage.projectKey`. */
export function projectKeyFromParts(
  categoryFolder: string,
  slug: string,
): string {
  return `${normalizeManifestKeyPart(categoryFolder)}/${normalizeManifestKeyPart(slug)}`;
}

/** Slug segment only (after last `/`) — safe display fallback for titles. */
export function slugFromProjectKey(projectKey: string): string {
  const k = projectKey.trim();
  const i = k.lastIndexOf("/");
  return i >= 0 ? k.slice(i + 1) : k;
}

/** Manifest `categoryFolder` for flat disk layout: `gallery/<slug>/` and keys `work/<slug>`. */
export const GALLERY_FLAT_CATEGORY_FOLDER = "work";

/**
 * Slug `--` or `--*` is not published (draft). Applies to `work` slots (`gallery/<slug>/`).
 */
export function isDraftGallerySlugHidden(slug: string): boolean {
  const s = slug.trim();
  return s === "--" || s.startsWith("--");
}
