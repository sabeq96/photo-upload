import { createContext, useContext, type ReactNode } from "react";
import { createDirectus, rest } from "@directus/sdk";

// Schema
type DirectusSchema = {
  gallery: {
    id: string;
    title: string;
    description: string;
    images: Array<{
      id: string;
      url: string;
      title: string;
      description: string;
    }>;
  };
};

// Create Directus client
const directus = createDirectus<DirectusSchema>("http://localhost:8055").with(
  rest()
);

// Create context
const DirectusContext = createContext<typeof directus | null>(null);

// Provider component
interface DirectusProviderProps {
  children: ReactNode;
}

export function DirectusProvider({ children }: DirectusProviderProps) {
  return (
    <DirectusContext.Provider value={directus}>
      {children}
    </DirectusContext.Provider>
  );
}

// Hook to use Directus
export function useDirectus(): typeof directus {
  const context = useContext(DirectusContext);
  if (!context) {
    throw new Error("useDirectus must be used within a DirectusProvider");
  }
  return context;
}
