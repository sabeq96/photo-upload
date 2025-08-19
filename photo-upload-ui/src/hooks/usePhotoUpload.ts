import { useState, useCallback } from "react";
import { uploadFiles, createItem } from "@directus/sdk";
import { useDirectus } from "./useDirectus";
import type { Photo } from "../generated/directusTypes";

interface UploadResult {
  success: boolean;
  uploadedPhotos?: Photo[];
  error?: string;
}

export function usePhotoUpload() {
  const directus = useDirectus();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadPhotos = useCallback(
    async (files: FileList | File[]): Promise<UploadResult> => {
      if (!files || files.length === 0) {
        return { success: false, error: "No files selected" };
      }

      setUploading(true);
      setProgress(0);

      try {
        const fileArray = Array.from(files);
        const uploadedPhotos: Photo[] = [];

        // Upload files to Directus and create photo records
        for (let i = 0; i < fileArray.length; i++) {
          const file = fileArray[i];

          // Upload file to Directus
          const formData = new FormData();
          formData.append("file", file);

          const uploadedFile = await directus.request(uploadFiles(formData));

          if (uploadedFile && uploadedFile.id) {
            // Create photo record in database
            const photo = await directus.request(
              createItem("photos", {
                photo: uploadedFile.id,
              })
            );

            uploadedPhotos.push(photo);
          }

          // Update progress
          setProgress(((i + 1) / fileArray.length) * 100);
        }

        return {
          success: true,
          uploadedPhotos,
        };
      } catch (error) {
        console.error("Upload error:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Upload failed",
        };
      } finally {
        setUploading(false);
        setProgress(0);
      }
    },
    [directus]
  );

  return {
    uploadPhotos,
    uploading,
    progress,
  };
}
