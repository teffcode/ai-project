import Image from "next/image";
import Link from 'next/link';
import AuthGuard from "@/components/AuthGuard";
import UploadForm from "@/components/UploadForm";
import LoadingSpinner from "@/components/UI/LoadingSpinner";
import Header from "@/components/UI/Header";
import Footer from "@/components/UI/Footer";
import SectionHeader from "@/components/UI/SectionHeader";
import BodySection from "@/components/UI/BodySection";
import MainSection from "@/components/UI/MainSection";
import Notification from "@/components/UI/Notification";
import { useS3ImageUpload } from "@/hooks/useS3ImageUpload";

export default function Upload() {
  const { presignedImageUrl, similarImages, loading, error, times, fetchUploadImage } = useS3ImageUpload();

  return (
    <AuthGuard>
      <Header />

      <div className="flex-1 max-w-5xl w-full">
        <MainSection
          title="Upload a food photo and find your match!"
          highlight="food photo"
          description="Discover people who love the same dishes as you. Connect, chat, and share a meal!"
          imageSrc="/main-pic-2.jpg"
        >
          <UploadForm onUpload={fetchUploadImage} />
        </MainSection>

        {error ? (
          <Notification type="error" message={error || "An unexpected error occurred"} />
        ) : (
          <>
            {presignedImageUrl && (
              <Notification
                type="success"
                message={`Uploaded successfully! ⏳ Upload Time: ${(((times.uploadEnd - times.start) / 1000) / 60).toFixed(2)}min 🎉`}
              />
            )}

            {presignedImageUrl && (
              <BodySection>
                <SectionHeader
                  title="Image uploaded to our storage"
                  highlight="uploaded to our storage"
                  description="Uploaded image"
                />
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
              </BodySection>
            )}

            {similarImages.length > 0 && (
              <Notification
                type="info"
                message={`Similar images found! 🔍 The total process took: ${(((times.processEnd - times.start) / 1000) / 60).toFixed(2)}min 🎉`}
              />
            )}

            {similarImages.length > 0 && (
              <BodySection>
                <SectionHeader
                  title="Discover visually similar images"
                  highlight="similar images"
                  description="Similar images"
                />
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mt-4">
                  {similarImages.map((image) => (
                    <div key={image.id} className="border border-gray-100 rounded-lg overflow-hidden">
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
              </BodySection>
            )}
          </>
        )}

        {loading && <div className="py-4"><LoadingSpinner /></div>}
      </div>

      <Footer />
    </AuthGuard>
  );
}
