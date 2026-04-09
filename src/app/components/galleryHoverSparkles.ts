import * as THREE from "three";

/** Daha geride çizilir (sun-ray’in arkası). */
export const GALLERY_SPARKLE_LAYER_Z = -0.042;
export const GALLERY_SPARKLE_RENDER_ORDER = -4;

const SPARKLE_COUNT = 440;

let spriteMap: THREE.Texture | null = null;

/** Yumuşak daire sprite — additive noktalar için (tek sefer oluşturulur). */
export function getGallerySparkleSpriteMap(): THREE.Texture {
  if (spriteMap) return spriteMap;
  if (typeof document === "undefined") {
    const data = new Uint8Array([255, 255, 255, 255]);
    spriteMap = new THREE.DataTexture(data, 1, 1);
    spriteMap.needsUpdate = true;
    return spriteMap;
  }
  const s = 64;
  const c = document.createElement("canvas");
  c.width = s;
  c.height = s;
  const ctx = c.getContext("2d");
  if (!ctx) {
    const data = new Uint8Array([255, 255, 255, 255]);
    spriteMap = new THREE.DataTexture(data, 1, 1);
    spriteMap.needsUpdate = true;
    return spriteMap;
  }
  const g = ctx.createRadialGradient(s * 0.5, s * 0.5, 0, s * 0.5, s * 0.5, s * 0.5);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.4)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  spriteMap = new THREE.CanvasTexture(c);
  spriteMap.colorSpace = THREE.SRGBColorSpace;
  spriteMap.needsUpdate = true;
  return spriteMap;
}

/**
 * Gezegen kenarı ile sun karesi arasında halka bölgede rastgele noktalar (XY düzlemi).
 */
export function buildGalleryHoverSparkleGeometry(
  cardW: number,
  planeSideMult: number,
): THREE.BufferGeometry {
  const inner = cardW * 0.5 * 1.04;
  const outer = cardW * planeSideMult * 0.5 * 0.92;
  const pos = new Float32Array(SPARKLE_COUNT * 3);
  for (let i = 0; i < SPARKLE_COUNT; i++) {
    const theta = Math.random() * Math.PI * 2;
    const u = Math.random();
    const r = Math.sqrt(inner * inner + u * (outer * outer - inner * inner));
    pos[i * 3] = r * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.sin(theta);
    pos[i * 3 + 2] = (Math.random() - 0.5) * 0.006;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  return geo;
}
