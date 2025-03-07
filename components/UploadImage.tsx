import { useState } from "react";

export default function UploadForm({ onUpload }: { onUpload: (file: File) => void }) {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="flex items-center border p-4 rounded">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="w-full flex items-center"
      />
      <button
        onClick={() => file && onUpload(file)}
        className="px-4 py-2 bg-sky-500 hover:bg-sky-600 disabled:bg-sky-200 disabled:cursor-not-allowed cursor-pointer rounded text-white"
        disabled={!file}
      >
        Upload
      </button>
    </div>
  );
}
