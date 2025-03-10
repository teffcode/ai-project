import { useEffect, useState } from "react";

export default function LogViewer({ category }: { category: string }) {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const eventSource = new EventSource(`/api/logs?category=${category}`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setLogs((prev) => [...prev, data.message]);
    };

    return () => eventSource.close();
  }, [category]);

  return (
    <ul className="overflow-x-scroll">
      {logs.map((log, index) => (
        <li key={index}>{log}</li>
      ))}
    </ul>
  );
}
