import { useEffect, useRef } from "react";
import { DEV_CAMERA_RECORDING_ENABLED } from "../config/devFeatures";
import type { GalleryHandControlContextValue } from "../components/galleryHandControl";
import {
  startDevCameraRecording,
  stopDevCameraRecording,
} from "./cameraRecording";

/** Dev-only: records mini-cam preview while hands mode is on. */
export function useDevCameraRecording(
  hand: GalleryHandControlContextValue,
): void {
  const recordingStartedRef = useRef(false);

  useEffect(() => {
    if (!import.meta.env.DEV || !DEV_CAMERA_RECORDING_ENABLED) return;

    if (!hand.enabled || !hand.trackingReady || recordingStartedRef.current) {
      return;
    }

    let cancelled = false;
    const video = hand.videoRef.current;

    const tryStart = () => {
      if (cancelled || recordingStartedRef.current) return;
      if (!hand.enabled || !hand.trackingReady) return;
      if (!video || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;

      startDevCameraRecording(hand);
      recordingStartedRef.current = true;
    };

    if (video && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      tryStart();
    } else if (video) {
      video.addEventListener("loadeddata", tryStart, { once: true });
    } else {
      tryStart();
    }

    return () => {
      cancelled = true;
      video?.removeEventListener("loadeddata", tryStart);
    };
  }, [hand, hand.enabled, hand.trackingReady]);

  useEffect(() => {
    if (!import.meta.env.DEV || !DEV_CAMERA_RECORDING_ENABLED) return;

    if (!hand.enabled && recordingStartedRef.current) {
      recordingStartedRef.current = false;
      void stopDevCameraRecording();
    }
  }, [hand.enabled]);

  useEffect(() => {
    if (!import.meta.env.DEV || !DEV_CAMERA_RECORDING_ENABLED) return;

    return () => {
      if (recordingStartedRef.current) {
        recordingStartedRef.current = false;
        void stopDevCameraRecording();
      }
    };
  }, []);
}
