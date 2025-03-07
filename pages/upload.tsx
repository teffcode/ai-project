import Image from "next/image";
import AuthGuard from "@/components/AuthGuard";
import UploadForm from "@/components/UploadForm";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useImageUpload } from "@/hooks/useImageUpload";

export default function Upload() {
  const { imageUrl, similarImages, loading, fetchUploadImage } = useImageUpload();

  return (
    <AuthGuard>
      <section className="px-8 max-w-7xl w-full">
        <h1 className="text-3xl font-bold text-center mb-1">ChowMates 🍜🤝🏽</h1>
        <p className="text-lg text-center opacity-50"><i>Upload an image to find food lovers who match your taste!</i></p>

        <section className="mt-8">
          <UploadForm onUpload={fetchUploadImage} />

          {loading && <LoadingSpinner />}

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
        </section>

        {similarImages.length > 0 && (
          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Similar Images</h2>
            <p>Similar images based on embeddings.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
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
          </section>
        )}
      </section>
    </AuthGuard>
  );
}
