import type { GalleryCategory } from "../context/WorksCategoryContext";
import portfolioContentEn from "../data/portfolio-content-en.json";
import portfolioContentDe from "../data/portfolio-content-de.json";
import portfolioContentTr from "../data/portfolio-content-tr.json";
import { slugFromProjectKey } from "../utils/galleryProjectKey";

/**
 * **Single source of truth for all user-visible UI strings** (nav, layout, gallery chrome,
 * About/Contact, aria labels, locale switcher labels).
 * Portfolio project copy (EN / DE / TR): `portfolio-content-en.json`, `portfolio-content-de.json`, `portfolio-content-tr.json`.
 * English UI uses `en` below; project titles/descriptions for locale `en` come **only** from `portfolio-content-en.json` (`portfolioEn`).
 * Project list and file paths come from `gallery-manifest.json` + `public/` (see `galleryData.ts`).
 */
export type Locale = "en" | "de" | "tr";

/**
 * Header language switcher: fixed order and labels (never passed through UI translation).
 * Single tuple avoids lookup bugs; use {@link LOCALES} for locale codes only.
 */
export const LOCALE_SWITCHER_ENTRIES: readonly {
  code: Locale;
  label: string;
}[] = [
  { code: "en", label: "EN" },
  { code: "de", label: "DE" },
  { code: "tr", label: "TR" },
];

/** Display and persistence order: EN → DE → TR */
export const LOCALES: Locale[] = LOCALE_SWITCHER_ENTRIES.map((e) => e.code);

/**
 * Short codes for the language switcher only — always EN / DE / TR (never localized),
 * so the three options stay unambiguous regardless of the active UI language.
 */
export const LOCALE_DISPLAY_LABELS: Record<Locale, string> =
  LOCALE_SWITCHER_ENTRIES.reduce(
    (acc, e) => {
      acc[e.code] = e.label;
      return acc;
    },
    {} as Record<Locale, string>,
  );

export const defaultLocale: Locale = "en";

/** Current persisted locale (v2). */
export const LOCALE_STORAGE_KEY = "portfolio-locale-v2";

/** Legacy key — removed when persisting locale from the language switcher. */
export const LEGACY_LOCALE_STORAGE_KEY = "portfolio-locale";

export type CategoryMessages = { all: string } & Record<GalleryCategory, string>;

/** Keys: `categoryFolder/slug` (see gallery-manifest.json). */
export type PortfolioProjectCopy = {
  title: string;
  description: string;
  year: string;
  /** Comma-separated or free-text tool names (e.g. "Adobe", "Blender, Unity"). */
  tools: string;
  /**
   * Gallery nav / modal tag — canonical English labels only (`GALLERY_CATEGORIES`).
   * Set in **`portfolio-content-en.json`**; overrides `gallery-manifest.json` `category` when present.
   */
  category?: string;
};

export type TranslationMessages = {
  /** Shell: document title, header brand, optional non-route UI. */
  layout: {
    documentTitle: string;
    brandName: string;
    gestureControlOff: string;
  };
  /** Accessibility labels (not visible copy). */
  aria: {
    primaryNavigation: string;
    workCategoriesNavigation: string;
    languageSwitcher: string;
  };
  nav: {
    gallery: string;
    about: string;
    contact: string;
  };
  sidebar: {
    portfolio: string;
    taglineWorks: string;
    taglineOther: string;
  };
  categories: CategoryMessages;
  gallery: {
    exploreHint: string;
    modalYear: string;
    /** Label above the tools line in the project detail modal (shown with a trailing colon in UI). */
    modalToolsLabel: string;
    /** Title when no `portfolio.projects[projectKey]` entry exists (never show raw `projectKey`). */
    modalProjectFallback: string;
    /** Year line when entry is missing or `year` is empty in copy (never use manifest). */
    modalYearFallback: string;
    backToGallery: string;
    /** work/2 detail: ArtStation icon next to back (opens in new tab). */
    artStationAlbumAriaLabel: string;
    close: string;
    /** Alt text when an image fails to load (fallback UI). */
    imageErrorAlt: string;
  };
  about: {
    lead: string;
    p2: string;
    p3: string;
    p4: string;
  };
  contact: {
    headline: string;
    description: string;
    emailCta: string;
    /** Between mailto CTA and address: "or" / "oder" / "veya". */
    emailInlineOr: string;
    copyEmail: string;
    emailCopiedFeedback: string;
    rolesLine: string;
    nameLabel: string;
    emailLabel: string;
    messageLabel: string;
    placeholderName: string;
    placeholderEmail: string;
    placeholderMessage: string;
    send: string;
    formSubject: string;
    noFormNote: string;
  };
  portfolio: {
    projects: Record<string, PortfolioProjectCopy>;
  };
};

/** Keys = `categoryFolder/slug` (see gallery-manifest). Same keys in all three JSON files. */
function normalizePortfolioContentJson(
  raw: unknown,
): Record<string, PortfolioProjectCopy> {
  if (typeof raw !== "object" || raw === null) return {};
  const out: Record<string, PortfolioProjectCopy> = {};
  for (const [key, v] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof v !== "object" || v === null) {
      out[key] = {
        title: "",
        description: "",
        year: "",
        tools: "",
      };
      continue;
    }
    const o = v as Record<string, unknown>;
    const category =
      typeof o.category === "string" && o.category.trim() !== ""
        ? o.category.trim()
        : undefined;
    out[key] = {
      title: typeof o.title === "string" ? o.title : "",
      description: typeof o.description === "string" ? o.description : "",
      year: typeof o.year === "string" ? o.year : "",
      tools: typeof o.tools === "string" ? o.tools : "",
      ...(category !== undefined ? { category } : {}),
    };
  }
  return out;
}

const portfolioEn = normalizePortfolioContentJson(portfolioContentEn);
const portfolioDe = normalizePortfolioContentJson(portfolioContentDe);
const portfolioTr = normalizePortfolioContentJson(portfolioContentTr);

const categoryEn: Record<GalleryCategory, string> = {
  "Interactive / VR": "Interactive / VR",
  Motion: "Motion",
  "3D Archive": "3D Archive",
  "2D Archive": "2D Archive",
  New: "New",
};

const en: TranslationMessages = {
  layout: {
    documentTitle: "YESIM CEREN ÜNAL Portfolio",
    brandName: "YESIM CEREN ÜNAL",
    gestureControlOff: "Turn off gesture control",
  },
  aria: {
    primaryNavigation: "Primary",
    workCategoriesNavigation: "Work categories",
    languageSwitcher: "Language",
  },
  nav: {
    gallery: "GALLERY",
    about: "ABOUT ME",
    contact: "CONNECT",
  },
  sidebar: {
    portfolio: "PORTFOLIO",
    taglineWorks:
      "A creative playground for art, code, and interactive experience.",
    taglineOther:
      "A creative technologist focused on interactive design and real-time experiences.",
  },
  categories: {
    all: "All",
    ...categoryEn,
  },
  gallery: {
    exploreHint: "Drag, scroll.. You're in control!",
    modalYear: "Year",
    modalToolsLabel: "Tools",
    modalProjectFallback: "Project",
    modalYearFallback: "—",
    backToGallery: "Back to gallery",
    artStationAlbumAriaLabel: "ArtStation album (opens in new tab)",
    close: "Close",
    imageErrorAlt: "Error loading image",
  },
  about: {
    lead:
      "I'm a multidisciplinary designer working across 3D, motion, and interaction. I'm curious by nature, I enjoy learning, and I try to constantly improve everything rather than leaving things as they are.",
    p2:
      "It all started with graphic design. Designs were supposed to stay static, but that didn't last long. I'm drawn to motion and interaction, so over time my work evolved into responsive, immersive experiences that pull people in.",
    p3:
      "By combining my background in graphic design with a master's degree in 3D animation, I was able to refine my production methods and expand the way I work with tools. Today, I focus on how rhythm, movement, and interaction shape digital experiences, and I'm shifting away from static outputs toward evolving systems. Recently, I've been exploring AI as a rendering engine, using it as a medium to shape and materialize ideas.",
    p4:
      "Recently, my focus has been on building my portfolio website, programming NFC chips, and creating experiences that feel alive. I'm still exploring, still experimenting, and still making mistakes.",
  },
  contact: {
    headline:
      "Did you hear my heartbeat while viewing my artworks?\n\nIf so, let's connect now! Email is the quickest way to get in touch.",
    description: "",
    emailCta: "Email Me",
    emailInlineOr: "or",
    copyEmail: "Copy",
    emailCopiedFeedback: "Copied!",
    rolesLine: "",
    nameLabel: "Name",
    emailLabel: "Email",
    messageLabel: "Message",
    placeholderName: "Your name",
    placeholderEmail: "you@example.com",
    placeholderMessage: "Tell me about your project or role…",
    send: "Send message",
    formSubject: "Portfolio contact",
    noFormNote: "",
  },
  portfolio: {
    projects: portfolioEn,
  },
};

const de: TranslationMessages = {
  layout: {
    documentTitle: "YESIM CEREN ÜNAL Portfolio",
    brandName: "YESIM CEREN ÜNAL",
    gestureControlOff: "Gestensteuerung ausschalten",
  },
  aria: {
    primaryNavigation: "Hauptnavigation",
    workCategoriesNavigation: "Werkkategorien",
    languageSwitcher: "Sprache",
  },
  nav: {
    gallery: "GALERIE",
    about: "ÜBER MICH",
    contact: "VERNETZEN",
  },
  sidebar: {
    portfolio: "PORTFOLIO",
    taglineWorks:
      "Ein kreativer Spielraum für neue Tools, KI-gestützte Workflows und präzisen visuellen Craft.",
    taglineOther:
      "Multidisziplinäres Design und Creative Technology.",
  },
  categories: {
    all: "Alle",
    "Interactive / VR": "Interaktiv / VR",
    Motion: "BEWEGTBILD",
    "3D Archive": "3D-Archiv",
    "2D Archive": "2D-Archiv",
    New: "Neu",
  },
  gallery: {
    exploreHint: "Scrollen, ziehen… deine Kontrolle, einfach volle!",
    modalYear: "Jahr",
    modalToolsLabel: "Tools",
    modalProjectFallback: "Projekt",
    modalYearFallback: "—",
    backToGallery: "Zurück zur Galerie",
    artStationAlbumAriaLabel: "ArtStation-Album (öffnet in neuem Tab)",
    close: "Schließen",
    imageErrorAlt: "Bild konnte nicht geladen werden",
  },
  about: {
    lead:
      "Ich bin ein multidisziplinärer Designer, der in den Bereichen 3D, Motion und Interaktion arbeitet. Ich bin von Natur aus neugierig, lerne gerne und versuche, alles kontinuierlich zu verbessern, anstatt Dinge so zu lassen, wie sie sind.",
    p2:
      "Alles begann mit Grafikdesign. Eigentlich sollten Designs statisch bleiben, aber das hielt nicht lange. Ich fühle mich zu Bewegung und Interaktion hingezogen, sodass sich meine Arbeit mit der Zeit zu responsiven, immersiven Erlebnissen entwickelt hat, die Menschen in sich hineinziehen.",
    p3:
      "Durch die Kombination meines Hintergrunds im Grafikdesign mit einem Master in 3D-Animation konnte ich meine Produktionsmethoden verfeinern und meinen Umgang mit Tools erweitern. Heute beschäftige ich mich vor allem damit, wie Rhythmus, Bewegung und Interaktion digitale Erlebnisse prägen, und entferne mich zunehmend von statischen Ergebnissen hin zu sich entwickelnden Systemen. Kürzlich erkunde ich Künstliche Intelligenz als Rendering-Engine und nutze sie als Medium, um Ideen zu gestalten und zu materialisieren.",
    p4:
      "In letzter Zeit liegt mein Fokus darauf, meine Portfolio-Website zu bauen, NFC-Chips zu programmieren und Erlebnisse zu schaffen, die sich lebendig anfühlen. Ich bin immer noch am Entdecken, am Ausprobieren und mache immer noch Fehler.",
  },
  contact: {
    headline:
      "Haben Sie meinen Herzschlag gehört, während Sie meine Arbeiten angesehen haben?\n\nWenn ja, lassen Sie uns jetzt in Kontakt treten! E-Mail ist der schnellste Weg, mich zu erreichen.",
    description: "",
    emailCta: "E-Mail schreiben",
    emailInlineOr: "oder",
    copyEmail: "Kopieren",
    emailCopiedFeedback: "Kopiert!",
    rolesLine: "",
    nameLabel: "Name",
    emailLabel: "E-Mail",
    messageLabel: "Nachricht",
    placeholderName: "Ihr Name",
    placeholderEmail: "sie@beispiel.de",
    placeholderMessage: "Erzählen Sie von Ihrem Projekt oder der Rolle…",
    send: "Nachricht senden",
    formSubject: "Portfolio Kontakt",
    noFormNote: "",
  },
  portfolio: {
    projects: portfolioDe,
  },
};

const tr: TranslationMessages = {
  layout: {
    documentTitle: "YESIM CEREN ÜNAL Portfolio",
    brandName: "YESIM CEREN ÜNAL",
    gestureControlOff: "Jest kontrolünü kapat",
  },
  aria: {
    primaryNavigation: "Birincil gezinme",
    workCategoriesNavigation: "Çalışma kategorileri",
    languageSwitcher: "Dil",
  },
  nav: {
    gallery: "GALERİ",
    about: "HAKKIMDA",
    contact: "İLETİŞİM",
  },
  sidebar: {
    portfolio: "PORTFOLYO",
    taglineWorks:
      "Yeni araçlar, yapay zekâ destekli iş akışları ve rafine görsel ustalık için yaratıcı bir oyun alanı.",
    taglineOther:
      "Disiplinlerarası tasarım ve yaratıcı teknoloji.",
  },
  categories: {
    all: "Tümü",
    "Interactive / VR": "Etkileşimli / VR",
    Motion: "Hareket",
    "3D Archive": "3D arşiv",
    "2D Archive": "2D arşiv",
    New: "Yeni",
  },
  gallery: {
    exploreHint: "Kaydır, sürükle.. kontrol sende!",
    modalYear: "Yıl",
    modalToolsLabel: "Araçlar",
    modalProjectFallback: "Proje",
    modalYearFallback: "—",
    backToGallery: "Galeriye dön",
    artStationAlbumAriaLabel: "ArtStation albümü (yeni sekmede açılır)",
    close: "Kapat",
    imageErrorAlt: "Görüntü yüklenemedi",
  },
  about: {
    lead:
      "3D, motion ve etkileşim alanlarında çalışan multidisipliner bir tasarımcıyım. Meraklıyım, öğrenmeyi ve geliştirmeyi seviyorum.",
    p2:
      "Her şey grafik tasarımla başladı. Tasarımların statik kalması gerekiyordu ama bu uzun sürmedi. Çünkü hareketi ve etkileşimi seviyorum; işlerim zamanla tepki veren ve insanları içine çeken deneyimlere dönüştü.",
    p3:
      "Grafik tasarım geçmişimi 3D animasyon alanındaki yüksek lisansımla birleştirerek üretim yöntemlerimi rafine ettim ve daha farklı araçlarla çalışmaya başladım. Bugün ritmin, hareketin ve etkileşimin dijital deneyimleri nasıl şekillendirdiğine odaklanıyorum; sabit çıktılardan uzaklaşıp evrilen sistemlere yöneliyorum.",
    p4:
      "Son zamanlarda yapay zekâyı kodlama ile destekleyerek fikirlerimi somutlaştırmak için kullanıyorum. Portfolio websitemi geliştirmek, NFC çipi programlamak ve yaşayan gibi hissettiren deneyimler üretmeye çalışıyorum. Hâlâ keşfediyorum, hâlâ deniyorum ve yanılıyorum.",
  },
  contact: {
    headline:
      "Çalışmalarımı incelerken kalp atışlarımı duydunuz mu?\n\nEğer öyleyse, hadi iletişime geçelim! Bana ulaşmanın en hızlı yolu şimdilik e-posta.",
    description: "",
    emailCta: "E-posta gönder",
    emailInlineOr: "veya",
    copyEmail: "Kopyala",
    emailCopiedFeedback: "Kopyalandı!",
    rolesLine: "",
    nameLabel: "Ad",
    emailLabel: "E-posta",
    messageLabel: "Mesaj",
    placeholderName: "Adınız",
    placeholderEmail: "ornek@e-posta.com",
    placeholderMessage: "Projeniz veya rol hakkında yazın…",
    send: "Mesaj gönder",
    formSubject: "Portfolyo iletişim",
    noFormNote: "",
  },
  portfolio: {
    projects: portfolioTr,
  },
};

export const translations: Record<Locale, TranslationMessages> = {
  en,
  de,
  tr,
};

/** Safe lookup for bootstrap / runtime; invalid or missing locale → English. */
export function resolveMessagesForLocale(
  locale: string | undefined | null,
): TranslationMessages {
  const loc = isLocale(locale) ? locale : defaultLocale;
  const msgs = translations[loc] ?? translations[defaultLocale];
  return msgs;
}

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "en" || value === "de" || value === "tr";
}

/** Resolve canonical English category from data to localized label */
export function localizedCategory(
  messages: TranslationMessages,
  canonical: string,
): string {
  const v = messages.categories?.[canonical as GalleryCategory];
  return v !== undefined ? v : canonical;
}

/**
 * Resolves portfolio copy for the current locale.
 * Lookup is a plain object get: `messages.portfolio.projects[projectKey]` — must match
 * `projectKeyFromManifestEntry` / `gallery-manifest.json` keys (see `galleryProjectKey.ts`).
 */
/** Strip EN draft marker (` … --` at end of title) so modals never show the raw suffix. */
function stripPortfolioTitleDraftSuffix(title: string): string {
  return title.replace(/\s*--\s*$/, "").trim();
}

export function portfolioProjectCopy(
  messages: TranslationMessages,
  projectKey: string,
): PortfolioProjectCopy {
  const slug = slugFromProjectKey(projectKey);
  const yearDash = messages.gallery?.modalYearFallback ?? "—";

  const p = messages.portfolio?.projects?.[projectKey];
  if (p) {
    const rawTitle = p.title?.trim() ?? "";
    const title = stripPortfolioTitleDraftSuffix(rawTitle);
    const year = String(p.year ?? "").trim();
    const titleOut = title || slug;
    const yearOut = year || yearDash;
    if (import.meta.env?.DEV) {
      if (!title && !rawTitle) {
        console.warn(
          `[portfolio] Empty title — using slug fallback | projectKey=${JSON.stringify(projectKey)} | slug=${JSON.stringify(slug)}`,
        );
      }
      if (!year) {
        console.warn(
          `[portfolio] Empty year — using "—" | projectKey=${JSON.stringify(projectKey)}`,
        );
      }
    }
    return {
      title: titleOut,
      description: p.description ?? "",
      year: yearOut,
      tools: (p.tools ?? "").trim(),
    };
  }
  if (import.meta.env?.DEV) {
    const available = Object.keys(messages.portfolio?.projects ?? {});
    console.error(
      `[portfolio] PROJECT KEY MISMATCH: expected=${JSON.stringify(projectKey)} (portfolio.projects lookup) | actual=missing — no entry for this key.`,
    );
    console.error(
      "[portfolio] translation keys (sample):",
      available.slice(0, 8),
      "| total:",
      available.length,
    );
    for (const candidate of available) {
      if (candidate.length !== projectKey.length) continue;
      if (candidate === projectKey) continue;
      const diff: number[] = [];
      for (let i = 0; i < projectKey.length; i++) {
        if (candidate.charCodeAt(i) !== projectKey.charCodeAt(i)) {
          diff.push(i);
        }
      }
      if (diff.length <= 4 && diff.length > 0) {
        console.error("[portfolio] Similar key (char diff at indices):", {
          candidate,
          projectKey,
          indices: diff,
        });
      }
    }
  }
  return {
    title: slug,
    description: "",
    year: yearDash,
    tools: "",
  };
}

/** Explicit locale + key lookup (same data as `portfolioProjectCopy(translations[locale], projectKey)`). */
export function getPortfolioProjectCopy(
  locale: Locale,
  projectKey: string,
): PortfolioProjectCopy {
  return portfolioProjectCopy(resolveMessagesForLocale(locale), projectKey);
}
