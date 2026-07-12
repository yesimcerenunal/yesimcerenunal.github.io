import type { GalleryHandControlContextValue } from "../components/galleryHandControl";
import { useDevCameraRecording } from "./useDevCameraRecording";

export function DevCameraRecordingBridge({
  hand,
}: {
  hand: GalleryHandControlContextValue;
}) {
  useDevCameraRecording(hand);
  return null;
}
