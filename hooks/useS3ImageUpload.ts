import { useState } from "react";
import axios from "axios";

export function useS3ImageUpload() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [presignedImageUrl, setPresignedImageUrl] = useState<string | null>(null);
  const [similarImages, setSimilarImages] = useState<{ id: number; image_url: string }[]>([]);

  const fetchUploadImage = async (file: File) => {
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();

    formData.append("file", file);
    formData.append("fileName", file.name);
    formData.append("contentType", file.type);

    try {
      const { data } = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSimilarImages(data.similarImages || []);
      setPresignedImageUrl(data.presignedUrl);
    } catch (error) {
      console.error("❌ Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };

  return { presignedImageUrl, similarImages, loading, error, fetchUploadImage };
}
