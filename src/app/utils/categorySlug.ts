/** Stable slug for URLs, data-category, and query params */
export function categoryToDataSlug(category: string): string {
  const s = category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return s || "uncategorized";
}
