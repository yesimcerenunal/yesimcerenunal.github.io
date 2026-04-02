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

function projectKey(entry: { categoryFolder: string; slug: string }): string {
  return `${entry.categoryFolder}/${entry.slug}`;
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
      console.warn(
        `[galleryData] Add portfolio copy in translations.ts (en.portfolio.projects): "${k}"`,
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
