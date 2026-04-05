import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  LOCALE_STORAGE_KEY,
  defaultLocale,
  isLocale,
  readStoredLocale,
  resolveMessagesForLocale,
  type Locale,
  type TranslationMessages,
} from "../i18n/translations";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (next: Locale) => void;
  messages: TranslationMessages;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const initial = readStoredLocale();
    return isLocale(initial) ? initial : defaultLocale;
  });

  const setLocale = useCallback((next: Locale) => {
    if (!isLocale(next)) {
      return;
    }
    setLocaleState(next);
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!isLocale(locale)) {
      setLocaleState(defaultLocale);
    }
  }, [locale]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = isLocale(locale) ? locale : defaultLocale;
    }
  }, [locale]);

  const value = useMemo<LanguageContextValue>(() => {
    const safeLocale = isLocale(locale) ? locale : defaultLocale;
    return {
      locale: safeLocale,
      setLocale,
      messages: resolveMessagesForLocale(safeLocale),
    };
  }, [locale, setLocale]);

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}
