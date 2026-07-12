import { DEV_CAMERA_RECORDING_ENABLED } from "../config/devFeatures";
import type { GalleryHandControlContextValue } from "../components/galleryHandControl";
import { drawHandOverlayCanvas } from "../utils/drawHandOverlayCanvas";

const RECORD_W = 1920;
const RECORD_H = 1080;
const RECORD_FPS = 30;

type ActiveSession = {
  stop: () => Promise<void>;
};

let activeSession: ActiveSession | null = null;

function pickRecorderMimeType(): string | undefined {
  const candidates = [
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
    "video/webm",
    "video/mp4",
  ];
  return candidates.find((type) => MediaRecorder.isTypeSupported(type));
}

function drawCoverMirroredVideo(
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  w: number,
  h: number,
): void {
  const vw = video.videoWidth || 640;
  const vh = video.videoHeight || 480;
  const scale = Math.max(w / vw, h / vh);
  const dw = vw * scale;
  const dh = vh * scale;
  const dx = (w - dw) / 2;
  const dy = (h - dh) / 2;

  ctx.save();
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, w, h);
  ctx.translate(w, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(video, dx, dy, dw, dh);
  ctx.restore();
}

async function saveRecordingBlob(blob: Blob, baseName: string): Promise<void> {
  const response = await fetch("/__dev/save-recording", {
    method: "POST",
    headers: {
      "Content-Type": "application/octet-stream",
      "X-Recording-Filename": baseName,
    },
    body: blob,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `Save failed (${response.status})`);
  }

  const payload = (await response.json()) as { path?: string; format?: string };
  console.info(
    `[dev-recording] saved to ${payload.path ?? "Recordings/"} (${payload.format ?? "unknown"})`,
  );
}

function formatRecordingBaseName(): string {
  const stamp = new Date()
    .toISOString()
    .replace(/[:.]/g, "-")
    .replace("T", "_")
    .slice(0, 19);
  return `hands-${stamp}`;
}

export async function stopDevCameraRecording(): Promise<void> {
  if (!import.meta.env.DEV || !DEV_CAMERA_RECORDING_ENABLED || !activeSession) return;
  const session = activeSession;
  activeSession = null;
  await session.stop();
}

export function startDevCameraRecording(
  hand: Pick<
    GalleryHandControlContextValue,
    "videoRef" | "cameraStreamRef" | "sampleRef"
  >,
): void {
  if (!import.meta.env.DEV || !DEV_CAMERA_RECORDING_ENABLED || activeSession) return;

  const video = hand.videoRef.current;
  const stream = hand.cameraStreamRef.current;
  if (!video || !stream?.active) return;

  const mimeType = pickRecorderMimeType();
  if (!mimeType) {
    console.warn("[dev-recording] MediaRecorder not supported in this browser");
    return;
  }

  const compositeCanvas = document.createElement("canvas");
  compositeCanvas.width = RECORD_W;
  compositeCanvas.height = RECORD_H;
  const compositeCtx = compositeCanvas.getContext("2d");
  if (!compositeCtx) return;

  const overlayCanvas = document.createElement("canvas");
  overlayCanvas.width = RECORD_W;
  overlayCanvas.height = RECORD_H;
  overlayCanvas.style.width = `${RECORD_W}px`;
  overlayCanvas.style.height = `${RECORD_H}px`;

  const captureStream = compositeCanvas.captureStream(RECORD_FPS);
  const recorder = new MediaRecorder(captureStream, {
    mimeType,
    videoBitsPerSecond: 8_000_000,
  });

  const chunks: Blob[] = [];
  recorder.ondataavailable = (event) => {
    if (event.data.size > 0) chunks.push(event.data);
  };

  const baseName = formatRecordingBaseName();
  let rafId = 0;
  let stopped = false;

  const paintFrame = () => {
    if (stopped) return;
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      drawCoverMirroredVideo(compositeCtx, video, RECORD_W, RECORD_H);
      drawHandOverlayCanvas(overlayCanvas, hand.sampleRef.current.overlayHands);
      compositeCtx.drawImage(overlayCanvas, 0, 0, RECORD_W, RECORD_H);
    }
    rafId = requestAnimationFrame(paintFrame);
  };

  const stop = (): Promise<void> =>
    new Promise((resolveStop) => {
      if (stopped) {
        resolveStop();
        return;
      }
      stopped = true;
      cancelAnimationFrame(rafId);

      if (recorder.state === "inactive") {
        captureStream.getTracks().forEach((track) => track.stop());
        resolveStop();
        return;
      }

      recorder.onstop = () => {
        captureStream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(chunks, { type: mimeType });
        void saveRecordingBlob(blob, baseName).catch((err) => {
          console.error("[dev-recording] upload failed:", err);
        });
        resolveStop();
      };

      recorder.stop();
    });

  activeSession = { stop };
  recorder.start(1000);
  rafId = requestAnimationFrame(paintFrame);
  console.info(`[dev-recording] started (${RECORD_W}x${RECORD_H}, ${mimeType})`);
}
