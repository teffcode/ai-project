import { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm, Fields, Files } from "formidable";
import fs from "fs";
import { uploadFileToS3 } from "@/lib/s3";
import { generateImageEmbedding } from "@/lib/generateImageEmbedding";

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
      console.log("📂 File received:", file.originalFilename);
      const fileBuffer = fs.readFileSync(file.filepath);
      const fileName = file.originalFilename || "uploaded-file";

      console.log("🚀 Uploading to S3...");
      const uploadedFileUrl = await uploadFileToS3(fileBuffer, fileName, file.mimetype!);

      console.log("✅ File uploaded successfully:", uploadedFileUrl);

      console.log("🖼️ Generating image embedding...");
      const embedding = await generateImageEmbedding(uploadedFileUrl);
      console.log("✨ Image embedding generated:", embedding);

      return res.status(200).json({ success: true, url: uploadedFileUrl, embedding });
    } catch (error) {
      console.error("❌ Error uploading file to S3:", error);
      return res.status(500).json({ error: "Failed to upload file to S3" });
    }
  });
}
