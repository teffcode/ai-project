import fs from "fs";
import { convertSvgBase64ToImage } from "@/lib/convertSvgBase64ToImage";
import { isSvgBase64 } from "@/utils/isSvgBase64";
import { fileToBase64 } from "@/utils/fileToBase64";
import path from "path";

/**
 * Converts an image file to a base64 encoded string.
 * Handles both normal image files and SVG files.
 * 
 * @param {string} filePath - The path to the image file to convert.
 * @returns {Promise<string>} - A promise that resolves to a base64 encoded image string.
 */
export async function convertImageFileToBase64(filePath: string): Promise<string> {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase().replace(".", "");

    const mimeTypes: Record<string, string> = {
      png: "image/png",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      gif: "image/gif",
      webp: "image/webp",
      svg: "image/svg+xml",
    };

    const mimeType = mimeTypes[ext] || "application/octet-stream";

    const fileBase64 = fileToBase64(fileBuffer);
    const base64WithPrefix = `data:${mimeType};base64,${fileBase64}`;

    if (isSvgBase64(base64WithPrefix)) {
      console.log("YESSSSSSSS ✨ ", fileBase64);
      return await convertSvgBase64ToImage(fileBase64);
    }

    console.log("AHORAAAA 👽👽👽 ", base64WithPrefix);

    return base64WithPrefix;
  } catch (error) {
    console.error("❌ Error converting image file to Base64:", error);
    throw error;
  }
}
