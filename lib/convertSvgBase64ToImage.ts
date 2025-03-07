import sharp from "sharp";

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
    const base64WithPrefix = svgBase64.startsWith("data:image/svg+xml;base64,") 
      ? svgBase64 
      : `data:image/svg+xml;base64,${svgBase64}`;

    const buffer = Buffer.from(base64WithPrefix.split(",")[1], "base64");

    const pngBuffer = await sharp(buffer)
      .toFormat("png")
      .toBuffer();

    const pngBase64 = pngBuffer.toString("base64");

    const pngBase64WithPrefix = pngBase64.startsWith("data:image/png;base64,")
      ? pngBase64
      : `data:image/png;base64,${pngBase64}`;

    return pngBase64WithPrefix;
  } catch (error) {
    console.error("❌ Error converting SVG to PNG:", error);
    throw new Error("Failed to convert SVG to PNG.");
  }
}
