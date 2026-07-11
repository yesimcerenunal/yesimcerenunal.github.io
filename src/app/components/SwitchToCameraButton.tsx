import { useLanguage } from "../context/LanguageContext";
import {
  toggleGalleryCameraControl,
  useGalleryHandControl,
} from "./galleryHandControl";
import { cn } from "./ui/utils";

const pillBaseClass =
  "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full px-6 py-2.5 text-sm font-medium tracking-wide transition-[background-color,border-color,color,opacity] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98]";

export function SwitchToCameraButton() {
  const { messages } = useLanguage();
  const hand = useGalleryHandControl();

  if (!hand) return null;

  const { enabled } = hand;

  return (
    <button
      type="button"
      onClick={() => toggleGalleryCameraControl(hand)}
      aria-pressed={enabled}
      aria-label={
        enabled
          ? messages.gallery.switchToCameraOff
          : messages.gallery.switchToCamera
      }
      className={cn(
        pillBaseClass,
        "shrink-0 border border-border bg-muted/50 px-5 py-2 sm:px-6 sm:py-2.5",
        enabled
          ? "border-foreground/20 bg-muted text-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      {enabled
        ? messages.gallery.switchToCameraOff
        : messages.gallery.switchToCamera}
    </button>
  );
}
