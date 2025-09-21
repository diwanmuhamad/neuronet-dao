/**
 * Utility functions for retrieving content from S3 storage
 */

export interface ContentRetrievalResult {
  success: boolean;
  content?: string;
  error?: string;
}

/**
 * Retrieves content from S3 using the contentRetrievalUrl
 * Handles different content types (text, JSON, images)
 */
export async function retrieveContentFromS3(
  contentRetrievalUrl: string,
  itemType: string
): Promise<ContentRetrievalResult> {
  try {
    const response = await fetch(contentRetrievalUrl);

    if (!response.ok) {
      return {
        success: false,
        error: `Failed to fetch content: ${response.status} ${response.statusText}`
      };
    }

    if (itemType === 'ai_output') {
      // For AI outputs, return the URL directly as it's already an image URL
      return {
        success: true,
        content: contentRetrievalUrl
      };
    }

    // For text-based content (prompts, datasets)
    const contentType = response.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      const jsonContent = await response.json();
      return {
        success: true,
        content: JSON.stringify(jsonContent, null, 2)
      };
    } else if (contentType.includes('text/') || itemType === 'prompt' || itemType === 'dataset') {
      const textContent = await response.text();
      return {
        success: true,
        content: textContent
      };
    } else {
      // For binary or unknown content, try to decode as text
      const arrayBuffer = await response.arrayBuffer();
      const decoder = new TextDecoder('utf-8', { fatal: false });
      const textContent = decoder.decode(arrayBuffer);
      return {
        success: true,
        content: textContent
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred while retrieving content'
    };
  }
}

/**
 * Retrieves multiple content items from S3 in parallel
 */
export async function retrieveMultipleContents(
  items: Array<{
    id: number;
    title: string;
    contentRetrievalUrl: string;
    itemType: string;
    category: string;
  }>
): Promise<Array<{
  id: number;
  title: string;
  content: string;
  itemType: string;
  category: string;
  retrievalError?: string;
}>> {
  const retrievalPromises = items.map(async (item) => {
    const result = await retrieveContentFromS3(item.contentRetrievalUrl, item.itemType);
    
    return {
      id: item.id,
      title: item.title,
      content: result.content || '',
      itemType: item.itemType,
      category: item.category,
      retrievalError: result.error
    };
  });

  return Promise.all(retrievalPromises);
}
