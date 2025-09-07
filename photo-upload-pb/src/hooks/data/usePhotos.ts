import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usePocketBase } from "../../context";

export const usePhotos = () => {
    const pb = usePocketBase();
    const queryClient = useQueryClient();


    const query = useQuery({
        queryKey: ["photos"],
        queryFn: async () => {
            const data = await pb.collection("photos").getFullList();
            
            for (const photo of data) {
                queryClient.setQueryData(["photos", photo.id], photo);
            }

            return data;
        },
    });

    return {...query, data: query.data || [] };
}