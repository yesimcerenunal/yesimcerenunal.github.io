import { useCallback, useState } from "react";
import { motion } from "motion/react";
import { useLanguage } from "../context/LanguageContext";
import {
  CONTACT_EMAIL,
  CONTACT_SOCIAL_LINKS,
  type ContactSocialLinkId,
  FORMSPREE_ENDPOINT,
} from "../config/contact";
import { cn } from "../components/ui/utils";
import artstationIconUrl from "../assets/artstation.png?url";
import behanceIconUrl from "../assets/behance.png?url";
import instagramIconUrl from "../assets/instagram.png?url";
import gumroadIconUrl from "../assets/gumroad.png?url";

const SOCIAL_ICONS: Record<ContactSocialLinkId, string> = {
  artstation: artstationIconUrl,
  behance: behanceIconUrl,
  instagram: instagramIconUrl,
  gumroad: gumroadIconUrl,
};

const fieldClass =
  "mt-1.5 w-full rounded-lg border border-border bg-input-background px-3 py-2.5 text-sm text-foreground outline-none transition-[box-shadow,border-color] placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/25";

const labelClass = "block text-[0.8rem] font-medium text-foreground/85";

/** Matches `SwitchToCameraButton` pill (ENTER HANDS MODE). */
const emailCtaBaseClass =
  "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full border border-border bg-muted/50 px-5 py-2 text-sm font-medium tracking-wide text-muted-foreground transition-[background-color,border-color,color,opacity] duration-200 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98] sm:px-6 sm:py-2.5";

const emailCtaActiveClass = cn(
  emailCtaBaseClass,
  "border-foreground/20 bg-muted text-foreground hover:bg-muted hover:text-foreground",
);

/** Matches project detail ROLE value (`ProjectDetailCopy`). */
const contactHeadlineLeadClass =
  "text-[0.9375rem] leading-snug italic text-muted-foreground sm:text-[1.0625rem] sm:leading-relaxed sm:text-[1.125rem]";

/** Slightly smaller than project detail title (`ProjectDetailCopy` h2). */
const contactHeadlineTitleClass =
  "max-w-full text-[0.9375rem] leading-[1.25] tracking-tight text-foreground whitespace-normal sm:text-[clamp(0.9375rem,0.9rem+0.65vw,1.5rem)] sm:leading-[1.3]";

function ContactSocialRow({
  href,
  ariaLabel,
  iconUrl,
  label,
}: {
  href: string;
  ariaLabel: string;
  iconUrl: string;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className="group inline-flex w-fit items-center gap-2.5 rounded-md transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <img
        src={iconUrl}
        alt=""
        width={32}
        height={32}
        className="h-8 w-8 shrink-0 rounded-md object-contain"
        decoding="async"
        loading="eager"
      />
      <span className="text-sm text-muted-foreground transition-colors group-hover:text-foreground">
        {label}
      </span>
    </a>
  );
}

export function Contact() {
  const { messages, locale } = useLanguage();
  const c = messages.contact;
  const mailtoHref = `mailto:${encodeURIComponent(CONTACT_EMAIL)}`;
  const [emailCopied, setEmailCopied] = useState(false);
  const [emailMeAck, setEmailMeAck] = useState(false);

  const onMailtoClick = useCallback(() => {
    setEmailMeAck(true);
    window.setTimeout(() => setEmailMeAck(false), 2000);
  }, []);

  const copyEmailToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setEmailCopied(true);
      window.setTimeout(() => setEmailCopied(false), 2000);
    } catch {
      setEmailCopied(false);
    }
  }, []);

  const headlineParts = c.headline.split(/\n\n+/);
  const headlineLead = headlineParts[0]?.trim() ?? "";
  const headlineRest = headlineParts.slice(1).join("\n\n").trim();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-3xl pt-6 sm:pt-8"
    >
      <div className="space-y-8 leading-relaxed text-muted-foreground">
        <div className="space-y-6">
          <div className="space-y-4">
            {headlineLead ? (
              <p className={contactHeadlineLeadClass}>{headlineLead}</p>
            ) : null}
            {headlineRest ? (
              <p className={contactHeadlineTitleClass}>{headlineRest}</p>
            ) : null}
          </div>
          {c.description.trim() ? (
            <p className="text-base text-muted-foreground">{c.description}</p>
          ) : null}
        </div>

        {!FORMSPREE_ENDPOINT && c.noFormNote.trim() ? (
          <p className="max-w-lg text-sm text-muted-foreground">{c.noFormNote}</p>
        ) : null}

        <div className="border-t border-border pt-8">
          <div className="flex flex-col items-start">
            {c.rolesLine.trim() ? (
              <p className="mb-6 max-w-md text-[0.8rem] leading-snug text-muted-foreground">
                {c.rolesLine}
              </p>
            ) : null}

            <div className="flex max-w-full flex-wrap items-center gap-x-2 gap-y-2.5 text-sm text-foreground">
              <a
                href={mailtoHref}
                className={emailMeAck ? emailCtaActiveClass : emailCtaBaseClass}
                onClick={onMailtoClick}
              >
                {c.emailCta}
              </a>
              <span className="text-muted-foreground">{c.emailInlineOr}</span>
              <button
                type="button"
                onClick={copyEmailToClipboard}
                className={cn(
                  emailCopied ? emailCtaActiveClass : emailCtaBaseClass,
                  emailCopied ? "cursor-default" : "cursor-pointer",
                  locale === "de" && "min-w-[11rem] whitespace-nowrap",
                )}
              >
                {emailCopied ? c.emailCopiedFeedback : c.copyEmail}
              </button>
            </div>

            <ul className="mt-14 flex max-w-full flex-wrap items-center gap-x-6 gap-y-3 sm:mt-[4.5rem] sm:gap-x-8">
              {CONTACT_SOCIAL_LINKS.map((link) => (
                <li key={link.id} className="shrink-0">
                  <ContactSocialRow
                    href={link.href}
                    iconUrl={SOCIAL_ICONS[link.iconKey]}
                    label={link.label}
                    ariaLabel={c[link.ariaLabelKey]}
                  />
                </li>
              ))}
            </ul>
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
