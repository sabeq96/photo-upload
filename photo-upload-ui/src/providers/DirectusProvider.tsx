import { createContext, type ReactNode } from "react";
import { authentication, createDirectus, rest } from "@directus/sdk";
import type { DirectusSchema } from "../generated";

// Create Directus client with persistent authentication storage
export const directus = createDirectus<DirectusSchema>("http://localhost:8055")
  .with(rest())
  .with(
    authentication("json", {
      autoRefresh: true,
      storage: {
        get: () => {
          const token = localStorage.getItem("directus_token");
          return token ? JSON.parse(token) : null;
        },
        set: (value: unknown) => {
          if (value) {
            localStorage.setItem("directus_token", JSON.stringify(value));
          } else {
            localStorage.removeItem("directus_token");
          }
        },
      },
    })
  );

// Create context
export const DirectusContext = createContext<typeof directus | null>(null);

export function DirectusProvider({ children }: { children: ReactNode }) {
  return (
    <DirectusContext.Provider value={directus}>
      {children}
    </DirectusContext.Provider>
  );
}
