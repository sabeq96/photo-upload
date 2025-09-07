import { useEffect } from "react";
import { usePocketBase } from "../../context";
import { authStore } from "../../stores";
import type { UsersResponse } from "../../types/pb";

export const useAuth = () => {
    const pb = usePocketBase();
    const { user, isLoading, setUser, setIsLoading } = authStore();

    useEffect(() => {
        if (pb.authStore.isValid && !user && !isLoading) {
            setUser(pb.authStore.record as UsersResponse);
        }
    }, [pb.authStore.isValid, user, isLoading, setUser]);

    const login = async (email: string, password: string) => {
        try {
            setIsLoading(true);
            pb.authStore.clear();
            await pb.collection("users").authWithPassword(email, password);
            setUser(pb.authStore.record as UsersResponse);
        }
        catch {
            throw new Error("Login failed");
        }
        finally {
            setIsLoading(false);
        }
    }

    const logout = async () => {
        pb.authStore.clear();
        setUser(null);
    }

    return {
        login,
        logout,
        isAuthenticated: !!user,
        isLoading,
    };
}