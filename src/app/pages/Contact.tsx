import { motion } from "motion/react";
import { useLanguage } from "../context/LanguageContext";
import { CONTACT_EMAIL, FORMSPREE_ENDPOINT } from "../config/contact";

const fieldClass =
  "mt-1.5 w-full rounded-lg border border-border bg-input-background px-3 py-2.5 text-sm text-foreground outline-none transition-[box-shadow,border-color] placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/25";

const labelClass = "block text-[0.8rem] font-medium text-foreground/85";

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
      <div className="space-y-8 leading-relaxed text-muted-foreground">
        <div className="space-y-6">
          <h1 className="text-sm font-normal uppercase tracking-[0.22em] text-muted-foreground">
            {c.title}
          </h1>
          <div className="space-y-5">
            <p className="whitespace-pre-line text-base font-normal italic leading-relaxed text-muted-foreground">
              {c.headline}
            </p>
            {c.description.trim() ? (
              <p className="text-base text-muted-foreground">{c.description}</p>
            ) : null}
          </div>
        </div>

        {!FORMSPREE_ENDPOINT && c.noFormNote.trim() ? (
          <p className="max-w-lg text-sm text-muted-foreground">{c.noFormNote}</p>
        ) : null}

        <div className="border-t border-border pt-8">
          <div className="flex flex-col items-start gap-3">
            {c.rolesLine.trim() ? (
              <p className="mb-6 max-w-md text-[0.8rem] leading-snug text-muted-foreground">
                {c.rolesLine}
              </p>
            ) : null}
            <a
              href={mailtoHref}
              className="inline-flex w-fit items-center rounded-full bg-primary px-4 py-2 text-sm font-medium tracking-wide text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              {c.emailCta}
            </a>
          </div>
        </div>

        {FORMSPREE_ENDPOINT ? (
          <div className="border-t border-border pt-10">
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
                className="rounded-full border border-border bg-card px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                {c.send}
              </button>
            </form>
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
