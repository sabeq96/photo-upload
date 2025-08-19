import type { DirectusSchema } from "../generated";
import { createAssetUrl } from "../helper";

interface GalleryCardProps {
  gallery: DirectusSchema["galleries"][number];
}

export function GalleryCard({ gallery }: GalleryCardProps) {
  const firstPhoto =
    Array.isArray(gallery.photos) && gallery.photos.length > 0
      ? gallery.photos[0]
      : null;
  const photoCount = Array.isArray(gallery.photos) ? gallery.photos.length : 0;
  const title =
    typeof gallery.title === "string" ? gallery.title : "Untitled Gallery";

  const url = createAssetUrl(
    typeof firstPhoto?.photo === "string" ? firstPhoto.photo : ""
  );

  return (
    <div className="card bg-base-100 shadow-xl">
      <figure className="aspect-square overflow-hidden">
        {firstPhoto &&
        typeof firstPhoto === "object" &&
        firstPhoto !== null &&
        "photo" in firstPhoto ? (
          <img src={url} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-base-200 flex items-center justify-center">
            <span className="text-base-content/50">No photos</span>
          </div>
        )}
      </figure>
      <div className="card-body p-4">
        <h2 className="card-title text-sm">{title}</h2>
        <p className="text-xs text-base-content/70">
          {photoCount} {photoCount === 1 ? "photo" : "photos"}
        </p>
      </div>
    </div>
  );
}
