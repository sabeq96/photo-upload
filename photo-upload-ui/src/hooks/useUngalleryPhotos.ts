import { useState, useEffect } from "react";
import { readItems } from "@directus/sdk";
import { useDirectus } from "./useDirectus";

export function useUngalleryPhotos() {
  const directus = useDirectus();
  const [photos, setPhotos] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUngalleryPhotos = async () => {
      try {
        setLoading(true);
        const response = await directus.request(
          readItems("photos", {
            fields: ["*"],
            filter: {
              gallery_id: {
                _null: true,
              },
            },
            sort: ["date_created"],
          })
        );
        setPhotos(response || []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch ungallery photos"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUngalleryPhotos();
  }, [directus]);

  return { photos, loading, error };
}
