import { useAlbums, usePhotos } from "../hooks";
import { Panel } from "primereact/panel";
import { PhotoPreview } from "../components";
import { useMemo } from "react";

export function HomePage() {
  const { data: albums } = useAlbums();
  const { data: photos } = usePhotos();

  const photosWithoutAlbum = useMemo(() => {
    const flatAlbums = albums.flatMap((album) => album.photos);

    return photos?.filter((photo) => !flatAlbums.includes(photo.id)) || [];
  }, [photos, albums]);

  return (
    <>
      <Panel header="Albums" toggleable>
        <div className="grid grid-cols-4 gap-2">
          {albums.map((album) => (
            <div key={album.id}>
              <PhotoPreview id={album.photos[0]} />
              <div className="mt-2">{album.name}</div>
            </div>
          ))}
        </div>
      </Panel>
      <Panel header="Photos" toggleable>
        {photosWithoutAlbum.map((photo) => (
          <PhotoPreview key={photo.id} id={photo.id} />
        ))}
      </Panel>
    </>
  );
}
