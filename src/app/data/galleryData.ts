import type { GalleryImage } from "../components/Gallery3D";
import {
  GALLERY_CATEGORIES,
  type GalleryCategory,
} from "../context/WorksCategoryContext";
import { translations } from "../i18n/translations";
import { publicAsset } from "../utils/publicAsset";
import galleryManifest from "./gallery-manifest.json";

/**
 * Gallery media paths come from `public/gallery/` (sync → gallery-manifest.json).
 * Titles, descriptions, and years are maintained in `src/app/i18n/translations.ts`
 * under `portfolio.projects` (keys: `categoryFolder/slug`).
 *
 * @see public/gallery/README.md
 */
export type GalleryManifestProject = (typeof galleryManifest.projects)[number];

/**
 * Canonical lookup key for `translations.*.portfolio.projects`.
 * Must be byte-identical to keys in `translations.ts` (same string as `categoryFolder + "/" + slug` in manifest).
 * Trims manifest fields so accidental whitespace in JSON cannot break lookup.
 */
export function projectKeyFromManifestEntry(entry: {
  categoryFolder: string;
  slug: string;
}): string {
  const folder = entry.categoryFolder.trim();
  const slug = entry.slug.trim();
  return `${folder}/${slug}`;
}

function projectKey(entry: { categoryFolder: string; slug: string }): string {
  return projectKeyFromManifestEntry(entry);
}

function manifestEntryToGalleryImage(entry: GalleryManifestProject): GalleryImage {
  return {
    projectKey: projectKey(entry),
    images: entry.images.map((p) => publicAsset(p)),
    category: entry.category,
  };
}

/** Flat list for "All" and the gallery — order follows manifest (category order, then project). */
export const galleryItems: GalleryImage[] = galleryManifest.projects.map(
  manifestEntryToGalleryImage,
);

if (import.meta.env?.DEV) {
  const byCategory = new Map<GalleryCategory, number>();
  for (const c of GALLERY_CATEGORIES) {
    byCategory.set(c, 0);
  }
  const enProjectKeys = new Set(
    Object.keys(translations.en.portfolio.projects),
  );
  const manifestKeys = new Set(
    galleryManifest.projects.map((p) => projectKey(p)),
  );
  for (const p of galleryManifest.projects) {
    const cat = p.category as GalleryCategory;
    if (!GALLERY_CATEGORIES.includes(cat)) {
      console.warn(
        `[galleryData] Unknown category in manifest: "${p.category}" (project "${p.slug}").`,
      );
      continue;
    }
    byCategory.set(cat, (byCategory.get(cat) ?? 0) + 1);
    const k = projectKey(p);
    if (!enProjectKeys.has(k)) {
      console.error(
        `[galleryData] Manifest projectKey not in translations.en.portfolio.projects: ${JSON.stringify(k)}`,
      );
      console.error(
        "[galleryData] Object.keys(messages.portfolio.projects) (en):",
        [...enProjectKeys].sort(),
      );
    }
  }
  for (const k of enProjectKeys) {
    if (!manifestKeys.has(k)) {
      console.error(
        `[galleryData] translations key not in manifest (orphan): ${JSON.stringify(k)}`,
      );
    }
  }
  const enSorted = [...enProjectKeys].sort();
  for (const loc of ["de", "tr"] as const) {
    const locKeys = Object.keys(translations[loc].portfolio.projects).sort();
    if (JSON.stringify(enSorted) !== JSON.stringify(locKeys)) {
      console.error(
        `[galleryData] portfolio.projects keys differ between en and ${loc} (must match byte-for-byte).`,
        { en: enSorted, [loc]: locKeys },
      );
    }
  }
  for (const [cat, n] of byCategory) {
    if (n === 0) {
      console.warn(`[galleryData] Category "${cat}" has no projects on disk.`);
    }
  }
  const seen = new Set<string>();
  for (const item of galleryItems) {
    if (seen.has(item.projectKey)) {
      console.warn(`[galleryData] Duplicate project key: ${item.projectKey}`);
    }
    seen.add(item.projectKey);
  }
}
