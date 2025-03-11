import { useState } from "react";
import axios from "axios";

interface SimilarImagesByImageUrlResponse {
  id: number;
  image: string;
}

export function useSearchByImageUrl() {
  const [loadingByImageUrl, setLoadingByImageUrl] = useState(false);
  const [errorByImageUrl, setErrorByImageUrl] = useState<string | null>(null);
  const [embeddingByImageUrl, setEmbeddingByImageUrl] = useState<number[] | null>(null);
  const [similarImagesByImageUrl, setSimilarImagesByImageUrl] = useState<SimilarImagesByImageUrlResponse[] | [] | null>(null);
  const [timesByImageUrl, setTimesByImageUrl] = useState<Record<string, number>>({});

  const fetchSimilarImagesByImageUrl = async (url: string) => {
    if (url.trim().length === 0) return;

    setLoadingByImageUrl(true);
    setErrorByImageUrl(null);
    setEmbeddingByImageUrl(null);
    setTimesByImageUrl({});
    setSimilarImagesByImageUrl(null);

    try {
      setTimesByImageUrl((prev) => ({ ...prev, start: performance.now() }));

      const responseBase64 = await axios.post("/api/searchByImageUrl/convert-image-url-to-base64", { url });

      setTimesByImageUrl((prev) => ({ ...prev, uploadEnd: performance.now() }));

      const fileBase64 = responseBase64.data.fileBase64;

      if (!fileBase64) {
        throw new Error("Base64 conversion failed");
      }

      const responseEmbedding = await axios.post("/api/searchByImageUrl/generate-image-base64-embedding", { fileBase64: fileBase64 });
      setTimesByImageUrl((prev) => ({ ...prev, embeddingEnd: performance.now() }));

      const embedding = responseEmbedding.data.embedding;

      if (!embedding) {
        throw new Error("Embedding generation failed");
      }
      setEmbeddingByImageUrl(embedding);

      const responseSimilarImages = await axios.post("/api/searchByImageUrl/find-similar-images", { embedding });
      setTimesByImageUrl((prev) => ({ ...prev, processEnd: performance.now() }));

      setSimilarImagesByImageUrl(responseSimilarImages.data.similarImages);

      console.log("✅ Found similar images by URL:", responseSimilarImages.data);
    } catch (error) {
      setErrorByImageUrl("Failed to fetch similar images by URL");
      console.error("❌ Error fetching similar images by URL:", error);
    } finally {
      setLoadingByImageUrl(false);
    }
  };

  return { embeddingByImageUrl, similarImagesByImageUrl, loadingByImageUrl, errorByImageUrl, timesByImageUrl, fetchSimilarImagesByImageUrl };
}
