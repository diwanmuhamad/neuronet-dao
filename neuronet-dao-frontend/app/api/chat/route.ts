import { NextRequest, NextResponse } from 'next/server';
import { mastra } from '@/mastra';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Get the marketplace agent
    const agent = mastra.getAgent('marketplaceAgent');
    
    if (!agent) {
      return NextResponse.json(
        { error: 'Marketplace agent not found' },
        { status: 500 }
      );
    }

    // Generate response using the agent
    const result = await agent.generate(message);

    return NextResponse.json({
      response: result.text,
      success: true
    });

  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
