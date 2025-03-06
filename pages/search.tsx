import { useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import { generateTextEmbedding } from "@/lib/snappr";

export default function Search() {
  const [query, setQuery] = useState("");
  const [embedding, setEmbedding] = useState<number[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (text: string) => {
    setQuery(text);

    if (text.trim().length === 0) {
      setEmbedding(null);
      return;
    }

    setLoading(true);
    try {
      const embeddingResult = await generateTextEmbedding(text);
      setEmbedding(embeddingResult);
      console.log("🔍 Embedding:", embeddingResult);
    } catch (error) {
      console.error("❌ Error generating embedding:", error);
    }
    setLoading(false);
  };

  return (
    <AuthGuard>
      <div className="p-4">
        <h1 className="text-2xl">Search Page</h1>
        <input
          type="text"
          placeholder="Search..."
          className="border p-2 mt-4 w-full"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
        />
        {loading && <p className="text-gray-500 mt-2">Generating embedding...</p>}
        {embedding && (
          <div className="mt-4 p-2 bg-gray-100 rounded">
            <p className="text-sm font-bold">Text Embedding:</p>
            <pre className="text-xs break-all">{JSON.stringify(embedding, null, 2)}</pre>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
