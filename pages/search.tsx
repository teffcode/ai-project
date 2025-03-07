import Image from "next/image";
import { useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import { generateImageEmbedding } from "@/lib/generateImageEmbedding";
import { generateTextEmbedding } from "@/lib/generateTextEmbedding";
import { useScrapedData } from "@/hooks/useScrapedData";

export default function Search() {
  const [query, setQuery] = useState("");
  const [embedding, setEmbedding] = useState<number[] | null>(null);
  const [loading, setLoading] = useState(false);

  const { scrapedData, fetchScrapedData } = useScrapedData();

  const similarImages = [
    "https://placekitten.com/200/300",
    "https://placekitten.com/250/350",
    "https://placekitten.com/300/400",
    "https://placekitten.com/350/450",
    "https://placekitten.com/400/500",
    "https://placekitten.com/450/550",
    "https://placekitten.com/500/600",
    "https://placekitten.com/550/650",
    "https://placekitten.com/600/700",
    "https://placekitten.com/650/750",
  ];  

  const isValidUrl = (text: string) => {
    try {
      new URL(text);
      return true;
    } catch {
      return false;
    }
  };

  const handleSearch = async () => {
    setEmbedding(null);
    setLoading(true);

    try {
      if (isValidUrl(query)) {
        console.log("🌐 Detected URL:", query);
        await fetchScrapedData(query);

        if (scrapedData?.imageUrl) {
          const embeddingResult = await generateImageEmbedding(scrapedData.imageUrl);
          setEmbedding(embeddingResult);
          console.log("🔍 Embedding:", embeddingResult);
        }
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

        {similarImages.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Similar Images</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {similarImages.map((image, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <Image
                    src={image}
                    alt={`Similar image ${index}`}
                    className="w-full h-40 object-cover"
                    width={200}
                    height={160}
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
