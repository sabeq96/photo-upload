import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usePocketBase } from "../../context";

export interface UsePhotosParams {
    paging?: {
        page: number;
        limit: number;
    };
}

export const usePhotos = ({ paging = { page: 1, limit: 100 } } : UsePhotosParams) => {
    const pb = usePocketBase();
    const queryClient = useQueryClient();
    
    const query = useQuery({
        queryKey: ["photos", paging],
        queryFn: async () => {
            const data = await pb.collection("photos").getList(paging.page, paging.limit);
            
            for (const photo of data.items) {
                queryClient.setQueryData(["photos", photo.id], photo);
            }

            return data;
        },
    });

    return query;
}