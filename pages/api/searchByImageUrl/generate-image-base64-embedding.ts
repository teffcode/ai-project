import { NextApiRequest, NextApiResponse } from "next";
import { generateImageBase64Embedding } from "@/lib/generateImageBase64Embedding";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { fileBase64 } = req.body;
  if (!fileBase64) {
    return res.status(400).json({ error: "Base64 image is required." });
  }

  try {
    console.log("🖼️ Generating image embedding...");
    const embedding = await generateImageBase64Embedding(fileBase64);
    console.log("✨ Image embedding generated:", embedding);

    return res.status(200).json({ success: true, embedding });
  } catch (error) {
    console.error("❌ Error generating embedding:", error);
    return res.status(500).json({ error: "Failed to generate image embedding" });
  }
}
