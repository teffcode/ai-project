import Image from "next/image";
import { useState, useEffect } from "react";
import AuthGuard from "@/components/AuthGuard";
import UploadImage from "@/components/UploadImage";
import { generateImageBase64Embedding } from "@/lib/generateImageBase64Embedding";
import { useScrapedData } from "@/hooks/useScrapedData";
import { useSearchByText } from "@/hooks/useSearchByText";
import { useSearchByImage } from "@/hooks/useSearchByImage";
import { isValidUrl } from "@/utils/isValidUrl";

interface SimilarImages {
  id: number;
  image_url: string;
}

export default function Search() {
  const [query, setQuery] = useState("");
  const [embedding, setEmbedding] = useState<number[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [similarImages, setSimilarImages] = useState<SimilarImages[] | [] | null>(null);

  const { scrapedData, fetchScrapedData } = useScrapedData();
  const { embeddingByText, similarImagesByText, fetchSimilarImagesByText } = useSearchByText();
  const { embeddingByImage, similarImagesByImage, fetchSimilarImagesByImage } = useSearchByImage();

  useEffect(() => { if (similarImagesByText) setSimilarImages(similarImagesByText); }, [similarImagesByText]);
  useEffect(() => { if (embeddingByText) setEmbedding(embeddingByText); }, [embeddingByText]);
  useEffect(() => { if (similarImagesByImage) setSimilarImages(similarImagesByImage); }, [similarImagesByImage]);
  useEffect(() => { if (embeddingByImage) setEmbedding(embeddingByImage); }, [embeddingByImage]);

  const handleSearch = async () => {
    setEmbedding(null);
    setLoading(true);

    try {
      if (isValidUrl(query)) {
        console.log("🌐 Detected URL:", query);
        await fetchScrapedData(query);

        if (scrapedData?.imageUrl) {
          // TODO: review this, this needs convertion to base64
          const embeddingResult = await generateImageBase64Embedding(scrapedData.imageUrl);
          setEmbedding(embeddingResult);
          console.log("🔍 Embedding:", embeddingResult);
        }
      } else {
        console.log("🔎 Searching by text...");
        await fetchSimilarImagesByText(query);
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
      <div className="px-8 max-w-7xl w-full">
        <h1 className="text-3xl font-bold">Search</h1>
        <p>Search by text, URL, or upload an image.</p>
        <input
          type="text"
          placeholder="Search..."
          className="border p-2 mt-4 w-full"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <UploadImage onUpload={fetchSimilarImagesByImage} />

        {loading && <p className="text-gray-500 mt-2">Processing...</p>}
        
        {scrapedData && (
          <div className="mt-4 p-2 bg-gray-100 rounded">
            <p className="text-sm font-bold">🍽 Scraped Food Data:</p>
            <pre className="text-xs break-all">{JSON.stringify(scrapedData, null, 2)}</pre>
          </div>
        )}

        {embedding && (
          <div className="mt-4 p-2 bg-gray-100 h-24 rounded overflow-scroll">
            <p className="text-sm font-bold">🔍 Text Embedding:</p>
            <pre className="text-xs break-all">{JSON.stringify(embedding, null, 2)}</pre>
          </div>
        )}

        {similarImages && similarImages.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold">Similar Images</h2>
            <p>Similar images based on embeddings.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
              {similarImages.map((similarImage, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <Image
                    src={similarImage.image_url}
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
