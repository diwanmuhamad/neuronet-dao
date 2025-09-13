// Extract file key from S3 URL
export const extractFileKeyFromS3Url = (s3Url: string): string | null => {
  try {
    const url = new URL(s3Url);
    // Remove leading slash from pathname
    return url.pathname.substring(1);
  } catch (error) {
    console.error('Error extracting file key from S3 URL:', error);
    return null;
  }
};

// Generate retrieval URL for an S3 image
export const generateRetrievalUrl = async (s3Url: string): Promise<string | null> => {
  try {
    const fileKey = extractFileKeyFromS3Url(s3Url);
    if (!fileKey) {
      return null;
    }

    const response = await fetch('/api/images/retrieval', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileKey }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate retrieval URL');
    }

    const { retrievalUrl } = await response.json();
    return retrievalUrl;
  } catch (error) {
    console.error('Error generating retrieval URL:', error);
    return null;
  }
};

// Check if a URL is an S3 URL
export const isS3Url = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname.includes('s3') && parsedUrl.hostname.includes('amazonaws.com');
  } catch {
    return false;
  }
};
