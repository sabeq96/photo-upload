import { useState, useEffect, useCallback } from "react";
import { readItems } from "@directus/sdk";
import { useDirectus } from "./useDirectus";
import type { DirectusSchema } from "../generated";

export interface PhotoFilters {
  unalbumed?: boolean;
}

export function usePhotos(filters?: PhotoFilters) {
  const directus = useDirectus();
  const [photos, setPhotos] = useState<DirectusSchema["photos"]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPhotos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Build the query filter based on provided filters
      let queryFilter = {};
      if (filters?.unalbumed) {
        queryFilter = {
          album_id: {
            _null: true,
          },
        };
      }

      if (Object.keys(queryFilter).length > 0) {
        const response = await directus.request(
          readItems("photos", {
            fields: ["*"],
            sort: ["date_created"],
            filter: queryFilter,
          })
        );

        setPhotos(response || []);
      } else {
        const response = await directus.request(
          readItems("photos", {
            fields: ["*"],
            sort: ["date_created"],
          })
        );

        setPhotos(response || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch photos");
    } finally {
      setLoading(false);
    }
  }, [directus, filters?.unalbumed]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const refresh = useCallback(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  return { photos, loading, error, refresh };
}
