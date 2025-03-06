import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY as string,
  }
});

/**
 * Uploads a file to an Amazon S3 bucket and returns the file URL.
 * 
 * @param file - The file content as a Buffer.
 * @param fileName - The name to assign to the uploaded file in the S3 bucket.
 * @param contentType - The MIME type of the file being uploaded.
 * @returns The public URL of the uploaded file.
 */
export async function uploadSingleFileToS3(file: Buffer, fileName: string, contentType: string) {
  const bucketName = process.env.AWS_S3_BUCKET_NAME;

  if (!bucketName) {
    throw new Error("S3 bucket name is not defined in environment variables.");
  }

  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: file,
    ContentType: contentType,
  };

  try {
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    console.log(`✅ File uploaded to S3: ${fileName}`);

    const fileUrl = `https://${bucketName}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/uploads/${fileName}`;

    return fileUrl;
  } catch (error) {
    console.error("❌ Error uploading to S3:", error);
    throw error;
  }
}
