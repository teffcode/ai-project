import { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm, Fields, Files } from "formidable";
import { convertImageFileToBase64 } from "@/lib/convertImageFileToBase64";
import { generateImageBase64Embedding } from "@/lib/generateImageBase64Embedding";
import { findSimilarImages } from "@/database/queries";
import { sendLog } from "@/pages/api/logs";

export const config = { api: { bodyParser: false } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = new IncomingForm({ multiples: false, keepExtensions: true });

  form.parse(req, async (err: Error | null, fields: Fields, files: Files) => {
    if (err) {
      return res.status(500).json({ error: "Error parsing form data" });
    }

    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!file || !file.filepath) {
      return res.status(400).json({ error: "File is required." });
    }

    try {
      sendLog("search", "📂 File received:" + file.originalFilename);
      console.log("📂 File received:", file.originalFilename);
      const fileBase64 = await convertImageFileToBase64(file.filepath);
      sendLog("search", "🚀 Base64 encoded image file: " + fileBase64);
      console.log("🚀 Base64 encoded image file: ", fileBase64);

      if (!fileBase64 || fileBase64.length === 0) {
        console.error("❌ Invalid base64 string.");
        return res.status(400).json({ error: "Invalid base64 string." });
      }

      sendLog("search", "🖼️ Generating image embedding...");
      console.log("🖼️ Generating image embedding...");
      const embedding = await generateImageBase64Embedding(fileBase64);
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
      });
    } catch (error) {
      console.error("❌ Error processing the image:", error);
      return res.status(500).json({ error: "Failed to process the image" });
    }
  });
}
