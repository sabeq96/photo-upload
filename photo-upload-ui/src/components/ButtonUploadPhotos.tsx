import { useRef } from "react";
import { usePhotoUpload } from "../hooks";

interface ButtonUploadPhotosProps {
  show?: boolean;
  variant?: "floating" | "regular";
  className?: string;
  children?: React.ReactNode;
  onUploadComplete?: () => void;
}

export function ButtonUploadPhotos({
  show = true,
  variant,
  className = "",
  children,
  onUploadComplete,
}: ButtonUploadPhotosProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadPhotos, uploading } = usePhotoUpload();

  const handleUploadClick = () => {
    if (!uploading) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const result = await uploadPhotos(files);

      if (result.success) {
        console.log("Photos uploaded successfully:", result.uploadedPhotos);
        onUploadComplete?.();
      } else {
        console.error("Upload failed:", result.error);
        // TODO: Show error to user
      }

      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  if (variant === "regular") {
    return (
      <>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          className={`btn btn-primary ${className} ${
            uploading ? "loading" : ""
          }`}
          onClick={handleUploadClick}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : children || "Upload Photos"}
        </button>
      </>
    );
  }

  if (!show) {
    return null;
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        className={`btn btn-primary btn-circle fixed bottom-6 right-6 z-50 shadow-lg ${
          uploading ? "loading" : ""
        }`}
        onClick={handleUploadClick}
        aria-label="Upload photos"
        disabled={uploading}
      >
        {!uploading && (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        )}
      </button>
    </>
  );
}
