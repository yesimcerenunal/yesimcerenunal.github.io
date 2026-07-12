import { useEffect, useLayoutEffect, useRef } from "react";
import { Link, Outlet, useLocation } from "react-router";
import { LanguageProvider, useLanguage } from "../context/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { FooterNav } from "./FooterNav";
import {
  GalleryDetailCloseButton,
  GalleryDetailCloseProvider,
} from "./galleryDetailClose";
import { HandControlOverlay } from "./HandControlOverlay";
import { ShellHandNavBridge } from "./ShellHandNavBridge";
import { GalleryHandControlProvider, resetGalleryHandControlState, useGalleryHandControl } from "./galleryHandControl";
import { syncDocumentCanonical } from "../config/site";
import { cn } from "./ui/utils";

function GalleryHandEscapeListener() {
  const hand = useGalleryHandControl();

  useEffect(() => {
    if (!hand?.enabled) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      resetGalleryHandControlState(hand);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [hand]);

  return null;
}

function LayoutShell() {
  const location = useLocation();
  const { pathname } = location;
  const { messages, locale } = useLanguage();
  const headerRef = useRef<HTMLElement>(null);
  const pathSegments = pathname.replace(/\/+$/, "").split("/").filter(Boolean);
  const isGalleryDetail =
    pathSegments.length === 2 &&
    pathSegments[0] !== "about" &&
    pathSegments[0] !== "connect" &&
    pathSegments[0] !== "contact";
  const isGallery = pathname === "/" || isGalleryDetail;
  const isAboutOrContact =
    pathname === "/about" ||
    pathname === "/connect" ||
    pathname === "/contact";
  const handControlShell = isGallery || isAboutOrContact;

  useEffect(() => {
    document.title = messages.layout.documentTitle;
  }, [messages.layout.documentTitle]);

  useEffect(() => {
    syncDocumentCanonical(pathname);
  }, [pathname]);

  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const syncHeaderHeight = () => {
      document.documentElement.style.setProperty(
        "--site-header-height",
        `${el.offsetHeight}px`,
      );
    };

    syncHeaderHeight();
    const observer = new ResizeObserver(syncHeaderHeight);
    observer.observe(el);
    return () => observer.disconnect();
  }, [isGalleryDetail]);

  return (
    <div className="flex h-dvh max-h-dvh min-h-0 overflow-hidden bg-background">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header
          ref={headerRef}
          className={cn(
            "flex shrink-0 items-start justify-between gap-5 px-7 pb-1 pt-5 sm:items-baseline sm:gap-6 sm:px-12 sm:pb-1.5 sm:pt-6 lg:px-14 lg:pt-7",
            isGalleryDetail && "relative z-[70] justify-end",
          )}
        >
          <div
            className={cn(
              "flex min-w-0 flex-1 flex-col pr-2",
              isGalleryDetail && "hidden",
            )}
          >
            {/*
              `lang="en"`: root `<html>` stays `lang="en"` for typography; Latin brand stays stable.
            */}
            <Link
              to="/"
              lang="en"
              className="brand-title inline-block text-[calc(1.125rem+1pt)] uppercase leading-none tracking-[0.14em] text-foreground transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground sm:text-[calc(1.5rem+1pt)] sm:leading-normal sm:tracking-[0.22em]"
            >
              {messages.layout.brandName}
            </Link>
            {isGallery ? (
              <p
                className="pointer-events-none mt-1 text-left text-[0.8125rem] font-medium italic leading-snug tracking-[0.1em] text-muted-foreground sm:mt-1.5 sm:whitespace-nowrap sm:text-[0.875rem] sm:tracking-[0.12em]"
                aria-live="polite"
              >
                {messages.gallery.exploreHint}
              </p>
            ) : null}
          </div>
          <div
            className={cn(
              "flex shrink-0 flex-col items-end",
              isGalleryDetail ? "gap-6 sm:gap-7" : "gap-2",
            )}
          >
            <LanguageSwitcher />
            {isGalleryDetail ? <GalleryDetailCloseButton /> : null}
          </div>
        </header>

        <main
          lang={locale}
          className={cn(
            "flex min-h-0 flex-1 flex-col",
            isGallery &&
              "overflow-hidden px-7 sm:px-12 lg:px-14",
            !isGallery &&
              !isAboutOrContact &&
              "overflow-y-auto px-7 pb-4 sm:px-12 lg:px-14",
            isAboutOrContact &&
              "overflow-y-auto px-10 pb-4 pt-8 sm:px-16 sm:pt-10 lg:px-20 lg:pt-12",
          )}
        >
          <Outlet />
        </main>

        <div className="shrink-0">
          <FooterNav />
        </div>
      </div>

      <GalleryHandEscapeListener />
      {handControlShell ? (
        <>
          <ShellHandNavBridge active />
          <HandControlOverlay />
        </>
      ) : null}
    </div>
  );
}

export function Layout() {
  return (
    <LanguageProvider>
      <GalleryHandControlProvider>
        <GalleryDetailCloseProvider>
          <LayoutShell />
        </GalleryDetailCloseProvider>
      </GalleryHandControlProvider>
    </LanguageProvider>
  );
}
