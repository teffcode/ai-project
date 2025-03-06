import { useState } from "react";

export default function UploadForm({ onUpload }: { onUpload: (file: File) => void }) {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="bg-gray-800 p-4 rounded">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="w-full text-white"
      />
      <button
        onClick={() => file && onUpload(file)}
        className="mt-2 px-4 py-2 bg-green-500 hover:bg-green-600 rounded text-white"
      >
        Upload
      </button>
    </div>
  );
}
