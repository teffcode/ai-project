import axios from "axios";
import dotenv from "dotenv";
import Bottleneck from "bottleneck";
import fs from "fs";

dotenv.config();

const HF_DATASET_API = process.env.HF_DATASET_API || "https://datasets-server.huggingface.co/rows";
const DATASET_NAME = process.env.DATASET_NAME || "Qdrant/wolt-food-clip-ViT-B-32-embeddings";
const BATCH_SIZE = process.env.BATCH_SIZE || 5;
const HF_ACCESS_TOKEN = process.env.HF_ACCESS_TOKEN;
const TEMP_DIR = './tempImages';
const REQUESTS_PER_MINUTE = parseInt(process.env.REQUESTS_PER_MINUTE || "60", 10);

// Rate limiter
const limiter = new Bottleneck({
  minTime: (60 / REQUESTS_PER_MINUTE) * 1000,
});

// Ensure temp directory exists
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR);
}

/**
 * Fetches 5 image embeddings from the Hugging Face dataset API.
 */
export async function fetchHuggingFaceData() {
  try {
    const response = await limiter.schedule(() =>
      axios.get(HF_DATASET_API, {
        params: {
          dataset: encodeURIComponent(DATASET_NAME),
          config: "default",
          split: "train",
          offset: 0,
          length: BATCH_SIZE,
        },
        headers: {
          Authorization: `Bearer ${HF_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      })
    );

    return response.data.rows || [];
  } catch (error) {
    console.error("❌ Error fetching Hugging Face data:", error);
    return [];
  }
}
