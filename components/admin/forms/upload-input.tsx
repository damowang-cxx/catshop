"use client";

import { useRef, useState } from "react";
import { uploadAdminImage } from "lib/admin/client-actions";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

interface UploadInputProps {
  multiple?: boolean;
  disabled?: boolean;
  onUploaded: (urls: string[]) => void;
}

export default function UploadInput({
  multiple = false,
  disabled = false,
  onUploaded,
}: UploadInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) {
      return;
    }

    const fileArray = Array.from(files);
    const firstInvalidFile = fileArray.find(
      (file) => !file.type.startsWith("image/") || file.size > MAX_IMAGE_SIZE_BYTES
    );

    if (firstInvalidFile) {
      setError("Only image files up to 5MB are allowed.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const uploaded = await Promise.all(
        fileArray.map(async (file) => {
          const response = await uploadAdminImage(file);
          return response.url;
        })
      );

      onUploaded(uploaded);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } catch (uploadError) {
      const message =
        uploadError instanceof Error
          ? uploadError.message
          : "Image upload failed.";
      setError(message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label
        htmlFor="admin-image-upload"
        className="block text-sm font-medium text-gray-700"
      >
        Upload image{multiple ? "s" : ""}
      </label>
      <input
        id="admin-image-upload"
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        disabled={disabled || isUploading}
        className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-sm file:font-medium"
        onChange={(event) => handleUpload(event.target.files)}
      />
      <p className="text-xs text-gray-500">Allowed formats: image/*, up to 5MB.</p>
      {isUploading ? <p className="text-sm text-gray-600">Uploading...</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}

