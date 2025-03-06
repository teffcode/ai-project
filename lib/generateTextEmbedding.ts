import axios from "axios";

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
