import {
  Fragment,
  useCallback,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { LOCALES, type Locale } from "../i18n/translations";
import { useLanguage } from "../context/LanguageContext";

const LABELS: Record<Locale, string> = {
  en: "EN",
  de: "DE",
  tr: "TR",
};

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  const onKeyToggle = useCallback(
    (code: Locale, e: ReactKeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setLocale(code);
      }
    },
    [setLocale],
  );

  return (
    <nav
      className="flex items-center gap-x-2 text-[0.65rem] font-medium uppercase tracking-[0.14em] text-gray-900 sm:text-[0.68rem]"
      aria-label="Language"
    >
      {LOCALES.map((code, index) => {
        const active = locale === code;
        return (
          <Fragment key={code}>
            {index > 0 ? (
              <span
                className="select-none text-gray-300/90"
                style={{ opacity: 0.45 }}
                aria-hidden
              >
                /
              </span>
            ) : null}
            <span
              role="button"
              tabIndex={0}
              onClick={() => setLocale(code)}
              onKeyDown={(e) => onKeyToggle(code, e)}
              className={`relative cursor-pointer select-none outline-none transition-[opacity,color] duration-200 ease-out focus-visible:ring-1 focus-visible:ring-gray-900/20 focus-visible:ring-offset-2 ${
                active
                  ? "font-bold text-gray-900 opacity-100"
                  : "font-medium text-gray-500 opacity-[0.5] hover:text-gray-700 hover:opacity-[0.72]"
              } `}
            >
              <span
                className={
                  active
                    ? "after:absolute after:left-0 after:right-0 after:top-full after:mt-0.5 after:h-px after:rounded-full after:bg-gray-900/40 after:content-['']"
                    : undefined
                }
              >
                {LABELS[code]}
              </span>
            </span>
          </Fragment>
        );
      })}
    </nav>
  );
}
