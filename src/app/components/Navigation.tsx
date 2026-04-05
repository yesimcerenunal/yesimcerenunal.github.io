import { useLocation, useSearchParams } from "react-router";
import {
  GALLERY_CATEGORIES,
  useWorksCategory,
} from "../context/WorksCategoryContext";
import { useLanguage } from "../context/LanguageContext";
import { categoryToDataSlug } from "../utils/categorySlug";

export function Navigation() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const isWorks = location.pathname === "/";
  const { hoveredCategory, lockedCategory } = useWorksCategory();
  const { messages } = useLanguage();
  const { sidebar, categories: cat } = messages;

  const filterSlug = (searchParams.get("filter") ?? "all").toLowerCase();
  const galleryHighlight = lockedCategory ?? hoveredCategory;

  const setFilter = (slug: string) => {
    if (slug === "all") {
      setSearchParams({}, { replace: true });
    } else {
      setSearchParams({ filter: slug }, { replace: true });
    }
  };

  return (
    <aside className="flex w-48 shrink-0 flex-col border-r border-border px-6 pb-6 pt-6 sm:w-56 sm:px-8 sm:pb-8 sm:pt-8">
      <div className="mb-10">
        <p className="text-[0.78rem] font-medium uppercase leading-tight tracking-[0.14em] text-foreground">
          {sidebar.portfolio}
        </p>
      </div>

      {isWorks ? (
        <nav
          className="flex flex-col gap-2"
          aria-label={messages.aria.workCategoriesNavigation}
        >
          <button
            type="button"
            onClick={() => setFilter("all")}
            className="rounded-lg px-2.5 py-1.5 text-left text-[0.82rem] tracking-[0.01em] transition-all duration-300 ease-out hover:bg-muted/70"
            style={{
              fontWeight: filterSlug === "all" ? 600 : 500,
              color:
                filterSlug === "all"
                  ? "var(--foreground)"
                  : galleryHighlight
                    ? "var(--nav-text-mid)"
                    : "var(--nav-text-faint)",
              background:
                filterSlug === "all"
                  ? "var(--nav-filter-active-bg)"
                  : "transparent",
              boxShadow:
                filterSlug === "all"
                  ? "inset 0 0 0 1px var(--nav-filter-active-ring)"
                  : "none",
            }}
          >
            {cat.all}
          </button>
          {GALLERY_CATEGORIES.map((canonical) => {
            const slug = categoryToDataSlug(canonical);
            const isFilterActive = filterSlug === slug;
            const isGalleryGlow =
              galleryHighlight === canonical && !isFilterActive;

            return (
              <button
                key={canonical}
                type="button"
                onClick={() => setFilter(slug)}
                className="rounded-lg px-2.5 py-1.5 text-left text-[0.82rem] tracking-[0.01em] transition-all duration-300 ease-out hover:bg-muted/70"
                style={{
                  fontWeight: isFilterActive ? 600 : 500,
                  color: isFilterActive
                    ? "var(--foreground)"
                    : isGalleryGlow
                      ? "var(--nav-text-mid)"
                      : "var(--nav-text-faint)",
                  background: isFilterActive
                    ? "var(--nav-filter-active-bg)"
                    : "transparent",
                  boxShadow: isFilterActive
                    ? "inset 0 0 0 1px var(--nav-filter-active-ring)"
                    : "none",
                  transform: isGalleryGlow ? "scale(1.02)" : "scale(1)",
                  transformOrigin: "left center",
                }}
              >
                {cat[canonical]}
              </button>
            );
          })}
        </nav>
      ) : null}

      <div className="mt-auto pt-10">
        <p className="max-w-[14rem] text-[0.72rem] leading-[1.6] tracking-[0.01em] text-muted-foreground">
          {isWorks ? sidebar.taglineWorks : sidebar.taglineOther}
        </p>
      </div>
    </aside>
  );
}
