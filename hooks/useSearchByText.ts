import { useState } from "react";
import axios from "axios";

interface SimilarImagesByTextResponse {
  id: number;
  image_url: string;
}

export function useSearchByText() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [embeddingByText, setEmbeddingByText] = useState<number[] | null>(null);
  const [similarImagesByText, setSimilarImagesByText] = useState<SimilarImagesByTextResponse[] | [] | null>(null);

  const fetchSimilarImagesByText = async (text: string) => {
    if (text.trim().length === 0) return;

    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post("/api/searchByText", { text }, {
        headers: { "Content-Type": "application/json" }
      });
      
      setSimilarImagesByText(response.data.similarImages);
      setEmbeddingByText(response.data.embedding);
      console.log("✅ Found similar images by text:", response.data);
    } catch (error) {
      setError("Failed to fetch similar images by text");
      console.error("❌ Error fetching similar images by text:", error);
    } finally {
      setLoading(false);
    }
  };

  return { embeddingByText, similarImagesByText, loading, error, fetchSimilarImagesByText };
}
