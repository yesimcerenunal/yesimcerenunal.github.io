/**
 * Contact integration (email + Formspree endpoint), not UI copy.
 * User-visible strings live in `src/app/i18n/translations.ts` → `contact`.
 * Copy `.env.example` to `.env` and set values.
 */
export const CONTACT_EMAIL =
  (import.meta.env.VITE_CONTACT_EMAIL as string | undefined)?.trim() ||
  "yesimcerenunal@gmail.com";

/** Full URL, e.g. https://formspree.io/f/abcdefgh, create at https://formspree.io */
export const FORMSPREE_ENDPOINT = (
  import.meta.env.VITE_FORMSPREE_ENDPOINT as string | undefined
)?.trim();

/** Public LinkedIn profile — Connect page icon link. */
export const LINKEDIN_PROFILE_URL = "https://www.linkedin.com/in/yesim-ceren/";
