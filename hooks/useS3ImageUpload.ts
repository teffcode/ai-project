import { useState } from "react";
import axios from "axios";

export function useS3ImageUpload() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [presignedImageUrl, setPresignedImageUrl] = useState<string | null>(null);
  const [similarImages, setSimilarImages] = useState<{ id: number; image: string }[]>([]);
  const [times, setTimes] = useState<Record<string, number>>({});

  const fetchUploadImage = async (file: File) => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setTimes({});

    const formData = new FormData();

    formData.append("file", file);
    formData.append("fileName", file.name);
    formData.append("contentType", file.type);

    try {
      setTimes((prev) => ({ ...prev, start: performance.now() }));

      const { data: uploadData } = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setTimes((prev) => ({ ...prev, uploadEnd: performance.now() }));

      if (uploadData.success && uploadData.presignedUrl) {
        setPresignedImageUrl(uploadData.presignedUrl);

        const { data: processData } = await axios.post("/api/process", {
          presignedUrl: uploadData.presignedUrl,
        });

        setTimes((prev) => ({ ...prev, processEnd: performance.now() }));

        if (processData.success) {
          setSimilarImages(processData.similarImages || []);
        }
      }

      setTimes((prev) => ({ ...prev, processEnd: performance.now() }));

      console.log(
        `⏱️ Upload Time: ${(times.uploadEnd - times.start).toFixed(2)} ms`
      );
      console.log(
        `⏱️ Total Processing Time: ${(times.processEnd - times.start).toFixed(2)} ms`
      );
    } catch (error) {
      console.error("❌ Error uploading file:", error);
      setError("Error uploading or processing file");
    } finally {
      setLoading(false);
    }
  };

  return { presignedImageUrl, similarImages, loading, error, times, fetchUploadImage };
}
