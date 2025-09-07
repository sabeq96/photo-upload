import { useFileUrl, usePhotos } from "../hooks";
import { DataScroller } from "primereact/datascroller";
import type { PhotosResponse } from "../types/pb";

export function HomePage() {
  const { data, isLoading, error } = usePhotos({
    paging: { page: 1, limit: 100 },
  });

  const { getFileThumbUrl } = useFileUrl();

  return (
    <DataScroller
      value={data?.items || []}
      itemTemplate={(item: PhotosResponse) => (
        <img
          src={getFileThumbUrl(item, item.file)}
          alt={item.file}
          className="w-full aspect-square object-cover"
        />
      )}
      rows={100}
    />
  );
}
