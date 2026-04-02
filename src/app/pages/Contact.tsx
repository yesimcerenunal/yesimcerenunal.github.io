import { motion } from "motion/react";
import { useLanguage } from "../context/LanguageContext";
import {
  CONTACT_EMAIL,
  FORMSPREE_ENDPOINT,
} from "../config/contact";

const fieldClass =
  "mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition-[box-shadow,border-color] placeholder:text-gray-400 focus:border-gray-300 focus:ring-2 focus:ring-gray-900/5";

const labelClass = "block text-[0.8rem] font-medium text-gray-700";

export function Contact() {
  const { messages } = useLanguage();
  const c = messages.contact;
  const mailtoHref = `mailto:${encodeURIComponent(CONTACT_EMAIL)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-3xl"
    >
      <h1 className="mb-8 text-[0.7rem] font-medium uppercase tracking-[0.12em] text-gray-400">
        {c.title}
      </h1>

      <div className="space-y-8 leading-relaxed text-gray-600">
        <div className="space-y-5">
          <p className="text-xl text-gray-900">{c.headline}</p>
          <p>{c.description}</p>
        </div>

        <div className="flex flex-col items-start gap-3">
          <a
            href={mailtoHref}
            className="inline-flex w-fit rounded-full bg-gray-900 px-6 py-2.5 text-sm font-medium tracking-wide text-white transition-opacity hover:opacity-90"
          >
            {c.emailCta}
          </a>
          <p className="max-w-md text-[0.8rem] leading-snug text-gray-500">
            {c.rolesLine}
          </p>
        </div>

        <div className="border-t border-gray-100 pt-10">
          {FORMSPREE_ENDPOINT ? (
            <form
              action={FORMSPREE_ENDPOINT}
              method="POST"
              className="max-w-lg space-y-5"
            >
              <input type="hidden" name="_subject" value={c.formSubject} />
              <div>
                <label htmlFor="contact-name" className={labelClass}>
                  {c.nameLabel}
                </label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  required
                  autoComplete="name"
                  className={fieldClass}
                  placeholder={c.placeholderName}
                />
              </div>
              <div>
                <label htmlFor="contact-email" className={labelClass}>
                  {c.emailLabel}
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  className={fieldClass}
                  placeholder={c.placeholderEmail}
                />
              </div>
              <div>
                <label htmlFor="contact-message" className={labelClass}>
                  {c.messageLabel}
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={5}
                  className={`${fieldClass} min-h-[120px] resize-y`}
                  placeholder={c.placeholderMessage}
                />
              </div>
              <button
                type="submit"
                className="rounded-full border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50"
              >
                {c.send}
              </button>
            </form>
          ) : (
            <p className="max-w-lg text-sm text-gray-500">{c.noFormNote}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
