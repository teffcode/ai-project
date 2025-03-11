import { useState } from "react";
import axios from "axios";

interface SimilarImagesByImageResponse {
  id: number;
  image: string;
}

export function useSearchByImage() {
  const [loadingByImage, setLoadingByImage] = useState(false);
  const [errorByImage, setErrorByImage] = useState<string | null>(null);
  const [embeddingByImage, setEmbeddingByImage] = useState<number[] | null>(null);
  const [similarImagesByImage, setSimilarImagesByImage] = useState<SimilarImagesByImageResponse[] | [] | null>(null);

  const fetchSimilarImagesByImage = async (file: File) => {
    if (!file) return;

    setLoadingByImage(true);
    setErrorByImage(null);

    const formData = new FormData();

    formData.append("file", file);
    formData.append("fileName", file.name);
    formData.append("contentType", file.type);

    try {
      const { data } = await axios.post("/api/searchByImage", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSimilarImagesByImage(data.similarImages);
      setEmbeddingByImage(data.embedding);
      console.log("✅ Found similar images by image:", data);
    } catch (error) {
      setErrorByImage("Failed to fetch similar images by image");
      console.error("❌ Error fetching similar images by image:", error);
    } finally {
      setLoadingByImage(false);
    }
  };

  return { embeddingByImage, similarImagesByImage, loadingByImage, errorByImage, fetchSimilarImagesByImage };
}
