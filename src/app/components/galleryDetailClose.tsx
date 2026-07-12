import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { X } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { cn } from "./ui/utils";

const detailClosePillClass =
  "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full border border-border bg-muted/50 text-sm font-medium tracking-wide text-muted-foreground transition-[background-color,border-color,color,opacity] duration-200 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98]";

type GalleryDetailCloseContextValue = {
  registerCloseHandler: (handler: (() => void) | null) => void;
  closeDetail: () => void;
};

const GalleryDetailCloseContext =
  createContext<GalleryDetailCloseContextValue | null>(null);

export function GalleryDetailCloseProvider({ children }: { children: ReactNode }) {
  const handlerRef = useRef<(() => void) | null>(null);
  const registerCloseHandler = useCallback((handler: (() => void) | null) => {
    handlerRef.current = handler;
  }, []);
  const closeDetail = useCallback(() => {
    handlerRef.current?.();
  }, []);

  return (
    <GalleryDetailCloseContext.Provider
      value={{ registerCloseHandler, closeDetail }}
    >
      {children}
    </GalleryDetailCloseContext.Provider>
  );
}

export function useRegisterGalleryDetailClose(handler: () => void) {
  const ctx = useContext(GalleryDetailCloseContext);
  useEffect(() => {
    if (!ctx) return;
    ctx.registerCloseHandler(handler);
    return () => ctx.registerCloseHandler(null);
  }, [ctx, handler]);
}

function useGalleryDetailClose() {
  const ctx = useContext(GalleryDetailCloseContext);
  if (!ctx) {
    throw new Error(
      "GalleryDetailCloseButton must be used within GalleryDetailCloseProvider",
    );
  }
  return ctx.closeDetail;
}

export function GalleryDetailCloseButton() {
  const closeDetail = useGalleryDetailClose();
  const { messages } = useLanguage();

  return (
    <button
      type="button"
      onClick={closeDetail}
      className={cn(detailClosePillClass, "h-10 w-10")}
      aria-label={messages.gallery.close}
    >
      <X className="h-[18px] w-[18px] stroke-current" strokeWidth={2} />
    </button>
  );
}
