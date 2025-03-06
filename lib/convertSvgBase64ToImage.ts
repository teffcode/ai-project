import axios from "axios";

/**
 * Converts an SVG image in base64 format to a PNG image in base64 format by making a request
 * to the server-side API.
 * 
 * @param {string} svgBase64 - The base64 string of the SVG image.
 * @returns {Promise<string>} - A promise that resolves with the base64 string of the PNG image.
 * @throws {Error} - Throws an error if the API request fails or the conversion fails.
 */
export async function convertSvgBase64ToImage(svgBase64: string): Promise<string> {
  try {
    const response = await axios.post("/api/convertSvgBase64ToImage", {
      svgBase64,
    });

    const { pngBase64 } = response.data;

    return pngBase64;
  } catch (error) {
    console.error("❌ Error converting SVG to PNG via API:", error);
    throw new Error("Failed to convert SVG to PNG via API.");
  }
}
