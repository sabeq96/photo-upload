import { createContext, type ReactNode } from "react";
import { authentication, createDirectus, rest } from "@directus/sdk";
import type { DirectusSchema } from "../generated";

// Create Directus client with persistent authentication storage
const URL = import.meta.env.DEV
  ? "http://localhost:5173/directus"
  : "http://localhost:8055";

// Create Directus client with persistent authentication storage
export const directus = createDirectus<DirectusSchema>(URL)
  .with(authentication("session", { credentials: "include" }))
  .with(rest({ credentials: "include" }));

// Create context
export const DirectusContext = createContext<typeof directus | null>(null);

export function DirectusProvider({ children }: { children: ReactNode }) {
  return (
    <DirectusContext.Provider value={directus}>
      {children}
    </DirectusContext.Provider>
  );
}
