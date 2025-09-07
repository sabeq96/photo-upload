import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePocketBase } from "../../context";
import { useAuth } from "./useAuth";
import type { BatchService } from "pocketbase";

interface UsePhotosProps {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}

export function usePhotosCreate({ onSuccess, onError }: UsePhotosProps) {
    const pb = usePocketBase();
    const queryClient = useQueryClient();
    const auth = useAuth();

    function createPhotoBatch(batch: BatchService, file: File) {
        batch.collection("photos").create({
            user: auth.query.data?.id,
            file: file,
        });
    }
    
    return useMutation({
        mutationFn: (files: FileList) => {
            const batch = pb.createBatch();

            for (const file of files) {
                createPhotoBatch(batch, file);
            }

            return batch.send();
        },
        onSuccess: () => {
            onSuccess?.();
            return queryClient.invalidateQueries({ queryKey: ["photos"] });
        },
        onError: (error) => {
            onError?.(error);
        }
    });
}