import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY as string,
  }
});

/**
 * Generates a presigned URL for accessing an object in an S3 bucket.
 * The URL is valid for 7 days.
 *
 * @param bucket - The name of the S3 bucket.
 * @param key - The key (path) to the object within the bucket.
 * @returns A presigned URL allowing temporary access to the object.
 */
export async function getPresignedUrl(bucket: string, key: string) {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });

  return await getSignedUrl(s3Client, command, { expiresIn: 60 * 60 * 24 * 7 });
};
