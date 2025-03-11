import { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm, Fields, Files } from "formidable";
import { convertImageFileToBase64 } from "@/lib/convertImageFileToBase64";

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
      const fileBase64 = await convertImageFileToBase64(file.filepath);
      console.log("🚀 Base64 encoded image file: ", fileBase64);

      if (!fileBase64 || fileBase64.length === 0) {
        return res.status(400).json({ error: "Invalid base64 string." });
      }

      return res.status(200).json({ success: true, fileBase64 });
    } catch (error) {
      console.error("❌ Error converting image:", error);
      return res.status(500).json({ error: "Failed to convert image to Base64" });
    }
  });
}
