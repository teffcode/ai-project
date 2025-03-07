import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const SNAPPR_API_URL = process.env.SNAPPR_API_URL || "https://snappr-prod--clip-sentence-transformers-fastapi-app.modal.run";
const SNAPPR_AUTH_TOKEN = process.env.SNAPPR_AUTH_TOKEN;

/**
 * Generates an embedding vector for an image using Snappr's image embedding API.
 * 
 * @param {string} imageBase64 - The base64 encoded image to generate an embedding for.
 * @returns {Promise<number[]>} - A promise that resolves to an array of numbers representing the embedding.
 * @throws {Error} - Throws an error if the API response is invalid or the embedding is not generated.
 */
export async function generateImageBase64Embedding(imageBase64: string): Promise<number[]> {
  try {
    const response = await axios.post(
      `${SNAPPR_API_URL}/embed_image`,
      { image: imageBase64 },
      {
        headers: {
          Authorization: `Bearer ${SNAPPR_AUTH_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    const embedding = response.data.embedding;

    if (!embedding) {
      throw new Error("Failed to generate image embedding");
    }

    return embedding;
  } catch (error) {
    console.error("❌ Error generating image embedding:", error);
    throw error;
  }
}
