import { createContext, type ReactNode } from "react";
import { authentication, createDirectus, rest } from "@directus/sdk";
import type { DirectusSchema } from "../generated";

// Create Directus client with persistent authentication storage
export const directus = createDirectus<DirectusSchema>("http://localhost:8055")
  .with(
    authentication("cookie", {
      credentials: "include",
      storage: {
        get: () => {
          const token = localStorage.getItem("directus_auth");
          return token ? JSON.parse(token) : null;
        },
        set: (value: unknown) => {
          localStorage.setItem("directus_auth", JSON.stringify(value));
        },
      },
    })
  )
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
