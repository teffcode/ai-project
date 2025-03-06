import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const HF_DATASET_API = process.env.HF_DATASET_API || "https://datasets-server.huggingface.co/rows";
const DATASET_NAME = process.env.DATASET_NAME || "Qdrant/wolt-food-clip-ViT-B-32-embeddings";
const BATCH_SIZE = process.env.BATCH_SIZE || 5;
const HF_ACCESS_TOKEN = process.env.HF_ACCESS_TOKEN;

/**
 * Fetches 5 image embeddings from the Hugging Face dataset API.
 */
export async function fetchHuggingFaceData() {
  try {
    const response = await axios.get(HF_DATASET_API, {
      params: {
        dataset: encodeURIComponent(DATASET_NAME),
        config: "default",
        split: "train",
        offset: 0,
        length: BATCH_SIZE,
      },
      headers: {
        Authorization: `Bearer ${HF_ACCESS_TOKEN}`,
      },
    });

    return response.data.rows || [];
  } catch (error) {
    console.error("❌ Error fetching Hugging Face data:", error);
    return [];
  }
}
