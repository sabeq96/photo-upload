interface PhotoCardProps {
  photo: Record<string, unknown>;
}

export function PhotoCard({ photo }: PhotoCardProps) {
  const photoUrl = typeof photo.photo === "string" ? photo.photo : null;

  return (
    <div className="card bg-base-100 shadow-xl">
      <figure className="aspect-square overflow-hidden">
        {photoUrl ? (
          <img
            src={`http://localhost:8055/assets/${photoUrl}`}
            alt="Photo"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-base-200 flex items-center justify-center">
            <span className="text-base-content/50">No image</span>
          </div>
        )}
      </figure>
    </div>
  );
}
