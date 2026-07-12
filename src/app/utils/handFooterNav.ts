import type { GalleryHandSample } from "../components/galleryHandControl";

/** ☝️ must rest on a footer link this long before the page changes. */
export const HAND_NAV_DWELL_MS = 2000;
export const HAND_NAV_COOLDOWN_MS = 700;
const HAND_NAV_HIT_PAD_PX = 14;

export function findHandNavTarget(
  screenX: number,
  screenY: number,
): HTMLElement | null {
  const links = document.querySelectorAll<HTMLElement>("[data-hand-nav]");
  for (const el of links) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    if (
      screenX >= r.left - HAND_NAV_HIT_PAD_PX &&
      screenX <= r.right + HAND_NAV_HIT_PAD_PX &&
      screenY >= r.top - HAND_NAV_HIT_PAD_PX &&
      screenY <= r.bottom + HAND_NAV_HIT_PAD_PX
    ) {
      return el;
    }
  }
  return null;
}

export function isHandPinching(sample: GalleryHandSample): boolean {
  return (
    sample.userRight.gesture === "pinch" || sample.userLeft.gesture === "pinch"
  );
}

/** Footer page nav: ☝️ over a menu label, not 🤏 pinch. */
export function isHandFooterNavEngaged(sample: GalleryHandSample): boolean {
  if (!sample.pointerActive || isHandPinching(sample)) return false;
  const x = sample.pointerX * window.innerWidth;
  const y = sample.pointerY * window.innerHeight;
  return findHandNavTarget(x, y) != null;
}
