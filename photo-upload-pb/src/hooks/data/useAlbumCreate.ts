import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePocketBase } from "../../context";
import { useAuth } from "./useAuth";

interface UseAlbumCreateProps {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}

export function useAlbumCreate({ onSuccess, onError }: UseAlbumCreateProps) {
    const pb = usePocketBase();
    const queryClient = useQueryClient();
    const auth = useAuth();

    return useMutation({
        mutationFn: ({ name, photoIds }: { name: string, photoIds: string[] }) => {
            return pb.collection("albums").create({
                user: auth.query.data?.id,
                name: name,
                photos: photoIds,
            });
        },
        onSuccess: () => {
            onSuccess?.();
            return queryClient.invalidateQueries({ queryKey: ["albums"] });
        },
        onError: (error) => {
            onError?.(error);
        }
    });
}