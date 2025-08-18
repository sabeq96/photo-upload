import { useState, useEffect, type ReactNode } from "react";
import { useDirectus } from "../hooks/useDirectus";
import { readMe } from "@directus/sdk";
import { createContext } from "react";

interface User {
  id: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const [isLoading, setIsLoading] = useState(true);
  const directus = useDirectus();

  // Check if user is already authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userInfo = await directus.request(readMe());
        setUser({
          id: userInfo.id,
          email: userInfo.email || "",
          first_name: userInfo.first_name,
          last_name: userInfo.last_name,
        });
      } catch {
        // User is not authenticated
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [directus]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await directus.login({ email, password });

      // Get user information after successful login
      const userInfo = await directus.request(readMe());
      setUser({
        id: userInfo.id,
        email: userInfo.email || "",
        first_name: userInfo.first_name,
        last_name: userInfo.last_name,
      });
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await directus.logout();
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
      // Clear user state even if logout request fails
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
