import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';

const s3Client = new S3Client({
  region: process.env.REGION!,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
});

// Generate SHA-256 hash of content
function generateContentHash(content: string): string {
  return crypto.createHash('sha256').update(content).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const { content, itemType, principal } = await request.json();

    if (!content || !itemType || !principal) {
      return NextResponse.json(
        { error: 'Content, itemType, and principal are required' },
        { status: 400 }
      );
    }

    // Check content size (1MB = 1024 * 1024 bytes)
    const contentSizeInBytes = Buffer.byteLength(content, 'utf8');
    const maxSizeInBytes = 1024 * 1024; // 1MB
    
    if (contentSizeInBytes > maxSizeInBytes) {
      return NextResponse.json(
        { error: 'File size exceeds 1MB limit. Please use a smaller file.' },
        { status: 400 }
      );
    }

    // Validate content based on item type
    let fileExtension: string;
    let contentType: string;
    let fileName: string;

    switch (itemType) {
      case 'prompt':
        // For prompts, create a text file with the content
        fileExtension = 'txt';
        contentType = 'text/plain';
        fileName = `prompt_${Date.now()}.txt`;
        break;
      case 'dataset':
        // For datasets, expect CSV content
        fileExtension = 'csv';
        contentType = 'text/csv';
        fileName = `dataset_${Date.now()}.csv`;
        break;
      case 'ai_output':
        // For AI outputs, expect base64 image data
        if (!content.startsWith('data:image/')) {
          return NextResponse.json(
            { error: 'AI output must be an image file' },
            { status: 400 }
          );
        }
        // Extract image format from data URL
        const match = content.match(/data:image\/([^;]+);base64,/);
        if (!match) {
          return NextResponse.json(
            { error: 'Invalid image data format' },
            { status: 400 }
          );
        }
        const imageFormat = match[1];
        if (!['jpeg', 'jpg', 'png'].includes(imageFormat)) {
          return NextResponse.json(
            { error: 'Only JPEG, JPG, and PNG images are allowed for AI outputs' },
            { status: 400 }
          );
        }
        fileExtension = imageFormat;
        contentType = `image/${imageFormat}`;
        fileName = `ai_output_${Date.now()}.${imageFormat}`;
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid item type. Must be prompt, dataset, or ai_output' },
          { status: 400 }
        );
    }

    // Generate file key with new pattern: sellers/content/{principal}/{timestamp}_{filename}
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileKey = `sellers/content/${principal}/${timestamp}-${randomString}-${fileName}`;

    // Generate content hash
    const contentHash = generateContentHash(content);

    // Convert content to buffer based on type
    let fileBuffer: Buffer;
    if (itemType === 'ai_output') {
      // Remove data URL prefix and convert base64 to buffer
      const base64Data = content.replace(/^data:image\/[^;]+;base64,/, '');
      fileBuffer = Buffer.from(base64Data, 'base64');
    } else {
      // For prompts, content is text input
      fileBuffer = Buffer.from(content, 'utf-8');
    }

    // Upload to S3
    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: fileKey,
      Body: fileBuffer,
      ContentType: contentType,
    });

    await s3Client.send(putObjectCommand);

    // Generate retrieval URL
    const getObjectCommand = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: fileKey,
    });

    const retrievalUrl = await getSignedUrl(s3Client, getObjectCommand, {
      expiresIn: 604800, // 7 days
    });

    return NextResponse.json({
      success: true,
      fileKey: fileKey,
      fileName: fileName,
      contentHash: contentHash,
      retrievalUrl: retrievalUrl,
      contentType: contentType,
    });
  } catch (error) {
    console.error('Content upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload content' },
      { status: 500 }
    );
  }
}
