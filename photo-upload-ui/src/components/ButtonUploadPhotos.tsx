import { useRef } from "react";

interface ButtonUploadPhotosProps {
  show?: boolean;
  variant?: "floating" | "regular";
  className?: string;
  children?: React.ReactNode;
}

export function ButtonUploadPhotos({
  show = true,
  variant,
  className = "",
  children,
}: ButtonUploadPhotosProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // TODO: Implement file upload logic here
      console.log("Selected files:", files);
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
          className={`btn btn-primary ${className}`}
          onClick={handleUploadClick}
        >
          {children || "Upload Photos"}
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
        className="btn btn-primary btn-circle fixed bottom-6 right-6 z-50 shadow-lg"
        onClick={handleUploadClick}
        aria-label="Upload photos"
      >
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
      </button>
    </>
  );
}
