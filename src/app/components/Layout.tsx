import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import {
  WorksCategoryProvider,
  useWorksCategory,
} from "../context/WorksCategoryContext";
import { LanguageProvider } from "../context/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Navigation } from "./Navigation";
import { FooterNav } from "./FooterNav";

function LayoutShell() {
  const location = useLocation();
  const { resetCategories } = useWorksCategory();

  useEffect(() => {
    if (location.pathname !== "/") resetCategories();
  }, [location.pathname, resetCategories]);

  return (
    <div className="flex h-dvh max-h-dvh min-h-0 overflow-hidden bg-app-shell-bg">
      <Navigation />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="flex shrink-0 items-baseline justify-end gap-5 px-7 pb-1 pt-5 sm:gap-6 sm:px-12 sm:pb-1.5 sm:pt-6 lg:px-14 lg:pt-7">
          <LanguageSwitcher />
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.22em] text-gray-900 sm:text-sm">
            YESIM CEREN ÜNAL
          </p>
        </header>

        <main
          className={`flex min-h-0 flex-1 flex-col px-6 sm:px-10 lg:px-12 ${
            location.pathname === "/"
              ? "overflow-hidden"
              : "overflow-y-auto pb-4"
          }`}
        >
          <Outlet />
        </main>

        <div className="shrink-0">
          <FooterNav />
        </div>
      </div>
    </div>
  );
}

export function Layout() {
  return (
    <LanguageProvider>
      <WorksCategoryProvider>
        <LayoutShell />
      </WorksCategoryProvider>
    </LanguageProvider>
  );
}
