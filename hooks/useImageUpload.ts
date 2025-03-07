import { useState } from "react";
import axios from "axios";

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [similarImages, setSimilarImages] = useState<{ id: number; imageUrl: string }[]>([]);

  const uploadImage = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.name);
    formData.append("contentType", file.type);

    try {
      const { data } = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setImageUrl(data.url);
      setSimilarImages(data.similarImages || []);
    } catch (error) {
      console.error("❌ Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  };

  return { uploading, imageUrl, similarImages, uploadImage };
}
