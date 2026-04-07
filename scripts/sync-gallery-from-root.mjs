/**
 * `gallery/` (kök) ve `public/gallery/` arasında güvenli eşleme — Vite `public/` sunar.
 *
 * ÖNEMLİ (önceki hatalı davranış düzeltildi):
 * - **Hiçbir medya dosyası silinmez.**
 * - Sadece bir tarafta varsa diğer tarafa kopyalanır (yedek).
 * - İkisinde de var ama içerik farklıysa **daha yeni değiştirilme zamanı (mtime)** kazanır.
 * - mtime aynı ama içerik farklıysa **`public/` sürümü** tercih edilir (tarayıcıda test edilen dosya).
 *
 * Kullanım: npm run gallery:sync
 *
 * Kayıp dosyalar: Bu script geri getirmez. Git / Time Machine / yedek varsa oradan kurtarın.
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const manifestPath = path.join(root, "src/app/data/gallery-manifest.json");

function listFiles(absDir) {
  if (!fs.existsSync(absDir)) return [];
  return fs.readdirSync(absDir).filter((f) => {
    if (f.startsWith(".") || f === "README.md" || f === ".DS_Store") return false;
    return fs.statSync(path.join(absDir, f)).isFile();
  });
}

function naturalSort(files) {
  const c = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });
  return [...files].sort(c.compare);
}

function hashFile(p) {
  const h = crypto.createHash("md5");
  h.update(fs.readFileSync(p));
  return h.digest("hex");
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const actions = [];

for (const proj of manifest.projects) {
  const rel = path.join("gallery", proj.categoryFolder, proj.slug);
  const srcDir = path.join(root, rel);
  const dstDir = path.join(root, "public", rel);

  const rootExists = fs.existsSync(srcDir) && fs.statSync(srcDir).isDirectory();
  const pubExists = fs.existsSync(dstDir) && fs.statSync(dstDir).isDirectory();

  if (!rootExists && !pubExists) {
    console.error("Eksik klasör (kök ve public yok):", rel);
    process.exitCode = 1;
    continue;
  }

  if (!rootExists && pubExists) {
    fs.mkdirSync(srcDir, { recursive: true });
    for (const f of listFiles(dstDir)) {
      fs.copyFileSync(path.join(dstDir, f), path.join(srcDir, f));
      actions.push(`kök gallery oluşturuldu ← public: ${rel}/${f}`);
    }
  }

  if (rootExists && !pubExists) {
    fs.mkdirSync(dstDir, { recursive: true });
    for (const f of listFiles(srcDir)) {
      fs.copyFileSync(path.join(srcDir, f), path.join(dstDir, f));
      actions.push(`public ← kök (klasör yeni): ${rel}/${f}`);
    }
  }

  const names = new Set([...listFiles(srcDir), ...listFiles(dstDir)]);

  for (const f of names) {
    const rPath = path.join(srcDir, f);
    const pPath = path.join(dstDir, f);
    const rOk = fs.existsSync(rPath);
    const pOk = fs.existsSync(pPath);

    if (rOk && !pOk) {
      fs.mkdirSync(dstDir, { recursive: true });
      fs.copyFileSync(rPath, pPath);
      actions.push(`public ← kök: ${rel}/${f}`);
      continue;
    }
    if (pOk && !rOk) {
      fs.mkdirSync(srcDir, { recursive: true });
      fs.copyFileSync(pPath, rPath);
      actions.push(`kök gallery ← public: ${rel}/${f}`);
      continue;
    }

    if (hashFile(rPath) === hashFile(pPath)) continue;

    const tr = fs.statSync(rPath).mtimeMs;
    const tp = fs.statSync(pPath).mtimeMs;
    const skewMs = 500;

    if (tr > tp + skewMs) {
      fs.copyFileSync(rPath, pPath);
      actions.push(`public ← kök (daha yeni): ${rel}/${f}`);
    } else if (tp > tr + skewMs) {
      fs.copyFileSync(pPath, rPath);
      actions.push(`kök ← public (daha yeni): ${rel}/${f}`);
    } else {
      fs.copyFileSync(pPath, rPath);
      actions.push(`kök ← public (eşit tarih, içerik farkı → public): ${rel}/${f}`);
    }
  }

  const finalList = naturalSort(
    [...new Set([...listFiles(srcDir), ...listFiles(dstDir)])],
  );
  const prefix = `gallery/${proj.categoryFolder}/${proj.slug}/`;
  proj.images = finalList.map((file) => `${prefix}${file}`.replace(/\\/g, "/"));
}

manifest.lastUpdated = new Date().toISOString();
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

if (actions.length) {
  console.log(actions.join("\n"));
} else {
  console.log("Kök ve public gallery zaten aynı içerik (özet).");
}
console.log("gallery-manifest.json güncellendi:", manifest.lastUpdated);

const galleryRoot = path.join(root, "gallery");
const knownProjects = new Set(
  manifest.projects.map((p) => `${p.categoryFolder}/${p.slug}`),
);
if (fs.existsSync(galleryRoot)) {
  for (const cat of fs.readdirSync(galleryRoot)) {
    if (cat.startsWith(".") || cat === "README.md") continue;
    const catPath = path.join(galleryRoot, cat);
    if (!fs.statSync(catPath).isDirectory()) continue;
    for (const slug of fs.readdirSync(catPath)) {
      if (slug.startsWith(".")) continue;
      const slugPath = path.join(catPath, slug);
      if (!fs.statSync(slugPath).isDirectory()) continue;
      const key = `${cat}/${slug}`;
      if (!knownProjects.has(key)) {
        console.warn(
          `[gallery:sync] "${key}" manifest’te yok → sitede görünmez; gallery-manifest.json’a proje ekleyin.`,
        );
      }
    }
  }
}
