import { NextApiRequest, NextApiResponse } from "next";
import sharp from "sharp";

/**
 * Converts an SVG image in base64 format to a PNG image in base64 format.
 * 
 * @param {string} svgBase64 - The base64 string of the SVG image.
 * @returns {Promise<string>} - A promise that resolves with the base64 string of the PNG image.
 */
export async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { svgBase64 } = req.body;

      if (!svgBase64) {
        return res.status(400).json({ error: "No SVG base64 provided" });
      }

      const buffer = Buffer.from(svgBase64, "base64");

      const pngBuffer = await sharp(buffer)
        .toFormat("png")
        .toBuffer();

      const pngBase64 = pngBuffer.toString("base64");

      return res.status(200).json({ pngBase64 });
    } catch (error) {
      console.error("Error al convertir la imagen SVG: ", error);
      return res.status(500).json({ error: "Error al convertir la imagen SVG" });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
