import { convertSvgBase64ToImage } from "@/lib/convertSvgBase64ToImage";
import { isSvgBase64 } from "@/utils/isSvgBase64";
import { imageUrlToBase64 } from "@/utils/imageUrlToBase64";

/**
 * Converts an image URL to a base64 encoded string.
 * Handles both normal images and SVG images.
 * 
 * @param {string} imageUrl - The URL of the image to convert.
 * @returns {Promise<string>} - A promise that resolves to a base64 encoded image string.
 */
export async function convertImageUrlToBase64(imageUrl: string): Promise<string> {
  try {
    const imageBase64 = await imageUrlToBase64(imageUrl);

    if (isSvgBase64(imageBase64)) {
      return await convertSvgBase64ToImage(imageBase64);
    }

    return imageBase64;
  } catch (error) {
    console.error("❌ Error converting image to Base64:", error);
    throw error;
  }
}
