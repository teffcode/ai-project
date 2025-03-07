import { useState } from "react";
import axios from "axios";

interface SimilarImagesByImageUrlResponse {
  id: number;
  image_url: string;
}

export function useSearchByImageUrl() {
  const [loadingByImageUrl, setLoadingByImageUrl] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [embeddingByImageUrl, setEmbeddingByImageUrl] = useState<number[] | null>(null);
  const [similarImagesByImageUrl, setSimilarImagesByImageUrl] = useState<SimilarImagesByImageUrlResponse[] | [] | null>(null);

  const fetchSimilarImagesByImageUrl = async (url: string) => {
    if (url.trim().length === 0) return;

    setLoadingByImageUrl(true);
    setError(null);
    
    try {
      const response = await axios.post("/api/searchByImageUrl", { url }, {
        headers: { "Content-Type": "application/json" }
      });

      setSimilarImagesByImageUrl(response.data.similarImages);
      setEmbeddingByImageUrl(response.data.embedding);
      console.log("✅ Found similar images by URL:", response.data);
    } catch (error) {
      setError("Failed to fetch similar images by URL");
      console.error("❌ Error fetching similar images by URL:", error);
    } finally {
      setLoadingByImageUrl(false);
    }
  };

  return { embeddingByImageUrl, similarImagesByImageUrl, loadingByImageUrl, error, fetchSimilarImagesByImageUrl };
}
