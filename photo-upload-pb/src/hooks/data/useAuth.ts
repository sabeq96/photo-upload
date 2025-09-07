import { useEffect, useState } from "react";
import { usePocketBase } from "../../context";
import type { AuthRecord } from "pocketbase";

export const useAuth = () => {
    const [user, setUser] = useState<AuthRecord | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const pb = usePocketBase();

    useEffect(() => {
        const checkAuth = async () => {
            setIsLoading(true);
            if (pb.authStore.record) {
                setUser(pb.authStore.record);
            }
            setIsLoading(false);
        }

        checkAuth();
    }, [pb.authStore.record?.id]);

    const login = async (email: string, password: string) => {
        try {
            setIsLoading(true);
            pb.authStore.clear();
            await pb.collection("users").authWithPassword(email, password);
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
    }
}