import type { DirectusSchema } from "../generated";
import { createAssetUrl } from "../helper";

interface AlbumCardProps {
  album: DirectusSchema["albums"][number];
}

export function AlbumCard({ album }: AlbumCardProps) {
  const firstPhoto =
    Array.isArray(album.photos) && album.photos.length > 0
      ? album.photos[0]
      : null;
  const photoCount = Array.isArray(album.photos) ? album.photos.length : 0;
  const title =
    typeof album.title === "string" ? album.title : "Untitled Album";

  const url = createAssetUrl(
    firstPhoto &&
      typeof firstPhoto !== "number" &&
      typeof firstPhoto.photo === "string"
      ? firstPhoto.photo
      : ""
  );

  return (
    <div className="relative aspect-square overflow-hidden group cursor-pointer">
      {url ? (
        <img src={url} alt={title} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-base-200 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-base-content/30"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
      )}

      {/* Album info overlay at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-black text-white p-2">
        <div className="text-sm font-medium truncate">{title}</div>
        <div className="text-xs opacity-80">
          {photoCount} {photoCount === 1 ? "photo" : "photos"}
        </div>
      </div>
    </div>
  );
}
