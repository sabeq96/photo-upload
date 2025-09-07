import { useMutation, useQuery } from "@tanstack/react-query";
import { usePocketBase } from "../../context";
import type { UsersResponse } from "../../types/pb";

export const useAuth = () => {
    const pb = usePocketBase();

    const query = useQuery({
        queryKey: ["auth"],
        queryFn: () => {
            if (pb.authStore.isValid) {
                return pb.authStore.record as UsersResponse;
            }

            return null;
        }
    });

    const login = useMutation({
        mutationFn: ({ email, password }: { email: string, password: string }) => {
            return pb.collection("users").authWithPassword(email, password);
        },
        onSuccess: () => {
            return query.refetch();
        }
    })

    const logout = useMutation({
        mutationFn: () => {
            pb.authStore.clear();

            return Promise.resolve();
        },
        onSuccess: () => {
            return query.refetch();
        }
    })

    return {query, login, logout};
}