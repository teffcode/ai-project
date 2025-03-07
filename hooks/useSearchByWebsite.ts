import { useState } from "react";
import axios from "axios";

interface SimilarImagesByWebsiteResponse {
  id: number;
  image: string;
}

export function useSearchByWebsite() {
  const [loadingByWebsite, setLoadingByWebsite] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [embeddingByWebsite, setEmbeddingByWebsite] = useState<number[] | null>(null);
  const [similarImagesByWebsite, setSimilarImagesByWebsite] = useState<SimilarImagesByWebsiteResponse[] | [] | null>(null);
  const [mainImageFromWebScraper, setMainImageFromWebScraper] = useState<string | null>(null);

  const fetchSimilarImagesByWebsite = async (websiteUrl: string) => {
    if (websiteUrl.trim().length === 0) return;

    setLoadingByWebsite(true);
    setError(null);

    try {
      const response = await axios.post("/api/searchByWebsite", { websiteUrl }, {
        headers: { "Content-Type": "application/json" }
      });
      
      setSimilarImagesByWebsite(response.data.similarImages);
      setEmbeddingByWebsite(response.data.embedding);
      setMainImageFromWebScraper(response.data.mainImageFromWebScraper);
      console.log("✅ Found similar images by website:", response.data);
    } catch (error) {
      setError("Failed to fetch similar images by website");
      console.error("❌ Error fetching similar images by website:", error);
    } finally {
      setLoadingByWebsite(false);
    }
  };

  return { 
    embeddingByWebsite, 
    similarImagesByWebsite, 
    loadingByWebsite, 
    error, 
    fetchSimilarImagesByWebsite,
    mainImageFromWebScraper 
  };  
}
