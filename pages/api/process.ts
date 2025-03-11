import { NextApiRequest, NextApiResponse } from "next";
import { generateImageBase64Embedding } from "@/lib/generateImageBase64Embedding";
import { convertImageUrlToBase64 } from "@/lib/convertImageUrlToBase64";
import { saveUploadedImage, findSimilarImages } from "@/database/queries";

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

    console.log("🖼️ Generating image embedding...");
    const t4 = performance.now();
    const embedding = await generateImageBase64Embedding(imageBase64);
    times["generateEmbedding"] = performance.now() - t4;
    console.log("✨ Image embedding generated:" + embedding);

    console.log("🗄️ Saving upload to database...");
    const t5 = performance.now();
    const uploadData = await saveUploadedImage(presignedUrl, embedding);
    times["saveToDatabase"] = performance.now() - t5;
    console.log("✅ Upload saved to DB:" + uploadData);

    console.log("🔍 Finding similar images...");
    const t6 = performance.now();
    const similarImages = await findSimilarImages(embedding, 10);
    times["findSimilarImages"] = performance.now() - t6;
    console.log("✅ Similar images found:" + similarImages);

    times["total"] = performance.now() - start;
    console.log("⏱️ Total processing time:", times["total"].toFixed(2), "ms");

    return res.status(200).json({ 
      success: true, 
      embedding, 
      similarImages,
      times,
    });
  } catch (error) {
    console.error("❌ Error uploading file to S3:", error);
    return res.status(500).json({ error: "Failed to upload file to S3" });
  }
}
