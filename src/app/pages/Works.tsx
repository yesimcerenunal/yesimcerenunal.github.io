import { Gallery3D } from "../components/Gallery3D";
import { galleryItems } from "../data/galleryData";

export function Works() {
  return (
    <div className="relative flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col">
      <Gallery3D images={galleryItems} />
    </div>
  );
}
