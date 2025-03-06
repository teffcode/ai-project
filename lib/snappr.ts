import axios from "axios";
import { imageUrlToBase64 } from "@/pages/api/imageUrlToBase64";

const SNAPPR_API_URL = "https://snappr-prod--clip-sentence-transformers-fastapi-app.modal.run";
const SNAPPR_AUTH_TOKEN = "Bearer iegom5neF0wai6Aequ4ohw9Thae3rahk4iexiej8";

/**
 * Generates an embedding vector for a given text using Snappr's API.
 * 
 * @param {string} text - The input text to generate an embedding for.
 * @returns {Promise<number[]>} - A promise that resolves to an array of numbers representing the embedding.
 * @throws {Error} - Throws an error if embedding generation fails.
 */
export async function generateTextEmbedding(text: string): Promise<number[]> {
  try {
    const response = await axios.post(
      `${SNAPPR_API_URL}/embed_text`,
      { text },
      {
        headers: {
          Authorization: SNAPPR_AUTH_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    const embedding = response.data.embedding;

    if (!embedding) {
      throw new Error("Failed to generate text embedding");
    }

    return embedding;
  } catch (error) {
    console.error("❌ Error generating text embedding:", error);
    throw error;
  }
}

/**
 * Generates an embedding vector for an image using Snappr's image embedding API.
 * 
 * @param {string} imageUrl - The URL of the image to generate an embedding for.
 * @returns {Promise<number[]>} - A promise that resolves to an array of numbers representing the embedding.
 * @throws {Error} - Throws an error if the API response is invalid or the embedding is not generated.
 */
export async function generateImageEmbedding(imageUrl: string): Promise<number[]> {
  console.log("🩵🩵🩵🩵imageUrl: ", imageUrl)
  try {
    //const imageBase64 = await imageUrlToBase64(imageUrl);

    const response = await axios.post(
      `${SNAPPR_API_URL}/embed_image`,
      { image: imageUrl },
      {
        headers: {
          Authorization: SNAPPR_AUTH_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    const embedding = response.data.embedding;
    console.log("💜 EMBEDDING FRONT: ", embedding)

    if (!embedding) {
      throw new Error("Failed to generate image embedding");
    }

    return embedding;
  } catch (error) {
    console.error("❌ Error generating image embedding:", error);
    throw error;
  }
}
