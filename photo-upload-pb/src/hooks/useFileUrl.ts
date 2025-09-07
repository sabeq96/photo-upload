import { useCallback } from "react";
import { usePocketBase } from "../context";

export const useFileUrl = () => {
    const pb = usePocketBase();

    const getFileUrl = useCallback((record: any, file: string) => {
        return pb.files.getURL(record, file);
    }, [pb]);

    const getFileThumbUrl = useCallback((record: any, file: string) => {
        return pb.files.getURL(record, file, { thumb: "256x256"});
    }, [pb]);

    return { getFileUrl, getFileThumbUrl };
}