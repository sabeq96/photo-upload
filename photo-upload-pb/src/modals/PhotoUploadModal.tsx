import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { usePhotosCreate } from "../hooks";
import { ScrollPanel } from "primereact/scrollpanel";

interface Props {
  visible: boolean;
  onHide: () => void;
}

export function PhotoUploadModal({ visible, onHide }: Props) {
  const [files, setFiles] = useState<FileList | null>(null);

  const { mutate, isPending } = usePhotosCreate();

  const handleUpload = () => {
    if (files) {
      mutate(files);
    }
  };

  return (
    <Dialog header="Upload Photo" visible={visible} onHide={onHide}>
      <div className="mb-4">
        <InputText
          type="file"
          multiple
          onChange={(e) => setFiles(e.target.files || null)}
        />
      </div>

      <div className="h-72 my-4 grid grid-cols-6 gap-1 overflow-scroll">
        {Array.from(files || []).map((file) => (
          <img
            src={URL.createObjectURL(file)}
            alt={file.name}
            className="w-full h-full aspect-square object-cover"
          />
        ))}
      </div>

      <div className="flex justify-end">
        <Button label="Upload" onClick={handleUpload} loading={isPending} />
      </div>
    </Dialog>
  );
}
