import { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm, Fields, Files } from "formidable";
import fs from "fs";
import { uploadSingleFileToS3 } from "@/lib/uploadSingleFileToS3";
import { generateImageBase64Embedding } from "@/lib/generateImageBase64Embedding";
import { convertImageUrlToBase64 } from "@/lib/convertImageUrlToBase64";
import { getPresignedUrl } from "@/lib/getPresignedUrl";
import { saveUploadedImage, findSimilarImages } from "@/database/queries";

const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || "software-engineer-interview-test-bucket-1";

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
      const times: Record<string, number> = {};
      const start = performance.now();

      console.log("📂 File received:" + file.originalFilename);
      const fileBuffer = fs.readFileSync(file.filepath);
      const fileName = file.originalFilename || "uploaded-file";

      times["start"] = performance.now() - start; // Timing

      console.log("🚀 Uploading to S3...");
      const t1 = performance.now();
      const uploadedFileUrl = await uploadSingleFileToS3(fileBuffer, fileName, file.mimetype!);
      times["uploadToS3"] = performance.now() - t1;
      console.log("✅ File uploaded successfully:" + uploadedFileUrl);

      console.log("✍🏼 Presigning URL...");
      const t2 = performance.now();
      const presignedUrl = await getPresignedUrl(AWS_S3_BUCKET_NAME as string, fileName);
      times["presignUrl"] = performance.now() - t2;
      console.log("🌐 Presigned URL generated:" + presignedUrl);

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
        presignedUrl,
        embedding, 
        similarImages,
        times,
      });
    } catch (error) {
      console.error("❌ Error uploading file to S3:", error);
      return res.status(500).json({ error: "Failed to upload file to S3" });
    }
  });
}
