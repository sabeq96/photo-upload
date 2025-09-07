import { useState } from "react";
import { usePhotos, useAlbumCreate } from "../hooks";
import { createAssetUrl } from "../helper";

export function CreateAlbumPage() {
  const { photos: unalbumedPhotos, loading: photosLoading } = usePhotos({
    unalbumed: true,
  });
  const { createAlbum, loading: createLoading } = useAlbumCreate();

  const [albumTitle, setAlbumTitle] = useState("");
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<number[]>([]);

  const handlePhotoToggle = (photoId: number) => {
    setSelectedPhotoIds((prev) =>
      prev.includes(photoId)
        ? prev.filter((id) => id !== photoId)
        : [...prev, photoId]
    );
  };

  const handleCreateAlbum = async () => {
    if (!albumTitle.trim()) return;

    try {
      await createAlbum(albumTitle.trim(), selectedPhotoIds);
      // Navigate back to albums page after successful creation
      window.history.back();
    } catch (error) {
      console.error("Failed to create album:", error);
    }
  };

  const isCreateDisabled = !albumTitle.trim() || createLoading;

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create New Album</h1>

        {/* Album Title Input and Create Button */}
        <div className="flex gap-4 mb-8">
          <input
            type="text"
            placeholder="Enter album title..."
            className="input input-bordered input-lg flex-1 text-xl"
            value={albumTitle}
            onChange={(e) => setAlbumTitle(e.target.value)}
            disabled={createLoading}
          />
          <button
            className="btn btn-primary btn-lg"
            onClick={handleCreateAlbum}
            disabled={isCreateDisabled}
          >
            {createLoading ? (
              <span className="loading loading-spinner loading-md"></span>
            ) : (
              "Create"
            )}
          </button>
        </div>

        {/* Unalbumed Photos Selection */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Select Photos ({selectedPhotoIds.length} selected)
          </h2>

          {photosLoading ? (
            <div className="flex justify-center py-8">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : unalbumedPhotos.length === 0 ? (
            <div className="text-center py-8 text-base-content/60">
              No unalbumed photos available
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {unalbumedPhotos.map((photo) => {
                const isSelected = selectedPhotoIds.includes(photo.id);
                const photoUrl =
                  typeof photo.photo === "string"
                    ? createAssetUrl(photo.photo)
                    : createAssetUrl(photo.photo.id);

                return (
                  <div
                    key={photo.id}
                    className={`
                      aspect-square cursor-pointer rounded-lg overflow-hidden border-4 transition-all
                      ${
                        isSelected
                          ? "border-primary scale-95"
                          : "border-transparent hover:border-base-300"
                      }
                    `}
                    onClick={() => handlePhotoToggle(photo.id)}
                  >
                    <img
                      src={photoUrl}
                      alt="Photo thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
