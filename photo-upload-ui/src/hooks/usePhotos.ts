import { useState, useEffect } from "react";
import { readItems } from "@directus/sdk";
import { useDirectus } from "./useDirectus";
import type { DirectusSchema } from "../generated";

export function usePhotos() {
  const directus = useDirectus();
  const [photos, setPhotos] = useState<DirectusSchema["photos"]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUngalleryPhotos = async () => {
      try {
        setLoading(true);
        const response = await directus.request(
          readItems("photos", {
            fields: ["*"],
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
