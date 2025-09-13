import { NextRequest, NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
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
    const { fileKey } = await request.json();

    if (!fileKey) {
      return NextResponse.json(
        { error: 'File key is required' },
        { status: 400 }
      );
    }

    // Create presigned URL for retrieval
    const getObjectCommand = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: fileKey,
    });

    const retrievalPresignedUrl = await getSignedUrl(s3Client, getObjectCommand, {
      expiresIn: 604800, // 7 days
    });

    return NextResponse.json({
      retrievalUrl: retrievalPresignedUrl,
    });
  } catch (error) {
    console.error('Retrieval URL generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate retrieval URL' },
      { status: 500 }
    );
  }
}
