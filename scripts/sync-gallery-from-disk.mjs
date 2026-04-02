#!/usr/bin/env node
/**
 * Scans public/gallery/{category-folder}/{project-slug}/ for images and writes
 * src/app/data/gallery-manifest.json. Run manually: npm run gallery:sync
 * (also runs on dev server start and when public/gallery changes — see vite.config).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const galleryRoot = path.join(root, "public", "gallery");
const outFile = path.join(root, "src", "app", "data", "gallery-manifest.json");

/**
 * Scan order + manifest sort order (folder index).
 * Folder names match sidebar categories (slug form). Labels: WorksCategoryContext.tsx.
 */
const CATEGORY_FOLDERS = [
  { folder: "interactive-vr", category: "Interactive / VR" },
  { folder: "motion", category: "Motion" },
  { folder: "campaigns", category: "Campaigns" },
  { folder: "3d-archive", category: "3D Archive" },
  { folder: "2d-archive", category: "2D Archive" },
];

const MEDIA_RE = /\.(jpe?g|png|webp|mp4|webm)$/i;

function naturalCompare(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

/**
 * Filenames must be digits only before the extension: `0.jpg` = hero + card cover,
 * then `1`, `2`, `3`, … for additional shots. Non-numeric names sort last.
 */
function basenameOrderKey(filename) {
  const base = path.basename(filename, path.extname(filename));
  if (/^\d+$/.test(base)) {
    return parseInt(base, 10);
  }
  return Number.MAX_SAFE_INTEGER;
}

function collectMedia(projectDir, folder, slug) {
  const names = fs.readdirSync(projectDir);
  const files = names
    .filter((n) => MEDIA_RE.test(n) && fs.statSync(path.join(projectDir, n)).isFile())
    .sort((a, b) => {
      const ka = basenameOrderKey(a);
      const kb = basenameOrderKey(b);
      if (ka !== kb) return ka - kb;
      return naturalCompare(a, b);
    });

  if (files.length > 0) {
    const firstBase = path.basename(files[0], path.extname(files[0]));
    if (firstBase !== "0") {
      console.warn(
        `[gallery-sync] "${folder}/${slug}": hero/cover should be 0.* (e.g. 0.jpg); first sorted file is "${files[0]}".`,
      );
    }
    const ext = path.extname(files[0]).toLowerCase();
    if (/\.(mp4|webm)$/.test(ext)) {
      console.warn(
        `[gallery-sync] "${folder}/${slug}": 0.* is video — 3D card needs 0.jpg/png/webp or uses fallback.`,
      );
    }
  }

  return files;
}

function run() {
  const projects = [];

  if (!fs.existsSync(galleryRoot)) {
    fs.mkdirSync(galleryRoot, { recursive: true });
  }

  for (const { folder, category } of CATEGORY_FOLDERS) {
    const catDir = path.join(galleryRoot, folder);
    if (!fs.existsSync(catDir) || !fs.statSync(catDir).isDirectory()) {
      continue;
    }

    const entries = fs.readdirSync(catDir, { withFileTypes: true });
    const subdirs = entries.filter((e) => e.isDirectory()).map((e) => e.name);

    for (const slug of subdirs.sort(naturalCompare)) {
      const projectDir = path.join(catDir, slug);
      const imageFiles = collectMedia(projectDir, folder, slug);
      if (imageFiles.length === 0) {
        console.warn(
          `[gallery-sync] Skip "${folder}/${slug}" — no media (.jpg, .png, .webp, .mp4, .webm).`,
        );
        continue;
      }

      const images = imageFiles.map(
        (f) => `gallery/${folder}/${slug}/${f}`.replace(/\\/g, "/"),
      );

      projects.push({
        category,
        categoryFolder: folder,
        slug,
        images,
      });
    }
  }

  const folderOrder = new Map(
    CATEGORY_FOLDERS.map((c, index) => [c.folder, index]),
  );
  projects.sort((a, b) => {
    const ai = folderOrder.get(a.categoryFolder) ?? 999;
    const bi = folderOrder.get(b.categoryFolder) ?? 999;
    if (ai !== bi) return ai - bi;
    return naturalCompare(a.slug, b.slug);
  });

  const manifest = {
    version: 1,
    generated: new Date().toISOString(),
    projects: projects.map(({ category, categoryFolder, slug, images }) => ({
      category,
      categoryFolder,
      slug,
      images,
    })),
  };

  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  const payload = JSON.stringify(manifest, null, 2) + "\n";
  const tmp = path.join(
    path.dirname(outFile),
    `.gallery-manifest.${process.pid}.tmp`,
  );
  try {
    fs.writeFileSync(tmp, payload, "utf8");
    fs.renameSync(tmp, outFile);
  } catch (e) {
    try {
      fs.unlinkSync(tmp);
    } catch {
      /* ignore */
    }
    throw e;
  }

  console.log(
    `[gallery-sync] Wrote ${manifest.projects.length} project(s) → ${path.relative(root, outFile)}`,
  );
}

run();
