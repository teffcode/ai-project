import { NextApiRequest, NextApiResponse } from "next";
import { generateTextEmbedding } from "@/lib/generateTextEmbedding";

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

    return res.status(200).json({ 
      success: true, 
      embedding,
    });
  } catch (error) {
    console.error("❌ Error searching by text:", error);
    return res.status(500).json({ error: "Failed to search by text" });
  }
}
