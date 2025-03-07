import Image from "next/image";
import { useState, useEffect } from "react";
import AuthGuard from "@/components/AuthGuard";
import UploadImage from "@/components/UploadImage";
import { useSearchByText } from "@/hooks/useSearchByText";
import { useSearchByImage } from "@/hooks/useSearchByImage";
import { useSearchByImageUrl } from "@/hooks/useSearchByImageUrl";
import { useSearchByWebsite } from "@/hooks/useSearchByWebsite";
import { isValidUrl } from "@/utils/isValidUrl";
import { isValidImageUrl } from "@/utils/isValidImageUrl";

interface SimilarImages {
  id: number;
  image_url: string;
}

export default function Search() {
  const [query, setQuery] = useState("");
  const [embedding, setEmbedding] = useState<number[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [similarImages, setSimilarImages] = useState<SimilarImages[] | [] | null>(null);
  const [scrapedMainImage, setScrapedMainImage] = useState<string | null>(null);

  const { embeddingByText, similarImagesByText, fetchSimilarImagesByText } = useSearchByText();
  const { embeddingByImage, similarImagesByImage, fetchSimilarImagesByImage } = useSearchByImage();
  const { embeddingByImageUrl, similarImagesByImageUrl, fetchSimilarImagesByImageUrl } = useSearchByImageUrl();
  const { embeddingByWebsite, similarImagesByWebsite, fetchSimilarImagesByWebsite, mainImageFromWebScraper } = useSearchByWebsite();

  useEffect(() => { if (similarImagesByText) setSimilarImages(similarImagesByText); }, [similarImagesByText]);
  useEffect(() => { if (embeddingByText) setEmbedding(embeddingByText); }, [embeddingByText]);
  useEffect(() => { if (similarImagesByImage) setSimilarImages(similarImagesByImage); }, [similarImagesByImage]);
  useEffect(() => { if (embeddingByImage) setEmbedding(embeddingByImage); }, [embeddingByImage]);
  useEffect(() => { if (similarImagesByImageUrl) setSimilarImages(similarImagesByImageUrl); }, [similarImagesByImageUrl]);
  useEffect(() => { if (embeddingByImageUrl) setEmbedding(embeddingByImageUrl); }, [embeddingByImageUrl]);
  useEffect(() => { if (similarImagesByWebsite) setSimilarImages(similarImagesByWebsite); }, [similarImagesByWebsite]);
  useEffect(() => { if (embeddingByWebsite) setEmbedding(embeddingByWebsite); }, [embeddingByWebsite]);
  useEffect(() => { if (mainImageFromWebScraper) setScrapedMainImage(mainImageFromWebScraper); }, [mainImageFromWebScraper]);

  const handleSearch = async () => {
    setEmbedding(null);
    setLoading(true);

    try {
      if (isValidUrl(query)) {
        if (isValidImageUrl(query)) {
          console.log("🔎 Searching by image url...");
          await fetchSimilarImagesByImageUrl(query);
        } else {
          console.log("🩵 QUERYYY: ", query)
          console.log("🔎 Searching by website (scraping)...");
          await fetchSimilarImagesByWebsite(query);
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
      <section className="px-8 max-w-7xl w-full">
        <h1 className="text-3xl font-bold text-center mb-1">ChowMates 🍜🤝🏽</h1>
        <p className="text-lg text-center opacity-50"><i>Find food lovers who match your taste!</i></p>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Search</h2>
          <p>Search using text, image URL, or a website.</p>
          <input
            type="text"
            placeholder="Search..."
            className="border p-2 mt-2 w-full"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <p className="mt-4 mb-2">Alternatively, you can upload an image.</p>
          <UploadImage onUpload={fetchSimilarImagesByImage} />
        </section>

        {loading && <p className="text-gray-500 my-4">Processing...</p>}

        {(scrapedMainImage || embedding) && (
          <section className="grid grid-cols-2 gap-4 mt-8">
            <h2 className="text-2xl font-semibold mb-4">Data Overview</h2>
            {scrapedMainImage && (
              <div className="p-2 bg-gray-100 rounded">
                <p className="text-sm font-bold mb-4">🍽 Scraped image from website:</p>
                <Image
                  src={scrapedMainImage}
                  alt="Scraped main image"
                  className="w-24 h-24 object-cover rounded-full"
                  width={24}
                  height={24}
                  unoptimized
                />
              </div>
            )}

            {embedding && (
              <div className="p-2 bg-gray-100 h-24 rounded overflow-scroll">
                <p className="text-sm font-bold">🔍 Image embedding:</p>
                <pre className="text-xs break-all">{JSON.stringify(embedding, null, 2)}</pre>
              </div>
            )}
          </section>
        )}

        {similarImages && similarImages.length > 0 && (
          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Similar Images</h2>
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
          </section>
        )}
      </section>
    </AuthGuard>
  );
}
