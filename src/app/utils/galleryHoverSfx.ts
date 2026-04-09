/**
 * Soft hover cue for gallery “planet” cards (Web Audio — requires a user gesture first).
 * Kept minimal so it works without asset files.
 */
let sharedCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctx) return null;
    if (!sharedCtx || sharedCtx.state === "closed") {
      sharedCtx = new Ctx();
    }
    return sharedCtx;
  } catch {
    return null;
  }
}

/** Short airy chime when pointer enters a card (once per hover). */
export function playGalleryHoverChime(): void {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    if (ctx.state === "suspended") {
      void ctx.resume();
    }
    const t0 = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.value = 0.11;
    master.connect(ctx.destination);

    const freqs = [587.33, 783.99];
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t0 + i * 0.028);
      g.gain.setValueAtTime(0.0001, t0 + i * 0.028);
      g.gain.exponentialRampToValueAtTime(0.055, t0 + i * 0.028 + 0.018);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.22);
      osc.connect(g);
      g.connect(master);
      osc.start(t0 + i * 0.028);
      osc.stop(t0 + 0.28);
    });
  } catch {
    /* ignore */
  }
}
