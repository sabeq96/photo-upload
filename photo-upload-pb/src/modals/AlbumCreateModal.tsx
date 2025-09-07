import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useMemo, useState } from "react";
import { useAlbumCreate, useFileUrl, usePhotos } from "../hooks";
import { Message } from "primereact/message";

interface Props {
  visible: boolean;
  onHide: () => void;
}

export function AlbumCreateModal({ visible, onHide }: Props) {
  const [name, setName] = useState<string | null>(null);
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<string[]>([]);

  const { getFileThumbUrl } = useFileUrl();
  const { mutate, isError, isPending, reset } = useAlbumCreate({
    onSuccess: () => handleHide(),
  });

  const { data } = usePhotos({ paging: { page: 1, limit: -1 } });

  const handlePhotoToggle = (photoId: string) => {
    setSelectedPhotoIds((prev) =>
      prev.includes(photoId)
        ? prev.filter((id) => id !== photoId)
        : [...prev, photoId]
    );
  };

  const handleCreate = () => {
    mutate({ name: name!, photoIds: selectedPhotoIds });
  };

  const handleHide = () => {
    setName(null);
    setSelectedPhotoIds([]);
    reset();
    onHide();
  };

  const photosWithoutAlbum = useMemo(
    () => data?.items.filter((photo) => !photo.album),
    [data]
  );

  return (
    <Dialog header="Create Album" visible={visible} onHide={handleHide}>
      {isError && (
        <Message
          severity="error"
          text="Error uploading photos"
          className="w-full !mb-4"
        />
      )}

      <div className="mb-4">
        <InputText
          type="text"
          placeholder="Enter album name..."
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {selectedPhotoIds.length > 0 && (
        <div className="text-sm text-gray-500 mb-4">
          {selectedPhotoIds.length} photos selected
        </div>
      )}

      <div className="h-72 my-4 grid grid-cols-6 content-start gap-1 overflow-scroll">
        {photosWithoutAlbum?.map((photo) => (
          <img
            key={photo.id}
            src={getFileThumbUrl(photo, photo.file)}
            alt={photo.file}
            className={`w-full aspect-square object-cover cursor-pointer transition-[border] duration-200 ${
              selectedPhotoIds.includes(photo.id)
                ? "border-4 border-solid"
                : "border-0"
            }`}
            onClick={() => handlePhotoToggle(photo.id)}
          />
        ))}
      </div>

      <div className="flex justify-end">
        <Button label="Create" onClick={handleCreate} loading={isPending} />
      </div>
    </Dialog>
  );
}
