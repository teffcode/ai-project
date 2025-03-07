import { NextApiRequest, NextApiResponse } from "next";
import { generateTextEmbedding } from "@/lib/generateTextEmbedding";
import { findSimilarImages } from "@/database/queries";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text } = req.body;

  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "Text is required." });
  }

  try {
    console.log("📝 Generating text embedding...");
    const embedding = await generateTextEmbedding(text);
    console.log("✨ Text embedding generated:", embedding);

    console.log("🔍 Finding similar images...");
    const similarImages = await findSimilarImages(embedding, 10);
    console.log("✅ Similar images found:", similarImages);

    return res.status(200).json({ 
      success: true, 
      embedding, 
      similarImages
    });
  } catch (error) {
    console.error("❌ Error searching by text:", error);
    return res.status(500).json({ error: "Failed to search by text" });
  }
}
