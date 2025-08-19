import { useAlbums } from "../hooks";
import { AlbumCard } from "../components";

export function AlbumsPage() {
  const { galleries, loading, error } = useAlbums();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>Error: {error}</span>
      </div>
    );
  }

  const isEmpty = !galleries || galleries.length === 0;

  return (
    <div className="w-full h-full">
      {/* Albums Grid - Full Page */}
      {!isEmpty && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {galleries.map((album, index) => (
            <AlbumCard key={index} album={album} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {isEmpty && (
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
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">No albums yet</h3>
          <p className="text-base-content/70 mb-4">
            Create your first album to organize your photos
          </p>
          <button className="btn btn-primary">Create Album</button>
        </div>
      )}
    </div>
  );
}
