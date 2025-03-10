import Image from "next/image";
import Link from 'next/link';
import AuthGuard from "@/components/AuthGuard";
import UploadForm from "@/components/UploadForm";
import LoadingSpinner from "@/components/UI/LoadingSpinner";
import Header from "@/components/UI/Header";
import Footer from "@/components/UI/Footer";
import { useS3ImageUpload } from "@/hooks/useS3ImageUpload";

export default function Upload() {
  const { presignedImageUrl, similarImages, loading, fetchUploadImage } = useS3ImageUpload();

  return (
    <AuthGuard>
      <Header />
      <section className="flex-1 max-w-5xl w-full">
        <section className="max-w-5xl w-full flex flex-col md:flex-row my-8 px-8">
          <div className="flex-[2] mt-12 md:mt-24 mb-0 md:mb-24">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 md:w-4/5">
              Upload a <span className="text-orange-400">food photo</span> and find your match!
            </h1>
            <p className="text-xl text-gray-400 mb-4 md:w-4/5">Discover people who love the same dishes as you. Connect, chat, and share a meal!</p>
          </div>
          <div className="flex-1 relative hidden md:flex">
            <Image
              src="/main-pic-2.jpg"
              alt="Scraped main image"
              className="w-full h-[400px] object-cover rounded-xl border-4 border-orange-200"
              width={100}
              height={100}
              unoptimized
            />
          </div>
        </section>

        <section className="my-12 px-8">
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
          <section className="my-12 px-8">
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
      <Footer />
    </AuthGuard>
  );
}
