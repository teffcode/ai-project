import axios from "axios";

/**
 * Checks if a given image URL is already in Base64 format.
 * 
 * @param {string} imageUrl - The image URL to check.
 * @returns {boolean} - Returns true if the image URL is in Base64 format, false otherwise.
 */
function isBase64(imageUrl: string): boolean {
  const base64Pattern = /^data:image\/(jpeg|png|svg\+xml);base64,/;
  return base64Pattern.test(imageUrl);
}

/**
 * Converts an image URL to a Base64 data URL format required by the embedding API.
 * 
 * @param {string} imageUrl - The URL of the image to convert.
 * @returns {Promise<string>} - A promise that resolves to the Base64-encoded image.
 * @throws {Error} - Throws an error if image fetching or conversion fails.
 */
export async function imageUrlToBase64(imageUrl: string): Promise<string> {
  if (isBase64(imageUrl)) {
    return imageUrl;
  }

  try {
    const corsProxyUrl = "https://cors-anywhere.herokuapp.com/";
    const response = await axios.get(corsProxyUrl + imageUrl, { responseType: "arraybuffer" });
    const base64 = Buffer.from(response.data, "binary").toString("base64");
    return `data:image/jpeg;base64,${base64}`;
  } catch (error) {
    console.error("❌ Error fetching or converting the image to Base64:", error);
    throw new Error("Failed to fetch image or convert it to Base64");
  }
}
