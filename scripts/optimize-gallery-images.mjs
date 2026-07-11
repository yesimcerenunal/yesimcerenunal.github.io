/**
 * Galeri görsellerinden web için optimize WebP üretir:
 *   - Kapak `00.*`        → `00-thumb.webp`  (maks. 640px, q80)  — 3D kart dokusu
 *   - Slayt `<n>.*` (n≥1) → `<n>-web.webp`    (maks. 1600px, q82) — detay modalı
 *
 * Orijinaller korunur; runtime önce WebP'i dener, olmazsa orijinale düşer.
 * - Idempotent: hedef kaynaktan yeni ise atlar.
 * - Hem `gallery/<n>/` hem `public/gallery/<n>/` altına yazar.
 *
 * Çalıştırma: `node scripts/optimize-gallery-images.mjs` (prebuild/predev otomatik çağırır).
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const COVER_RE = /^00\.(jpe?g|png|webp)$/i;
const SLIDE_RE = /^(\d+)\.(jpe?g|png|webp)$/i;

/** [maxWidth, quality] */
const COVER_OPTS = [640, 80];
const SLIDE_OPTS = [1600, 82];

function hasCwebp() {
  try {
    execFileSync("cwebp", ["-version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function imageWidth(file) {
  try {
    const out = execFileSync("sips", ["-g", "pixelWidth", file], {
      encoding: "utf8",
    });
    const m = out.match(/pixelWidth:\s*(\d+)/);
    return m ? parseInt(m[1], 10) : null;
  } catch {
    return null;
  }
}

function listProjectDirs(galleryDir) {
  if (!fs.existsSync(galleryDir)) return [];
  return fs
    .readdirSync(galleryDir)
    .map((name) => path.join(galleryDir, name))
    .filter((p) => {
      try {
        return fs.statSync(p).isDirectory();
      } catch {
        return false;
      }
    });
}

function isUpToDate(src, dst) {
  if (!fs.existsSync(dst)) return false;
  try {
    return fs.statSync(dst).mtimeMs >= fs.statSync(src).mtimeMs;
  } catch {
    return false;
  }
}

function makeWebp(srcPath, dstPath, maxWidth, quality) {
  const width = imageWidth(srcPath);
  const args = ["-quiet", "-q", String(quality)];
  if (width && width > maxWidth) args.push("-resize", String(maxWidth), "0");
  args.push(srcPath, "-o", dstPath);
  execFileSync("cwebp", args, { stdio: "ignore" });
}

if (!hasCwebp()) {
  console.warn(
    "[optimize-gallery-images] cwebp bulunamadı — WebP üretimi atlandı (brew install webp).",
  );
  process.exit(0);
}

/** Bir kaynak görsel için üretilecek hedefler: same dir + public eşleniği. */
function targetsFor(srcDir, projectName, outName) {
  const targets = [path.join(srcDir, outName)];
  const pubDir = path.join(root, "public", "gallery", projectName);
  // Yalnızca public proje klasörü zaten varsa oraya da yaz (sync gerisini halleder).
  if (fs.existsSync(pubDir)) targets.push(path.join(pubDir, outName));
  return targets;
}

let made = 0;
let skipped = 0;

for (const dir of listProjectDirs(path.join(root, "gallery"))) {
  const projectName = path.basename(dir);
  let files;
  try {
    files = fs.readdirSync(dir);
  } catch {
    continue;
  }

  for (const file of files) {
    let outName = null;
    let opts = null;

    if (COVER_RE.test(file)) {
      outName = "00-thumb.webp";
      opts = COVER_OPTS;
    } else {
      const m = SLIDE_RE.exec(file);
      // `00` slayt değil; poster `<n>-.jpg` SLIDE_RE'ye uymaz (tire var).
      if (m && m[1] !== "00") {
        outName = `${m[1]}-web.webp`;
        opts = SLIDE_OPTS;
      }
    }

    if (!outName || !opts) continue;

    const srcPath = path.join(dir, file);
    for (const dst of targetsFor(dir, projectName, outName)) {
      if (isUpToDate(srcPath, dst)) {
        skipped += 1;
        continue;
      }
      fs.mkdirSync(path.dirname(dst), { recursive: true });
      try {
        makeWebp(srcPath, dst, opts[0], opts[1]);
        made += 1;
      } catch (e) {
        console.error(`[optimize-gallery-images] ${dst} üretilemedi:`, e.message);
      }
    }
  }
}

console.log(`[optimize-gallery-images] WebP: ${made} üretildi, ${skipped} güncel.`);
