import { useEffect, useState } from "react";
import { usePocketBase } from "../../context";
import type { AuthRecord } from "pocketbase";

export const useAuth = () => {
    const [user, setUser] = useState<AuthRecord | null>(null);

    const pb = usePocketBase();

    useEffect(() => {
        setUser(pb.authStore.record);
    }, [pb.authStore.record]);

    return {
        login: async (email: string, password: string) => {
            pb.authStore.clear();
            await pb.collection("users").authWithPassword(email, password);
        },
        logout: () => {
            pb.authStore.clear();
        },
        isAuthenticated: !!user,
    }
}