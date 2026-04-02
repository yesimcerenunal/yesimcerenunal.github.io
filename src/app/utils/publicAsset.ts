/**
 * Resolves paths to files in `/public` so they work with any Vite `base` URL.
 * Pass path without leading slash, e.g. `gallery/motion/foo.jpg`.
 */
export function publicAsset(path: string): string {
  const p = path.startsWith("/") ? path.slice(1) : path;
  const base = import.meta.env.BASE_URL;
  if (!base || base === "/") return `/${p}`;
  const b = base.endsWith("/") ? base.slice(0, -1) : base;
  return `${b}/${p}`;
}
