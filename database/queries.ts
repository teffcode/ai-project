import pool from "@/lib/db";

/**
 * Finds similar images based on the provided embedding vector.
 * 
 * @param {number[]} embedding - The embedding vector of the image.
 * @param {number} limit - Number of similar images to return (default: 10).
 * @returns {Promise<{ id: number, imageUrl: string }[]>} - A list of similar images.
 */
export async function findSimilarImages(embedding: number[], limit: number = 10) {
  const formattedEmbedding = `[${embedding.join(",")}]`; // Convert array to PostgreSQL vector format

  const query = `
    SELECT id, image_url 
    FROM uploads 
    ORDER BY embedding <-> $1 
    LIMIT $2;
  `;

  try {
    const { rows } = await pool.query(query, [formattedEmbedding, limit]);
    return rows;
  } catch (error) {
    console.error("❌ Error fetching similar images:", error);
    throw new Error("Failed to fetch similar images");
  }
}

/**
 * Saves an uploaded image in the database.
 *
 * @param {string} imageUrl - The URL of the uploaded image.
 * @param {number[]} embedding - The embedding vector of the image.
 * @returns {Promise<Object>} - Returns the inserted upload record.
 */
export const saveUploadedImage = async (imageUrl: string, embedding: number[]) => {
  if (!imageUrl || typeof imageUrl !== "string") {
    throw new Error("Invalid image URL.");
  }

  if (!Array.isArray(embedding) || embedding.some(isNaN)) {
    throw new Error("Embedding must be an array of numbers.");
  }

  const formattedEmbedding = `[${embedding.join(",")}]`;

  const query = `
    INSERT INTO uploads (image_url, embedding)
    VALUES ($1, $2)
    RETURNING *;
  `;

  const { rows } = await pool.query(query, [imageUrl, formattedEmbedding]);
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
