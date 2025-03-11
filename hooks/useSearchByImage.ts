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
  const [timesByImage, setTimesByImage] = useState<Record<string, number>>({});

  const fetchSimilarImagesByImage = async (file: File) => {
    if (!file) return;

    setLoadingByImage(true);
    setErrorByImage(null);
    setTimesByImage({});
    setSimilarImagesByImage(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.name);
    formData.append("contentType", file.type);

    try {
      setTimesByImage((prev) => ({ ...prev, start: performance.now() }));

      const responseBase64 = await axios.post(
        "/api/searchByImage/convert-image-file-to-base64",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setTimesByImage((prev) => ({ ...prev, uploadEnd: performance.now() }));

      const fileBase64 = responseBase64.data.fileBase64;
      if (!fileBase64) {
        throw new Error("Failed to convert image to Base64");
      }

      const responseEmbedding = await axios.post(
        "/api/searchByImage/generate-image-base64-embedding",
        { fileBase64: fileBase64 },
        { headers: { "Content-Type": "application/json" } }
      );
      setTimesByImage((prev) => ({ ...prev, embeddingEnd: performance.now() }));

      const embedding = responseEmbedding.data.embedding;
      setEmbeddingByImage(embedding);

      const responseSimilarImages = await axios.post(
        "/api/searchByImage/find-similar-images",
        { embedding },
        { headers: { "Content-Type": "application/json" } }
      );
      setTimesByImage((prev) => ({ ...prev, processEnd: performance.now() }));

      setSimilarImagesByImage(responseSimilarImages.data.similarImages);

      console.log("✅ Found similar images by image:", responseSimilarImages.data);
    } catch (error) {
      setErrorByImage("Failed to fetch similar images by image");
      console.error("❌ Error fetching similar images by image:", error);
    } finally {
      setLoadingByImage(false);
    }
  };

  return { embeddingByImage, similarImagesByImage, loadingByImage, errorByImage, timesByImage, fetchSimilarImagesByImage };
}
