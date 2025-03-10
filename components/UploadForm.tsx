import { useState } from "react";
import Button from "@/components/UI/Button";

export default function UploadForm({ onUpload }: { onUpload: (file: File) => void }) {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="flex items-center place-content-between border p-4 rounded-lg">
      <input
        id="file-upload-form"
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="hidden w-full flex items-center"
      />
      <div>
        <label
          htmlFor="file-upload-form"
          className="px-4 py-2 rounded-lg font-medium transition-all bg-gray-200 text-gray-600 hover:bg-gray-300 cursor-pointer mr-2"
        >
          Select an image
        </label>
        {file && <span className="text-gray-600 text-sm truncate max-w-[150px]">{file.name}</span>}
      </div>
      <Button
        onClick={() => file && onUpload(file)}
        variant="primary"
        disabled={!file}
      >
        Upload
      </Button>
    </div>
  );
}
