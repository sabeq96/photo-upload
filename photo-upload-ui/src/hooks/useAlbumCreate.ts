import { useState, useCallback } from "react";
import { createItem, updateItem } from "@directus/sdk";
import { useDirectus } from "./useDirectus";

export function useAlbumCreate() {
  const directus = useDirectus();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAlbum = useCallback(
    async (title: string, photoIds: number[]) => {
      try {
        setLoading(true);
        setError(null);

        // Create the album first
        const album = await directus.request(
          createItem("albums", {
            title,
          })
        );

        // Update photos to assign them to the album
        if (photoIds.length > 0) {
          await Promise.all(
            photoIds.map((photoId) =>
              directus.request(
                updateItem("photos", photoId, {
                  album_id: album.id,
                })
              )
            )
          );
        }

        return album;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create album";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [directus]
  );

  return { createAlbum, loading, error };
}
