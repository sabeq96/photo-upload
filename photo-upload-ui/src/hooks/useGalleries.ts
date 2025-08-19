import { useState, useEffect } from "react";
import { readItems } from "@directus/sdk";
import { useDirectus } from "./useDirectus";
import type { DirectusSchema } from "../generated";

export function useGalleries() {
  const directus = useDirectus();
  const [galleries, setGalleries] = useState<DirectusSchema["galleries"]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        setLoading(true);
        const response = await directus.request(
          readItems("galleries", {
            fields: ["*", { photos: ["*"] }],
            sort: ["sort", "date_created"],
          })
        );
        setGalleries(response || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch galleries"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchGalleries();
  }, [directus]);

  return { galleries, loading, error };
}
