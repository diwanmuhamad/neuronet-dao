import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.REGION!,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: NextRequest) {
  try {
    const { fileName, fileType, fileSize, principal } = await request.json();

    // Validate file size (1MB = 1024 * 1024 bytes)
    const maxSize = 1024 * 1024;
    if (fileSize > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 1MB limit' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(fileType)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed' },
        { status: 400 }
      );
    }

    // Generate unique file key with timestamp, random string, and principal
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = fileType.split('/')[1];
    const principalString = principal ? principal.toString() : 'anonymous';
    const fileKey = `sellers/${timestamp}-${randomString}-${principalString}.${fileExtension}`;

    // Create presigned URL for direct upload
    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: fileKey,
      ContentType: fileType,
    });

    const uploadPresignedUrl = await getSignedUrl(s3Client, putObjectCommand, {
      expiresIn: 3600, // 1 hour
    });

    // Create presigned URL for retrieval (longer expiration for viewing)
    const getObjectCommand = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: fileKey,
    });

    const retrievalPresignedUrl = await getSignedUrl(s3Client, getObjectCommand, {
      expiresIn: 604800, // 7 days
    });

    // Return the presigned URLs and the file key
    return NextResponse.json({
      uploadUrl: uploadPresignedUrl,
      retrievalUrl: retrievalPresignedUrl,
      fileKey: fileKey,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
}
