import { NextApiRequest, NextApiResponse } from "next";
import { convertImageUrlToBase64 } from "@/lib/convertImageUrlToBase64";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { url } = req.body;

  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "URL is required." });
  }

  try {
    console.log("🔄 Converting image URL to Base64...");
    const fileBase64 = await convertImageUrlToBase64(url);
    console.log("✅ Base64 encoded image:", fileBase64);

    return res.status(200).json({ success: true, fileBase64 });
  } catch (error) {
    console.error("❌ Error converting image URL:", error);
    return res.status(500).json({ error: "Failed to convert image URL to Base64" });
  }
}
