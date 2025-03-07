import Image from "next/image";
import AuthGuard from "@/components/AuthGuard";
import UploadForm from "@/components/UploadForm";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useImageUpload } from "@/hooks/useImageUpload";

export default function Upload() {
  const { uploading, imageUrl, similarImages, fetchUploadImage } = useImageUpload();

  return (
    <AuthGuard>
      <div>
        <h1 className="text-3xl font-bold mb-4">Upload an Image</h1>
        <UploadForm onUpload={fetchUploadImage} />
        {uploading && <LoadingSpinner />}
        {imageUrl && (
          <div className="mt-4">
            <p className="text-green-500">Uploaded successfully!</p>
            <Image
              src={imageUrl}
              alt="Uploaded image"
              className="w-full h-24 object-cover"
              width={24}
              height={24}
              unoptimized
            />
          </div>
        )}
        {similarImages.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Similar Images</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {similarImages.map((image) => (
                <div key={image.id} className="border rounded-lg overflow-hidden">
                  <Image
                    src={image.image_url}
                    alt={`Similar image ${image.id}`}
                    className="w-full h-40 object-cover"
                    width={200}
                    height={160}
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
