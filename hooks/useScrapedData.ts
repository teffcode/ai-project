import { useState } from "react";
import axios from "axios";

interface ScrapedFoodData {
  imageUrl?: string;
  similarImages: string[];
}

export function useScrapedData() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scrapedData, setScrapedData] = useState<ScrapedFoodData | null>(null);

  const fetchScrapedData = async (query: string) => {
    if (query.trim().length === 0) return;

    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post("/api/scraper", { url: query }, {
        headers: { "Content-Type": "application/json" }
      });
      
      setScrapedData(response.data);
      console.log("✅ Scraped food data:", response.data);
    } catch (error) {
      setError("Failed to fetch scraped data");
      console.error("❌ Error fetching scraped data:", error);
    } finally {
      setLoading(false);
    }
  };

  return { scrapedData, loading, error, fetchScrapedData };
}
