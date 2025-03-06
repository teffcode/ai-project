import { NextApiRequest, NextApiResponse } from "next";
import { fetchHuggingFaceData } from "@/lib/dataset/fetchHuggingFaceData";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const data = await fetchHuggingFaceData();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener datos", error });
  }
}
