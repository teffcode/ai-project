import { NextApiRequest, NextApiResponse } from "next";
import { convertImageUrlToBase64 } from "@/lib/convertImageUrlToBase64";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { presignedUrl } = req.body;

  if (!presignedUrl) {
    return res.status(400).json({ error: "Presigned URL is required" });
  }

  try {
    const times: Record<string, number> = {};
    const start = performance.now();

    console.log("🖼️ Converting image to Base64...");
    const t3 = performance.now();
    const imageBase64 = await convertImageUrlToBase64(presignedUrl);
    times["convertToBase64"] = performance.now() - t3;
    console.log("🚀 Base64 encoded image url: " + imageBase64);

    times["total"] = performance.now() - start;
    console.log("⏱️ Total processing time:", times["total"].toFixed(2), "ms");

    return res.status(200).json({ 
      success: true, 
      imageBase64, 
      times,
    });
  } catch (error) {
    console.error("❌ Error uploading file to S3:", error);
    return res.status(500).json({ error: "Failed to upload file to S3" });
  }
}
