import { NextRequest, NextResponse } from 'next/server';
import { getActor } from '@/src/ic/agent';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'prompt';
    const limit = parseInt(searchParams.get('limit') || '10');

    // Get actor to call canister
    const actor = await getActor();
    
    // Get featured items from canister
    const featuredItems = await actor.get_featured_items(type, limit) as any[];
    
    // Process the results
    const processedItems = featuredItems.map((item: any) => ({
      id: Number(item.id),
      owner: item.owner.toText(),
      title: item.title,
      description: item.description,
      price: Number(item.price).toFixed(2),
      itemType: item.itemType,
      category: item.category,
      averageRating: Number(item.averageRating).toFixed(2),
      totalRatings: Number(item.totalRatings),
      isVerified: item.isVerified,
      createdAt: Number(item.createdAt),
      thumbnailImages: item.thumbnailImages
    }));

    return NextResponse.json(processedItems);
  } catch (error) {
    console.error('Error fetching featured items:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
