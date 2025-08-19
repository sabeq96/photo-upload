import { usePhotos } from "../hooks";
import { PhotoCard } from "../components";

export function HomePage() {
  const { photos, loading: photosLoading, error: photosError } = usePhotos();

  if (photosLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (photosError) {
    return (
      <div className="alert alert-error">
        <span>Error: {photosError}</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      {/* Photos Grid - Full Page */}
      {photos && photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
          {photos.map((photo, index) => (
            <PhotoCard key={index} photo={photo} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {(!photos || photos.length === 0) && (
        <div className="text-center py-12">
          <div className="text-base-content/50 mb-4">
            <svg
              className="w-16 h-16 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">No photos yet</h3>
          <p className="text-base-content/70 mb-4">
            Start by uploading your first photos
          </p>
          <button className="btn btn-primary">Upload Photos</button>
        </div>
      )}
    </div>
  );
}
