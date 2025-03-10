import Image from "next/image";
import { useState, useEffect } from "react";
import AuthGuard from "@/components/AuthGuard";
import UploadImage from "@/components/UploadImage";
import LoadingSpinner from "@/components/UI/LoadingSpinner";
import Header from "@/components/UI/Header";
import Footer from "@/components/UI/Footer";
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
  const [similarImages, setSimilarImages] = useState<SimilarImages[] | [] | null>(null);
  const [scrapedMainImage, setScrapedMainImage] = useState<string | null>(null);

  const { embeddingByText, similarImagesByText, loadingByText, fetchSimilarImagesByText } = useSearchByText();
  const { embeddingByImage, similarImagesByImage, loadingByImage, fetchSimilarImagesByImage } = useSearchByImage();
  const { embeddingByImageUrl, similarImagesByImageUrl, loadingByImageUrl, fetchSimilarImagesByImageUrl } = useSearchByImageUrl();
  const { embeddingByWebsite, similarImagesByWebsite, loadingByWebsite, fetchSimilarImagesByWebsite, mainImageFromWebScraper } = useSearchByWebsite();

  useEffect(() => { if (similarImagesByText) setSimilarImages(similarImagesByText); }, [similarImagesByText]);
  useEffect(() => { if (embeddingByText) setEmbedding(embeddingByText); }, [embeddingByText]);
  useEffect(() => { if (loadingByText) setLoading(loadingByText); }, [loadingByText]);

  useEffect(() => { if (similarImagesByImage) setSimilarImages(similarImagesByImage); }, [similarImagesByImage]);
  useEffect(() => { if (embeddingByImage) setEmbedding(embeddingByImage); }, [embeddingByImage]);
  useEffect(() => { if (loadingByImage) setLoading(loadingByImage); }, [loadingByImage]);

  useEffect(() => { if (similarImagesByImageUrl) setSimilarImages(similarImagesByImageUrl); }, [similarImagesByImageUrl]);
  useEffect(() => { if (embeddingByImageUrl) setEmbedding(embeddingByImageUrl); }, [embeddingByImageUrl]);
  useEffect(() => { if (loadingByImageUrl) setLoading(loadingByImageUrl); }, [loadingByImageUrl]);

  useEffect(() => { if (similarImagesByWebsite) setSimilarImages(similarImagesByWebsite); }, [similarImagesByWebsite]);
  useEffect(() => { if (embeddingByWebsite) setEmbedding(embeddingByWebsite); }, [embeddingByWebsite]);
  useEffect(() => { if (loadingByWebsite) setLoading(loadingByWebsite); }, [loadingByWebsite]);
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
      <section className="flex flex-col items-center flex-1 w-full">
        <section className="max-w-5xl w-full flex flex-col md:flex-row my-8 px-8">
          <div className="flex-[2] mt-12 md:mt-24 mb-0 md:mb-24">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 md:w-4/5">
              Find <span className="text-orange-400">food lovers</span> who match your taste!
            </h1>
            <p className="text-xl text-gray-400 mb-4">Search using text, image URL, or a website.</p>
            <input
              type="text"
              placeholder="Search for food lovers and dishes..."
              className="border rounded-lg px-4 py-2 w-full lg:w-4/5 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="flex-1 relative hidden md:flex">
            <Image
              src="/main-pic-1.jpg"
              alt="Scraped main image"
              className="w-full h-[400px] object-cover rounded-xl border-4 border-orange-200"
              width={100}
              height={100}
              unoptimized
            />
          </div>
        </section>

        <div className="w-full flex flex-col items-center bg-gray-50">
          <section className="max-w-5xl w-full my-12 px-8">
            <p className="text-lg mb-1 text-gray-400">Alternatively,</p>
            <h2 className="text-3xl font-bold mb-4">You can upload an image.</h2>
            <UploadImage onUpload={fetchSimilarImagesByImage} />
          </section>
        </div>
          
        {(scrapedMainImage || embedding) && (
          <section className="max-w-5xl w-full my-12 px-8">
            <h2 className="text-3xl font-bold mb-4">Data Overview</h2>
            <p className="text-xl text-gray-400 mb-4">Summary of the extracted and processed data.</p>
            <div className={`grid ${scrapedMainImage ? "grid-cols-2" : "grid-cols-1"} gap-4 mt-2`}>
              {embedding && (
                <div className="p-2 bg-gray-100 h-24 min-h-full rounded overflow-scroll">
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
          </section>
        )}

        {similarImages && similarImages.length > 0 && (
          <section className="max-w-5xl w-full my-12 px-8">
            <h2 className="text-3xl font-bold mb-4">Similar Images</h2>
            <p className="text-xl text-gray-400 mb-4">Similar images based on embeddings.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-2">
              {similarImages.map((similarImage, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <Image
                    src={similarImage.image}
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

        {loading && (!embedding || !similarImages) && <div className="py-4"><LoadingSpinner /></div>}
      </section>
      <Footer />
    </AuthGuard>
  );
}
