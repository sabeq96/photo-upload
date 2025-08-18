import { directus, DirectusContext } from "../providers";
import { useContext } from "react";

export function useDirectus(): typeof directus {
  const context = useContext(DirectusContext);
  if (!context) {
    throw new Error("useDirectus must be used within a DirectusProvider");
  }

  return context;
}
