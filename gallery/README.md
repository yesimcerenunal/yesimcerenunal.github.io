# Gallery media

Kaynak dosyalar repo kökündeki **`gallery/`** altında tutulur; **`npm run gallery:sync`** bunları **`public/gallery/`** ile eşitler. Vite build sırasında **`public/gallery/`** → **`dist/gallery/`** olarak çıkar.

## Single source of truth

| What | Where |
|------|--------|
| **Which projects exist and in what order** | **`src/app/data/gallery-manifest.json`** — proje listesi elle; `gallery:sync` yalnızca her proje için `images[]` dosya listesini ve `lastUpdated` alanını diske göre günceller. |
| **Media files on disk** | `gallery/` (kök) ve `public/gallery/` — `npm run gallery:sync` ile hizalanır. Kapak: `00.jpg` (veya `00.png` / `00.webp`), `0.*` kullanılmaz. |
| **Titles, descriptions, years (EN / DE / TR)** | **`src/app/i18n/translations.ts`** → `portfolioProjectsEn` / `De` / `Tr` → `portfolio.projects` |

Yeni klasörler için önce **`gallery-manifest.json`** ve **`translations.ts`** güncellenir; dosyalar genelde **`gallery/`** köküne konur, sonra **`npm run gallery:sync`** `public/gallery/` ile eşitler ve manifest’teki `images[]` listesini diske göre yeniler.

## Manifest format

Each project has `category`, `categoryFolder`, `slug`, and `images[]` (paths relative to `public/`, usually `gallery/...`). The UI builds `projectKey` as `categoryFolder/slug` — it must match the translation keys.

## Layout (folder conventions)

Category folders typically used:

| App label (EN)     | Folder              |
|--------------------|---------------------|
| Interactive / VR   | `interactive-vr/`   |
| Motion             | `motion/`           |
| 3D Archive         | `3d-archive/`       |
| 2D Archive         | `2d-archive/`       |

Each **project** is a subfolder; file naming for the 3D card and detail view:

- **`00.*`** = kapak + 3D kart yüzü (tercihen raster görsel).
- **`1`**, **`2`**, … = detay sırası. `0.*` kullanılmaz (kapak için yalnızca **`00`**).

## Placeholder JPEGs

To write tiny JPEGs for every **image** path listed in the manifest (does not change the manifest):

```bash
npm run gallery:placeholders
```

## Videos

Additional clips can live under **`public/videos/`** — see `public/videos/README.md`.
