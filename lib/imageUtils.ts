import axios from "axios";
import path from "path";

/**
 * Checks if a given image is in SVG base64 format.
 * 
 * @param {string} image - The base64-encoded image string to check.
 * @returns {boolean} - Returns true if the image is an SVG in base64 format, false otherwise.
 */
export function isSvgBase64(image: string): boolean {
  return image.startsWith("data:image/svg+xml;base64,");
}

/**
 * Converts an image from a URL to a base64 string.
 * 
 * @param {string} imageUrl - The URL of the image to convert.
 * @returns {Promise<string>} - A base64 string representing the image.
 * @throws {Error} - Throws an error if the conversion fails.
 */
export async function imageUrlToBase64(imageUrl: string): Promise<string> {
  try {
    const response = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });

    const ext = path.extname(new URL(imageUrl).pathname).toLowerCase().replace(".", "");

    const mimeTypes: Record<string, string> = {
      png: "image/png",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      gif: "image/gif",
      webp: "image/webp",
      svg: "image/svg+xml",
    };

    const mimeType = mimeTypes[ext] || response.headers["content-type"] || "application/octet-stream";

    const base64Image = Buffer.from(response.data, "binary").toString("base64");

    return `data:${mimeType};base64,${base64Image}`;
  } catch (error) {
    console.error("❌ Error converting image URL to base64:", error);
    throw new Error("Failed to convert image URL to base64.");
  }
}
