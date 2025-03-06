import Image from "next/image";
import { useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import UploadForm from "@/components/UploadForm";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Upload() {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.name);
    formData.append("contentType", file.type);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      setImageUrl(data.url);
    } catch (error) {
      console.error("❌ Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <AuthGuard>
      <div>
        <h1 className="text-3xl font-bold mb-4">Upload an Image</h1>
        <UploadForm onUpload={handleUpload} />
        {uploading && <LoadingSpinner />}
        {imageUrl && (
          <div className="mt-4">
            <p className="text-green-500">Uploaded successfully!</p>
            <Image
              src={imageUrl}
              alt="Uploaded image"
              className="w-full h-56 object-cover"
              width={24}
              height={24}
              unoptimized
            />
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
