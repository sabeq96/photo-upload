import { useQuery } from "@tanstack/react-query";
import { usePocketBase } from "../../context";

export const useAlbums = () => {
    const pb = usePocketBase();

    const query = useQuery({
        queryKey: ["albums"],
        queryFn: () => {
            return pb.collection("albums").getFullList({
                expand: "photos",
            });
        }
    });

    return query;
}