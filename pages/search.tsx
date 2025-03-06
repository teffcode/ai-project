import { useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import { generateImageEmbedding } from "@/lib/generateImageEmbedding";
import { generateTextEmbedding } from "@/lib/generateTextEmbedding";

interface ScrapedFoodData {
  imageUrl?: string;
  similarImages: string[]; 
}

export default function Search() {
  const [query, setQuery] = useState("");
  const [embedding, setEmbedding] = useState<number[] | null>(null);
  const [scrapedData, setScrapedData] = useState<ScrapedFoodData | null>(null);
  const [loading, setLoading] = useState(false);

  const isValidUrl = (text: string) => {
    try {
      new URL(text);
      return true;
    } catch {
      return false;
    }
  };

  const fetchScrapedData = async () => {
    if (query.trim().length === 0) return;

    try {
      const response = await fetch("/api/scraper", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: query }),
      });
  
      const data = await response.json();
  
      if (data.error) {
        console.error("Error:", data.error);
      } else {
        console.log("✅ Scraped food data:", data);
      }

      return data;
    } catch (error) {
      console.error("❌ Error fetching scraped data:", error);
    }
  };

  const handleSearch = async () => {
    setEmbedding(null);
    setScrapedData(null);
    setLoading(true);

    try {
      if (isValidUrl(query)) {
        console.log("🌐 Detected URL:", query);
        const scrapedResult = await fetchScrapedData();
        setScrapedData(scrapedResult);
        console.log("🍽 Scraped Data:", scrapedResult);
        const embeddingResult = await generateImageEmbedding(scrapedResult.imageUrl);
        setEmbedding(embeddingResult);
        console.log("🔍 Embedding:", embeddingResult);
      } else {
        const embeddingResult = await generateTextEmbedding(query);
        setEmbedding(embeddingResult);
        console.log("🔍 Embedding:", embeddingResult);
      }
    } catch (error) {
      console.error("❌ Error processing input:", error);
    }

    setLoading(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <AuthGuard>
      <div className="p-4">
        <h1 className="text-2xl">Search Page</h1>
        <input
          type="text"
          placeholder="Search..."
          className="border p-2 mt-4 w-full"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        {loading && <p className="text-gray-500 mt-2">Processing...</p>}
        
        {scrapedData && (
          <div className="mt-4 p-2 bg-gray-100 rounded">
            <p className="text-sm font-bold">🍽 Scraped Food Data:</p>
            <pre className="text-xs break-all">{JSON.stringify(scrapedData, null, 2)}</pre>
          </div>
        )}

        {embedding && (
          <div className="mt-4 p-2 bg-gray-100 rounded">
            <p className="text-sm font-bold">🔍 Text Embedding:</p>
            <pre className="text-xs break-all">{JSON.stringify(embedding, null, 2)}</pre>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
