import { useState } from "react";
import axios from "axios";

interface SimilarImagesByTextResponse {
  id: number;
  image: string;
}

export function useSearchByText() {
  const [loadingByText, setLoadingByText] = useState(false);
  const [errorByText, setErrorByText] = useState<string | null>(null);
  const [embeddingByText, setEmbeddingByText] = useState<number[] | null>(null);
  const [similarImagesByText, setSimilarImagesByText] = useState<SimilarImagesByTextResponse[] | [] | null>(null);
  const [timesByText, setTimesByText] = useState<Record<string, number>>({});

  const fetchSimilarImagesByText = async (text: string) => {
    if (text.trim().length === 0) return;

    setLoadingByText(true);
    setErrorByText(null);
    setTimesByText({});
    setSimilarImagesByText(null);
    
    try {
      setTimesByText((prev) => ({ ...prev, start: performance.now() }));

      const responseEmbedding = await axios.post("/api/searchByText/generate-text-embedding", { text }, {
        headers: { "Content-Type": "application/json" }
      });

      setTimesByText((prev) => ({ ...prev, uploadEnd: performance.now() }));
      const embedding = responseEmbedding.data.embedding;
      setEmbeddingByText(embedding);

      const responseImages = await axios.post("/api/searchByText/find-similar-images", { embedding }, {
        headers: { "Content-Type": "application/json" }
      });

      setTimesByText((prev) => ({ ...prev, processEnd: performance.now() }));
      
      setSimilarImagesByText(responseImages.data.similarImages);

      console.log("✅ Found similar images by text:", responseImages.data);
    } catch (error) {
      setErrorByText("Failed to fetch similar images by text");
      console.error("❌ Error fetching similar images by text:", error);
    } finally {
      setLoadingByText(false);
    }
  };

  return { embeddingByText, similarImagesByText, loadingByText, errorByText, timesByText, fetchSimilarImagesByText };
}
