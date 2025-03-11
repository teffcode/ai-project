import { NextApiRequest, NextApiResponse } from "next";
import { generateImageBase64Embedding } from "@/lib/generateImageBase64Embedding";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { imageBase64 } = req.body;

  if (!imageBase64) {
    return res.status(400).json({ error: "Base64 image data is required" });
  }

  try {
    const times: Record<string, number> = {};
    const start = performance.now();

    console.log("🖼️ Generating image embedding...");
    const t4 = performance.now();
    const embedding = await generateImageBase64Embedding(imageBase64);
    times["generateEmbedding"] = performance.now() - t4;
    console.log("✨ Image embedding generated:" + embedding);

    times["total"] = performance.now() - start;
    console.log("⏱️ Total processing time:", times["total"].toFixed(2), "ms");

    return res.status(200).json({ 
      success: true, 
      embedding, 
      times,
    });
  } catch (error) {
    console.error("❌ Error uploading file to S3:", error);
    return res.status(500).json({ error: "Failed to upload file to S3" });
  }
}
