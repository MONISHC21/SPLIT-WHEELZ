import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import { logger } from './logger';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'splitwheelz-uploads';

export async function uploadToS3(
  buffer: Buffer,
  originalName: string,
  mimeType: string,
  folder: string = 'uploads'
): Promise<string> {
  const extension = originalName.split('.').pop();
  const key = `${folder}/${uuidv4()}.${extension}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: mimeType,
    ACL: 'public-read',
  });

  await s3Client.send(command);
  const url = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'ap-south-1'}.amazonaws.com/${key}`;
  logger.info(`Uploaded to S3: ${url}`);
  return url;
}

export async function deleteFromS3(url: string): Promise<void> {
  const key = url.split('.amazonaws.com/')[1];
  if (!key) return;

  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  await s3Client.send(command);
  logger.info(`Deleted from S3: ${key}`);
}

export async function getPresignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn });
}

export { s3Client };
