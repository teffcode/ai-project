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

/**
 * Stores image metadata in the database.
 *
 * @param {string} originalUrl - The original URL of the image.
 * @param {string} s3Url - The S3 URL where the image is stored.
 * @param {Record<string, unknown>} metadata - Additional metadata related to the image.
 * @returns {Promise<Object>} - Returns the inserted metadata record from the database.
 *
 * @throws {Error} - Throws an error if the database query fails.
 */
export const storeMetadata = async (
  originalUrl: string,
  s3Url: string,
  metadata: Record<string, unknown>
) => {
  if (!originalUrl || typeof originalUrl !== "string") {
    throw new Error("Invalid original URL.");
  }

  if (!s3Url || typeof s3Url !== "string") {
    throw new Error("Invalid S3 URL.");
  }

  const metadataString = JSON.stringify(metadata);

  const query = `
    INSERT INTO images (original_url, s3_url, metadata)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  const { rows } = await pool.query(query, [originalUrl, s3Url, metadataString]);
  return rows[0];
};
