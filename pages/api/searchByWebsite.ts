import { NextApiRequest, NextApiResponse } from "next";
import { generateImageBase64Embedding } from "@/lib/generateImageBase64Embedding";
import { scraper } from "@/lib/scraper";
import { convertSvgBase64ToImage } from "@/lib/convertSvgBase64ToImage";
import { findSimilarImages } from "@/database/queries";
import { sendLog } from "@/pages/api/logs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { websiteUrl } = req.body;

  if (!websiteUrl || typeof websiteUrl !== "string") {
    return res.status(400).json({ error: "URL is required." });
  }

  try {
    sendLog("search", "🌐 Scraping...");
    console.log("🌐 Scraping...");
    const mainImageFromWebScraper = await scraper(websiteUrl);
    sendLog("search", "✨ Main image from WebScraper:" + mainImageFromWebScraper);
    console.log("✨ Main image from WebScraper:", mainImageFromWebScraper);

    sendLog("search", "🖼️ Converting image to Base64...");
    console.log("🖼️ Converting image to Base64...");
    const imageBase64 = await convertSvgBase64ToImage(mainImageFromWebScraper);
    sendLog("search", "🚀 Base64 encoded image url: " + imageBase64);
    console.log("🚀 Base64 encoded image url: ", imageBase64);

    sendLog("search", "🖼️ Generating image embedding...");
    console.log("🖼️ Generating image embedding...");
    const embedding = await generateImageBase64Embedding(imageBase64);
    sendLog("search", "✨ Image embedding generated:" + embedding);
    console.log("✨ Image embedding generated:", embedding);

    sendLog("search", "🔍 Finding similar images...");
    console.log("🔍 Finding similar images...");
    const similarImages = await findSimilarImages(embedding, 10);
    sendLog("search", "✅ Similar images found:" + similarImages);
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
