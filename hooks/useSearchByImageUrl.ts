import { useState } from "react";
import axios from "axios";

interface SimilarImagesByImageUrlResponse {
  id: number;
  image_url: string;
}

export function useSearchByImageUrl() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [embeddingByImageUrl, setEmbeddingByImageUrl] = useState<number[] | null>(null);
  const [similarImagesByImageUrl, setSimilarImagesByImageUrl] = useState<SimilarImagesByImageUrlResponse[] | [] | null>(null);

  const fetchSimilarImagesByImageUrl = async (url: string) => {
    if (url.trim().length === 0) return;

    setLoading(true);
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
      setLoading(false);
    }
  };

  return { embeddingByImageUrl, similarImagesByImageUrl, loading, error, fetchSimilarImagesByImageUrl };
}
