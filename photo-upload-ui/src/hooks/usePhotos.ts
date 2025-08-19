import { useState, useEffect, useCallback } from "react";
import { readItems } from "@directus/sdk";
import { useDirectus } from "./useDirectus";
import type { DirectusSchema } from "../generated";

export function usePhotos() {
  const directus = useDirectus();
  const [photos, setPhotos] = useState<DirectusSchema["photos"]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPhotos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await directus.request(
        readItems("photos", {
          fields: ["*"],
          sort: ["date_created"],
        })
      );

      setPhotos(response || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch photos");
    } finally {
      setLoading(false);
    }
  }, [directus]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const refresh = useCallback(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  return { photos, loading, error, refresh };
}
