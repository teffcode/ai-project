import { NextApiRequest, NextApiResponse } from "next";

let clients: { res: NextApiResponse; category: string }[] = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const category = req.query.category as string;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.flushHeaders();

    clients.push({ res, category });

    req.on("close", () => {
      clients = clients.filter((client) => client.res !== res);
    });
  } else {
    res.status(405).end();
  }
}

export function sendLog(category: string, message: string) {
  clients.forEach((client) => {
    if (client.category === category) {
      client.res.write(`data: ${JSON.stringify({ message })}\n\n`);
    }
  });
}
