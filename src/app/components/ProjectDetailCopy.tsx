import type { ReactNode } from "react";
import { cn } from "./ui/utils";

type DescriptionBlock =
  | { type: "role"; label: string; text: string }
  | { type: "section"; label: string; bullets: string[] }
  | { type: "note"; label: string; text: string }
  | { type: "bullets"; items: string[] }
  | { type: "paragraph"; text: string };

const ROLE_LINE = /^(Role|Rolle|Rol|Görev)\s*:\s*(.+)$/is;
const NOTE_LINE = /^(Note|Not|Hinweis)\s*:\s*(.+)$/is;
const SECTION_LINE =
  /^(Responsibilities|Aufgaben(?:\s*&\s*Verantwortlichkeiten)?|Verantwortlichkeiten|Sorumluluklar)\s*:\s*\n?([\s\S]*)$/i;

function extractBullets(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /^[•\-–—]\s?/.test(line))
    .map((line) => line.replace(/^[•\-–—]\s?/, "").trim())
    .filter(Boolean);
}

function parseProjectDescription(description: string): DescriptionBlock[] {
  const blocks: DescriptionBlock[] = [];
  const rawBlocks = description
    .split(/\n\n+/)
    .map((part) => part.trim())
    .filter(Boolean);

  for (const block of rawBlocks) {
    const roleMatch = block.match(ROLE_LINE);
    if (roleMatch) {
      blocks.push({
        type: "role",
        label: roleMatch[1].trim(),
        text: roleMatch[2].trim(),
      });
      continue;
    }

    const noteMatch = block.match(NOTE_LINE);
    if (noteMatch) {
      blocks.push({
        type: "note",
        label: noteMatch[1].trim(),
        text: noteMatch[2].trim(),
      });
      continue;
    }

    const sectionMatch = block.match(SECTION_LINE);
    if (sectionMatch) {
      const bullets = extractBullets(sectionMatch[2]);
      if (bullets.length > 0) {
        blocks.push({
          type: "section",
          label: sectionMatch[1].trim(),
          bullets,
        });
        continue;
      }
    }

    const bullets = extractBullets(block);
    if (bullets.length > 0 && bullets.join("\n").length >= block.length - 4) {
      blocks.push({ type: "bullets", items: bullets });
      continue;
    }

    blocks.push({ type: "paragraph", text: block });
  }

  return blocks;
}

const bodyClass =
  "text-[0.875rem] leading-snug text-muted-foreground sm:text-[0.95rem] sm:leading-relaxed";

const roleLineClass =
  "text-[0.9375rem] leading-snug italic text-muted-foreground sm:text-[1.0625rem] sm:leading-relaxed sm:text-[1.125rem]";

const metaLabelClass =
  "shrink-0 text-[0.6875rem] uppercase leading-none tracking-[0.16em] text-muted-foreground sm:text-xs sm:tracking-[0.18em]";

const metaRowLabelClass = cn(metaLabelClass, "self-start sm:self-center");

const metaValueClass =
  "m-0 min-w-0 w-full text-[0.875rem] leading-snug text-muted-foreground sm:text-[0.95rem] sm:leading-none";

function normalizeBulletText(text: string): string {
  return text
    .trim()
    .replace(/[^\S\n]+/g, " ")
    .replace(/\n+/g, "\n");
}

const responsibilityListClass = cn(
  bodyClass,
  "w-full max-w-none list-disc space-y-1 pl-10 marker:text-muted-foreground sm:space-y-1.5 sm:pl-12",
  "[&_li]:hyphens-none [&_li]:break-normal [&_li]:whitespace-pre-line",
);

function DetailSection({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex w-full max-w-none flex-col gap-2 sm:gap-3">
      <span className={metaLabelClass}>{label}</span>
      {children}
    </div>
  );
}

function MetaRow({
  label,
  children,
  className,
  inline = false,
}: {
  label: string;
  children: ReactNode;
  className?: string;
  inline?: boolean;
}) {
  return (
    <div
      className={cn(
        inline ?
          "grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3"
        : "flex flex-col gap-1.5 sm:grid sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center sm:gap-x-3",
        className,
      )}
    >
      <span className={cn(metaRowLabelClass, inline && "self-center")}>
        {label}
      </span>
      <div className={metaValueClass}>{children}</div>
    </div>
  );
}

function renderProseBlock(block: DescriptionBlock, index: number) {
  if (block.type === "note") {
    return (
      <p
        key={`note-${index}`}
        className={cn(bodyClass, "whitespace-pre-line")}
      >
        {block.label}: {block.text}
      </p>
    );
  }

  if (block.type === "paragraph") {
    return (
      <p
        key={`paragraph-${index}`}
        className={cn(bodyClass, "whitespace-pre-line")}
      >
        {block.text}
      </p>
    );
  }

  return null;
}

export function ProjectDetailCopy({
  title,
  subtitle,
  description,
  tools,
  year,
  toolsLabel,
  yearLabel,
  responsibilitiesLabel,
}: {
  title: string;
  subtitle?: string;
  description: string;
  tools: string;
  year: string;
  toolsLabel: string;
  yearLabel: string;
  responsibilitiesLabel: string;
}) {
  const displayTitle =
    subtitle?.trim() ? `${title.trim()} — ${subtitle.trim()}` : title.trim();
  const blocks = parseProjectDescription(description.trim());
  const roleBlocks = blocks.filter((block) => block.type === "role");
  const sectionBlocks = blocks.filter((block) => block.type === "section");
  const proseBlocks = blocks.filter(
    (block) => block.type === "paragraph" || block.type === "note",
  );
  const bulletBlocks = blocks.filter((block) => block.type === "bullets");
  const hasBodyContent =
    sectionBlocks.length > 0 ||
    proseBlocks.length > 0 ||
    bulletBlocks.length > 0;

  return (
    <div className="flex min-h-0 w-full max-w-none flex-col gap-2 sm:gap-4">
      <h2 className="max-w-full text-[1.0625rem] leading-[1.2] tracking-tight text-foreground whitespace-normal sm:text-[clamp(1.0625rem,1rem+0.85vw,1.75rem)] sm:leading-[1.25] sm:whitespace-nowrap">
        {displayTitle}
      </h2>

      {roleBlocks.map((block, index) => (
        <p
          key={`role-${index}`}
          className={cn(roleLineClass, "-mt-0.5 mb-1 sm:-mt-1 sm:mb-2")}
        >
          {block.text}
        </p>
      ))}

      {tools.trim() !== "" ? (
        <MetaRow className="mb-1 sm:mb-2" label={toolsLabel}>
          {tools}
        </MetaRow>
      ) : null}
      {year.trim() !== "" ? (
        <MetaRow inline label={yearLabel}>
          <span className="tabular-nums">{year}</span>
        </MetaRow>
      ) : null}

      {hasBodyContent ? (
        <div className="mt-1 flex flex-col gap-2.5 sm:mt-2 sm:gap-4">
          {sectionBlocks.map((block, index) => (
            <DetailSection key={`section-${index}`} label={block.label}>
              <ul className={responsibilityListClass}>
                {block.bullets.map((item, bulletIndex) => (
                  <li key={`${index}-${bulletIndex}`}>
                    {normalizeBulletText(item)}
                  </li>
                ))}
              </ul>
            </DetailSection>
          ))}

          {bulletBlocks.map((block, index) => (
            <DetailSection
              key={`bullets-${index}`}
              label={responsibilitiesLabel}
            >
              <ul className={responsibilityListClass}>
                {block.items.map((item, bulletIndex) => (
                  <li key={`${index}-${bulletIndex}`}>
                    {normalizeBulletText(item)}
                  </li>
                ))}
              </ul>
            </DetailSection>
          ))}

          {proseBlocks.length > 0 ? (
            <DetailSection label={responsibilitiesLabel}>
              <div className="flex flex-col gap-2">
                {proseBlocks.map((block, index) =>
                  renderProseBlock(block, index),
                )}
              </div>
            </DetailSection>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
