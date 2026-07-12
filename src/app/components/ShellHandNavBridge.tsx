import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router";
import { useGalleryHandControl } from "./galleryHandControl";
import {
  playGalleryClickSound,
  primeGalleryAudioEngineFromUserGesture,
} from "../utils/galleryHoverSfx";
import {
  findHandNavTarget,
  HAND_NAV_COOLDOWN_MS,
  HAND_NAV_DWELL_MS,
  isHandPinching,
} from "../utils/handFooterNav";

type ShellHandNavBridgeProps = {
  active: boolean;
};

/** Alt menü: ☝️ ile nişan al + uzun bekle → sayfa değişir (🤏 pinch değil). */
export function ShellHandNavBridge({ active }: ShellHandNavBridgeProps) {
  const hand = useGalleryHandControl();
  const navigate = useNavigate();
  const location = useLocation();

  const cursorRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const lastNavAtRef = useRef(0);
  const dwellTargetRef = useRef<HTMLElement | null>(null);
  const dwellStartRef = useRef(0);
  const pathRef = useRef(location.pathname);
  pathRef.current = location.pathname;

  useEffect(() => {
    if (!hand?.enabled || !active) return;

    let raf = 0;

    const hideOverlay = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = "0";
      if (ringRef.current) ringRef.current.style.opacity = "0";
      if (progressRef.current) progressRef.current.style.width = "0%";
      dwellTargetRef.current = null;
      dwellStartRef.current = 0;
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);

      const s = hand.sampleRef.current;
      const x = s.pointerX * window.innerWidth;
      const y = s.pointerY * window.innerHeight;
      const canEngage =
        hand.enabled &&
        active &&
        !hand.detailModalOpen &&
        s.pointerActive &&
        !isHandPinching(s);

      const target = canEngage ? findHandNavTarget(x, y) : null;
      const engaged = target != null;

      if (!engaged) {
        hideOverlay();
        return;
      }

      const cursor = cursorRef.current;
      if (cursor) {
        cursor.style.opacity = "1";
        cursor.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      }

      const ring = ringRef.current;
      const progress = progressRef.current;
      if (ring && target) {
        const r = target.getBoundingClientRect();
        ring.style.opacity = "1";
        ring.style.left = `${r.left - 12}px`;
        ring.style.top = `${r.top - 7}px`;
        ring.style.width = `${r.width + 24}px`;
        ring.style.height = `${r.height + 14}px`;
      }

      const now = performance.now();
      if (target !== dwellTargetRef.current) {
        dwellTargetRef.current = target;
        dwellStartRef.current = now;
      }

      const dwellMs = now - dwellStartRef.current;
      const dwellRatio = Math.min(1, dwellMs / HAND_NAV_DWELL_MS);
      if (progress) {
        progress.style.width = `${dwellRatio * 100}%`;
      }

      if (
        dwellRatio >= 1 &&
        now - lastNavAtRef.current > HAND_NAV_COOLDOWN_MS
      ) {
        const navPath = target.getAttribute("data-hand-nav");
        if (navPath && navPath !== pathRef.current) {
          lastNavAtRef.current = now;
          dwellTargetRef.current = null;
          dwellStartRef.current = 0;
          primeGalleryAudioEngineFromUserGesture();
          playGalleryClickSound();
          hand.setHintOpen(false);
          navigate(navPath);
        }
      }
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      hideOverlay();
    };
  }, [active, hand, navigate]);

  if (!hand?.enabled || !active) return null;

  return createPortal(
    <>
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[99997] overflow-hidden rounded-full border-2 border-[#007FFF] bg-[#007FFF]/10 opacity-0 transition-opacity duration-150"
        aria-hidden
      >
        <div
          ref={progressRef}
          className="absolute bottom-0 left-0 h-1 bg-[#007FFF]/80 transition-[width] duration-75 ease-linear"
          style={{ width: "0%" }}
        />
      </div>
      <div
        ref={cursorRef}
        className="pointer-events-none fixed left-0 top-0 z-[99998] opacity-0"
        aria-hidden
      >
        <span className="block h-4 w-4 rounded-full border-2 border-[#007FFF] bg-white/90 shadow-[0_0_8px_rgba(0,127,255,0.6)]" />
      </div>
    </>,
    document.body,
  );
}
