import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { usePhotosCreate } from "../hooks";
import { Message } from "primereact/message";

interface Props {
  visible: boolean;
  onHide: () => void;
}

export function PhotoUploadModal({ visible, onHide }: Props) {
  const [files, setFiles] = useState<FileList | null>(null);

  const { mutate, isError, isPending, reset } = usePhotosCreate({
    onSuccess: () => handleHide(),
  });

  const handleUpload = () => {
    mutate(files!);
  };

  const handleHide = () => {
    setFiles(null);
    reset();
    onHide();
  };

  return (
    <Dialog header="Upload Photo" visible={visible} onHide={handleHide}>
      {isError && (
        <Message
          severity="error"
          text="Error uploading photos"
          className="w-full !mb-4"
        />
      )}

      <div className="mb-4">
        <InputText
          type="file"
          multiple
          onChange={(e) => setFiles(e.target.files || null)}
        />
      </div>

      <div className="h-72 my-4 grid grid-cols-6 content-start gap-1 overflow-scroll">
        {Array.from(files || []).map((file) => (
          <img
            key={file.name}
            src={URL.createObjectURL(file)}
            alt={file.name}
            className="w-full aspect-square object-cover"
          />
        ))}
      </div>

      <div className="flex justify-end">
        <Button label="Upload" onClick={handleUpload} loading={isPending} />
      </div>
    </Dialog>
  );
}
