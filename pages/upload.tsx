import Image from "next/image";
import Link from 'next/link';
import AuthGuard from "@/components/AuthGuard";
import UploadForm from "@/components/UploadForm";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useS3ImageUpload } from "@/hooks/useS3ImageUpload";

export default function Upload() {
  const { presignedImageUrl, similarImages, loading, fetchUploadImage } = useS3ImageUpload();

  return (
    <AuthGuard>
      <section className="px-8 max-w-7xl w-full">
        <h1 className="text-3xl font-bold text-center mb-1">ChowMates 🍜🤝🏽</h1>
        <p className="text-lg text-center opacity-50"><i>Upload an image to find food lovers who match your taste!</i></p>

        <section className="mt-8">
          <UploadForm onUpload={fetchUploadImage} />

          {loading && <div className="py-4"><LoadingSpinner /></div>}

          {presignedImageUrl && (
            <div className="mt-4">
              <p className="text-green-500 text-center mb-2">Uploaded successfully to S3! 🎉</p>
              <h2 className="text-2xl font-semibold mb-4">Image uploaded</h2>
              <p>Your image has been uploaded successfully. You can click on the image above
                <a href={presignedImageUrl} target="_blank" className="text-blue-500 underline mx-1">or here</a>
                to view the link.
              </p>
              <Link href={presignedImageUrl} className="inline-block w-40">
                <Image
                  src={presignedImageUrl}
                  alt="Uploaded image"
                  className="w-40 h-24 object-cover border rounded-lg mt-4"
                  width={24}
                  height={24}
                  unoptimized
                />
              </Link>
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
                    src={image.image}
                    alt={`Similar image ${image.id}`}
                    className="w-full h-40 object-cover"
                    width={200}
                    height={40}
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
