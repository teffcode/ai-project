import { NextApiRequest, NextApiResponse } from "next";
import { generateImageBase64Embedding } from "@/lib/generateImageBase64Embedding";
import { scraper } from "@/lib/scraper";
import { findSimilarImages } from "@/database/queries";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { url } = req.body;

  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "URL is required." });
  }

  try {
    console.log("🌐 Scraping...");
    const mainImageFromWebScraper = await scraper(url);
    console.log("✨ Main image from WebScraper:", mainImageFromWebScraper);

    console.log("🖼️ Generating image embedding...");
    const embedding = await generateImageBase64Embedding(mainImageFromWebScraper);
    console.log("✨ Image embedding generated:", embedding);

    console.log("🔍 Finding similar images...");
    const similarImages = await findSimilarImages(embedding, 10);
    console.log("✅ Similar images found:", similarImages);

    return res.status(200).json({ 
      success: true, 
      embedding, 
      similarImages,
      mainImageFromWebScraper,
    });
  } catch (error) {
    console.error("❌ Error searching by URL:", error);
    return res.status(500).json({ error: "Failed to search by URL" });
  }
}
