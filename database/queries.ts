import pool from "@/lib/db";

/**
 * Finds similar images based on the provided embedding vector.
 * 
 * @param {number[]} embedding - The embedding vector of the image.
 * @param {number} limit - Number of similar images to return.
 * @returns {Promise<{ id: number, imageUrl: string }[]>} - A list of similar images.
 */
export async function findSimilarImages(embedding: number[], limit: number = 5) {
  const query = `
    SELECT id, image_url 
    FROM images 
    ORDER BY embedding <-> $1 
    LIMIT $2;
  `;

  try {
    const { rows } = await pool.query(query, [embedding, limit]);
    return rows;
  } catch (error) {
    console.error("❌ Error fetching similar images:", error);
    throw new Error("Failed to fetch similar images");
  }
}

/**
 * Saves a food item in the database with its name, description, embedding, and image URL.
 * 
 * @param {string} name - The name of the food item.
 * @param {string} description - A brief description of the food item.
 * @param {number[]} embedding - The embedding vector generated for the food item.
 * @param {string} imageUrl - The URL of the uploaded food image.
 * @returns {Promise<Object>} - Returns the inserted food data from the database.
 * 
 * @throws {Error} - Throws an error if the database query fails.
 */
export const saveFoodItem = async (
  name: string,
  description: string,
  embedding: number[],
  imageUrl: string
) => {
  if (!Array.isArray(embedding) || embedding.some(isNaN)) {
    throw new Error("Embedding must be an array of numbers.");
  }

  if (!imageUrl || typeof imageUrl !== "string") {
    throw new Error("Invalid image URL.");
  }

  const formattedEmbedding = `[${embedding.join(",")}]`;

  const query = `
    INSERT INTO food_items (name, description, embedding, image_url)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  const { rows } = await pool.query(query, [name, description, formattedEmbedding, imageUrl]);
  return rows[0];
};
