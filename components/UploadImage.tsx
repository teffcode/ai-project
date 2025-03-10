import { useState } from "react";
import Button from "@/components/UI/Button";

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
