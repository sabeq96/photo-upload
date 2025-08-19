import type { DirectusSchema } from "../generated";
import { createAssetUrl } from "../helper";

interface PhotoCardProps {
  photo: DirectusSchema["photos"][number];
}

export function PhotoCard({ photo }: PhotoCardProps) {
  const url = createAssetUrl(
    typeof photo.photo === "string" ? photo.photo : ""
  );

  return (
    <div className="card bg-base-100 shadow-xl">
      <figure className="aspect-square overflow-hidden">
        <img src={url} alt="Photo" className="w-full h-full object-cover" />
      </figure>
    </div>
  );
}
