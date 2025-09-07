import { useQuery } from "@tanstack/react-query";
import { usePocketBase } from "../../context";

export interface UsePhotosParams {
    paging?: {
        page: number;
        limit: number;
    };
}

export const usePhotos = ({ paging = { page: 1, limit: 100 } } : UsePhotosParams) => {
    const pb = usePocketBase();

    const query = useQuery({
        queryKey: ["photos", paging],
        queryFn: () => {
            return pb.collection("photos").getList(paging.page, paging.limit);
        }
    });

    return query;
}