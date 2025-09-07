import { useQuery } from "@tanstack/react-query";
import { usePocketBase } from "../../context";

export type UsePhotoParams ={
    id: string;
}

export const usePhoto = ({ id } : UsePhotoParams) => {
    const pb = usePocketBase();

    const query = useQuery({
        queryKey: ["photos", id],
        queryFn: () => {
            return pb.collection("photos").getOne(id);
        }
    });

    return query;
}