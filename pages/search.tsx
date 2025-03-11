import Image from "next/image";
import { useState, useEffect } from "react";
import AuthGuard from "@/components/AuthGuard";
import UploadImage from "@/components/UploadImage";
import LoadingSpinner from "@/components/UI/LoadingSpinner";
import Header from "@/components/UI/Header";
import Footer from "@/components/UI/Footer";
import MainSection from "@/components/UI/MainSection";
import BodySection from "@/components/UI/BodySection";
import SectionHeader from "@/components/UI/SectionHeader";
import Notification from "@/components/UI/Notification";
import { useSearchByText } from "@/hooks/useSearchByText";
import { useSearchByImage } from "@/hooks/useSearchByImage";
import { useSearchByImageUrl } from "@/hooks/useSearchByImageUrl";
import { useSearchByWebsite } from "@/hooks/useSearchByWebsite";
import { isValidUrl } from "@/utils/isValidUrl";
import { isValidImageUrl } from "@/utils/isValidImageUrl";

interface SimilarImages {
  id: number;
  image: string;
}

export default function Search() {
  const [query, setQuery] = useState("");
  const [embedding, setEmbedding] = useState<number[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [similarImages, setSimilarImages] = useState<SimilarImages[] | [] | null>(null);
  const [scrapedMainImage, setScrapedMainImage] = useState<string | null>(null);
  const [times, setTimes] = useState<Record<string, number>>({});

  const { embeddingByText, similarImagesByText, loadingByText, errorByText, timesByText, fetchSimilarImagesByText } = useSearchByText();
  const { embeddingByImage, similarImagesByImage, loadingByImage, errorByImage, fetchSimilarImagesByImage } = useSearchByImage();
  const { embeddingByImageUrl, similarImagesByImageUrl, loadingByImageUrl, errorByImageUrl, fetchSimilarImagesByImageUrl } = useSearchByImageUrl();
  const { embeddingByWebsite, similarImagesByWebsite, loadingByWebsite, errorByWebsite, fetchSimilarImagesByWebsite, mainImageFromWebScraper } = useSearchByWebsite();

  useEffect(() => { if (similarImagesByText) setSimilarImages(similarImagesByText); }, [similarImagesByText]);
  useEffect(() => { if (embeddingByText) setEmbedding(embeddingByText); }, [embeddingByText]);
  useEffect(() => { if (loadingByText) setLoading(loadingByText); }, [loadingByText]);
  useEffect(() => { if (loadingByText) setLoading(loadingByText); }, [loadingByText]);
  useEffect(() => { if (errorByText) setError(errorByText); }, [errorByText]);
  useEffect(() => { if (timesByText) setTimes(timesByText); }, [timesByText]);

  useEffect(() => { if (similarImagesByImage) setSimilarImages(similarImagesByImage); }, [similarImagesByImage]);
  useEffect(() => { if (embeddingByImage) setEmbedding(embeddingByImage); }, [embeddingByImage]);
  useEffect(() => { if (loadingByImage) setLoading(loadingByImage); }, [loadingByImage]);
  useEffect(() => { if (errorByImage) setError(errorByImage); }, [errorByImage]);

  useEffect(() => { if (similarImagesByImageUrl) setSimilarImages(similarImagesByImageUrl); }, [similarImagesByImageUrl]);
  useEffect(() => { if (embeddingByImageUrl) setEmbedding(embeddingByImageUrl); }, [embeddingByImageUrl]);
  useEffect(() => { if (loadingByImageUrl) setLoading(loadingByImageUrl); }, [loadingByImageUrl]);
  useEffect(() => { if (errorByImageUrl) setError(errorByImageUrl); }, [errorByImageUrl]);

  useEffect(() => { if (similarImagesByWebsite) setSimilarImages(similarImagesByWebsite); }, [similarImagesByWebsite]);
  useEffect(() => { if (embeddingByWebsite) setEmbedding(embeddingByWebsite); }, [embeddingByWebsite]);
  useEffect(() => { if (loadingByWebsite) setLoading(loadingByWebsite); }, [loadingByWebsite]);
  useEffect(() => { if (mainImageFromWebScraper) setScrapedMainImage(mainImageFromWebScraper); }, [mainImageFromWebScraper]);
  useEffect(() => { if (errorByWebsite) setError(errorByWebsite); }, [errorByWebsite]);

  const handleSearch = async () => {
    setEmbedding(null);
    setLoading(true);

    try {
      if (isValidUrl(query)) {
        if (isValidImageUrl(query)) {
          console.log("🔎 Searching by image url...");
          await fetchSimilarImagesByImageUrl(query);
        } else {
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
      <Header />

      <div className="flex-1 max-w-5xl w-full">
        <MainSection
          title="Find food lovers who match your taste!"
          highlight="food lovers"
          description="Search by text, URL, or website."
          imageSrc="/main-pic-1.jpg"
        >
          <input
            type="text"
            placeholder="Type a keyword or paste a link..."
            className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <p className="text-lg text-gray-500 mt-6 mb-2">Upload an image to start.</p>
          <UploadImage onUpload={fetchSimilarImagesByImage} />
        </MainSection>

        {loading && (!embedding || !similarImages) && <div className="py-4"><LoadingSpinner /></div>}

        {error ? (
          <Notification type="error" message={error || "An unexpected error occurred"} />
        ) : (
          <>
            {similarImages && similarImages.length > 0 && (
              <Notification
                type="info"
                message={`Similar images found! 🔍 The total process took: ${(((times.processEnd - times.start) / 1000) / 60).toFixed(2)}min 🎉`}
              />
            )}

            {similarImages && similarImages.length > 0 && (
              <BodySection>
                <SectionHeader
                  title="Discover visually similar images"
                  highlight="similar images"
                  description="Similar images"
                />
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {similarImages.map((similarImage, index) => (
                    <div key={index} className="border border-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={similarImage.image}
                        alt={`Similar image ${index}`}
                        className="w-full h-40 object-cover"
                        width={200}
                        height={40}
                        unoptimized
                      />
                    </div>
                  ))}
                </div>
              </BodySection>
            )}

            {(scrapedMainImage || embedding) && (
              <BodySection>
                <SectionHeader
                  title="Summary of the extracted and processed data"
                  highlight="Summary"
                  description="Data Overview"
                />
                <div className={`grid ${scrapedMainImage ? "grid-cols-2" : "grid-cols-1"} gap-4`}>
                  {embedding && (
                    <div className="p-2 bg-gray-100 h-24 min-h-full rounded-lg overflow-scroll">
                      <p className="text-sm font-bold">🔍 Image embedding:</p>
                      <pre className="text-xs break-all">{JSON.stringify(embedding, null, 2)}</pre>
                    </div>
                  )}

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
                </div>
              </BodySection>
            )}
          </>
        )}
      </div>

      <Footer />
    </AuthGuard>
  );
}
