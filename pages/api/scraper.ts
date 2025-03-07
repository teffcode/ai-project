import { NextApiRequest, NextApiResponse } from "next";
import { scraper } from "@/lib/scraper";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { url } = req.body as { url?: string };

  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "A valid URL is required" });
  }

  try {
    const foodData = await scraper(url);
    return res.status(200).json(foodData);
  } catch (error) {
    console.error("❌ Error scraping food page:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ error: `Failed to scrape food page: ${errorMessage}` });
  }
}
