import { NextRequest, NextResponse } from 'next/server';
import { mastra } from '@/mastra';
import { getActor } from '@/src/ic/agent';
import { retrieveMultipleContents } from '@/src/utils/contentRetrieval';

export async function POST(request: NextRequest) {
  try {
    const { newContent, itemType } = await request.json();

    if (!newContent || !itemType) {
      return NextResponse.json(
        { error: 'Missing required fields: newContent, itemType' },
        { status: 400 }
      );
    }

    // Get the duplicate detection agent
    const agent = mastra.getAgent('duplicateDetectionAgent');
    
    if (!agent) {
      return NextResponse.json(
        { error: 'Duplicate detection agent not found' },
        { status: 500 }
      );
    }

    // Get existing content from the canister and retrieve actual content from S3
    let existingContents: Array<{
      id: number;
      title: string;
      content: string;
      contentHash: string;
      itemType: string;
      category: string;
    }> = [];
    
    try {
      // Get actor to call canister
      const actor = await getActor();
      
      // Call the canister function to get all content for AI analysis
      const allContent = await actor.get_all_content_for_ai_analysis(itemType) as any[];
      
      // Process the content and retrieve actual content from S3
      const itemsWithRetrievalUrls = allContent.map((item: any) => ({
        id: Number(item.id),
        title: item.title,
        contentRetrievalUrl: item.contentRetrievalUrl,
        itemType: item.itemType,
        category: item.category
      }));

      // Retrieve actual content from S3
      const retrievedContents = await retrieveMultipleContents(itemsWithRetrievalUrls);
      
      // Map to the expected format with actual content
      existingContents = retrievedContents.map((item) => ({
        id: item.id,
        title: item.title,
        content: item.content,
        contentHash: '', // We don't need the hash for similarity analysis
        itemType: item.itemType,
        category: item.category
      }));

      // Filter out items where content retrieval failed
      existingContents = existingContents.filter(item => item.content && !item.content.includes('retrievalError'));
      
    } catch (error) {
      console.error('Error fetching existing content from canister:', error);
      // Continue with empty array if can't fetch existing content
    }

    // Generate response using the agent
    const result = await agent.generate(`Analyze the similarity between this new content and existing items. 
    
    New Content: "${newContent}"
    Item Type: ${itemType}
    Existing Contents: ${JSON.stringify(existingContents)}
    
    Please provide a detailed similarity analysis including:
    1. Overall similarity percentage (0-100%)
    2. Whether it should be rejected (≥95% similarity) or allowed (<95% similarity)
    3. Detailed analysis of similarities and differences
    4. Key concepts identified
    5. Reasoning for the recommendation
    
    Format your response as JSON with the following structure:
    {
      "similarityPercentage": number,
      "isDuplicate": boolean,
      "recommendation": "accept" | "reject" | "review",
      "analysis": {
        "similarities": string[],
        "differences": string[],
        "keyConcepts": string[],
        "reasoning": string
      },
      "existingItem": {
        "id": number,
        "title": string,
        "contentHash": string,
        "similarityScore": number
      } | null
    }`);

    // Parse the AI response
    let similarityResult;
    try {
      // Try to extract JSON from the response
      const jsonMatch = result.text.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        similarityResult = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback if no JSON found
        similarityResult = {
          similarityPercentage: 0,
          isDuplicate: false,
          recommendation: 'accept',
          analysis: {
            similarities: [],
            differences: [],
            keyConcepts: [],
            reasoning: 'Unable to analyze similarity'
          },
          existingItem: null
        };
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      similarityResult = {
        similarityPercentage: 0,
        isDuplicate: false,
        recommendation: 'accept',
        analysis: {
          similarities: [],
          differences: [],
          keyConcepts: [],
          reasoning: 'Error parsing similarity analysis'
        },
        existingItem: null
      };
    }

    return NextResponse.json({
      success: true,
      data: similarityResult
    });

  } catch (error) {
    console.error('Error in duplicate check:', error);
    return NextResponse.json(
      { 
        error: 'Failed to check content similarity',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
