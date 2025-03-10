import { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm, Fields, Files } from "formidable";
import fs from "fs";
import { uploadSingleFileToS3 } from "@/lib/uploadSingleFileToS3";
import { generateImageBase64Embedding } from "@/lib/generateImageBase64Embedding";
import { convertImageUrlToBase64 } from "@/lib/convertImageUrlToBase64";
import { getPresignedUrl } from "@/lib/getPresignedUrl";
import { saveUploadedImage, findSimilarImages } from "@/database/queries";
import { sendLog } from "@/pages/api/logs";

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
      sendLog("upload","📂 File received:" + file.originalFilename);
      console.log("📂 File received:" + file.originalFilename);
      const fileBuffer = fs.readFileSync(file.filepath);
      const fileName = file.originalFilename || "uploaded-file";

      sendLog("upload","🚀 Uploading to S3...");
      console.log("🚀 Uploading to S3...");
      const uploadedFileUrl = await uploadSingleFileToS3(fileBuffer, fileName, file.mimetype!);
      sendLog("upload","✅ File uploaded successfully:" + uploadedFileUrl);
      console.log("✅ File uploaded successfully:" + uploadedFileUrl);

      sendLog("upload","✍🏼 Presigning URL...");
      console.log("✍🏼 Presigning URL...");
      const presignedUrl = await getPresignedUrl(AWS_S3_BUCKET_NAME as string, fileName);
      sendLog("upload","🌐 Presigned URL generated:" + presignedUrl);
      console.log("🌐 Presigned URL generated:" + presignedUrl);

      sendLog("upload","🖼️ Converting image to Base64...");
      console.log("🖼️ Converting image to Base64...");
      const imageBase64 = await convertImageUrlToBase64(presignedUrl);
      sendLog("upload","🚀 Base64 encoded image url: " + imageBase64);
      console.log("🚀 Base64 encoded image url: " + imageBase64);

      sendLog("upload","🖼️ Generating image embedding...");
      console.log("🖼️ Generating image embedding...");
      const embedding = await generateImageBase64Embedding(imageBase64);
      sendLog("upload","✨ Image embedding generated:" + embedding);
      console.log("✨ Image embedding generated:" + embedding);

      sendLog("upload","🗄️ Saving upload to database...");
      console.log("🗄️ Saving upload to database...");
      const uploadData = await saveUploadedImage(presignedUrl, embedding);
      sendLog("upload","✅ Upload saved to DB:" + uploadData);
      console.log("✅ Upload saved to DB:" + uploadData);

      sendLog("upload","🔍 Finding similar images...");
      console.log("🔍 Finding similar images...");
      const similarImages = await findSimilarImages(embedding, 10);
      sendLog("upload","✅ Similar images found:" + similarImages);
      console.log("✅ Similar images found:" + similarImages);

      return res.status(200).json({ 
        success: true, 
        presignedUrl,
        embedding, 
        similarImages 
      });
    } catch (error) {
      console.error("❌ Error uploading file to S3:", error);
      return res.status(500).json({ error: "Failed to upload file to S3" });
    }
  });
}
