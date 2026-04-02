# Media documentation

## Local assets only

- **Gallery images**: `public/gallery/` — category folders and one subfolder per project; see [`public/gallery/README.md`](../public/gallery/README.md). Per project, name files **`0.*`** (hero + cover), **`1.*`**, **`2.*`**, … for the rest.
- **Generated index**: `src/app/data/gallery-manifest.json` is produced by **`scripts/sync-gallery-from-disk.mjs`** (run via **`npm run gallery:sync`**, or automatically when you use **`npm run dev`** / **`npm run build`** and when files under `public/gallery` change).
- **Runtime code**: `src/app/data/galleryData.ts` imports the manifest and wraps paths with **`publicAsset()`** from **`src/app/utils/publicAsset.ts`** so URLs respect Vite `base`.
- **Portfolio titles, descriptions, years (EN / DE / TR)**: **`src/app/i18n/translations.ts`** — `portfolioProjectsEn` / `portfolioProjectsDe` / `portfolioProjectsTr`, keyed by `categoryFolder/slug` (see `portfolioProjectCopy()` in the same file).
- **Videos** (when you add them): `public/videos/` — see [`public/videos/README.md`](../public/videos/README.md).
- **Global image fallback** (load errors): `public/fallback.jpg`.

## After clone or empty folders

```bash
npm run gallery:placeholders
```

This syncs from disk, then writes tiny placeholder JPEGs for every image path in the manifest plus `public/fallback.jpg`.

## Categories

Folder names under `public/gallery/` match categories: `interactive-vr/`, `motion/`, `campaigns/`, `3d-archive/`, `2d-archive/`. Add **projects** as subfolders inside those; wiring is in `scripts/sync-gallery-from-disk.mjs` and nav order in `WorksCategoryContext`.
