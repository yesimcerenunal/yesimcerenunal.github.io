import { useMemo } from "react";
import { useSearchParams } from "react-router";
import { Gallery3D } from "../components/Gallery3D";
import { galleryItems } from "../data/galleryData";
import { GALLERY_CATEGORIES, useWorksCategory } from "../context/WorksCategoryContext";
import { useLanguage } from "../context/LanguageContext";
import { categoryToDataSlug } from "../utils/categorySlug";

export function Works() {
  const [searchParams] = useSearchParams();
  const { setHoveredCategory, setLockedCategory } = useWorksCategory();
  const { messages } = useLanguage();

  const activeFilter = useMemo(() => {
    const raw = (searchParams.get("filter") ?? "all").toLowerCase();
    if (raw === "all") return "All";
    const match = GALLERY_CATEGORIES.find(
      (c) => categoryToDataSlug(c) === raw,
    );
    return match ?? "All";
  }, [searchParams]);

  return (
    <div className="relative flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col">
      <h1 className="pointer-events-none absolute left-0 top-0 z-20 text-[0.7rem] font-medium uppercase tracking-[0.12em] text-gray-400">
        {messages.nav.gallery}
      </h1>
      <Gallery3D
        images={galleryItems}
        activeFilter={activeFilter}
        onHoverCategory={setHoveredCategory}
        onOpenImage={(img) => setLockedCategory(img.category)}
        onCloseModal={() => setLockedCategory(null)}
      />
    </div>
  );
}
