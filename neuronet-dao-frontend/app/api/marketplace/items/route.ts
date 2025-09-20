import { NextRequest, NextResponse } from 'next/server';
import { getActor } from '@/src/ic/agent';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const itemType = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Get actor to call canister
    const actor = await getActor();
    
    let allItems: any[] = [];
    
    // Get items from all types if no specific type is requested
    const types = itemType ? [itemType] : ['prompt', 'dataset', 'ai_output'];
    
    for (const type of types) {
      try {
        // Get items by type using the canister
        const items = await actor.get_items_by_type_paginated(type, 0, 50) as any[];
        const processedItems = items.map((item: any) => ({
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
        allItems.push(...processedItems);
      } catch (error) {
        console.error(`Error fetching items for type ${type}:`, error);
        // Continue with other types even if one fails
      }
    }
    
    // Filter by category if provided
    let filteredItems = allItems;
    if (category) {
      filteredItems = allItems.filter((item: any) => 
        item.category.toLowerCase().includes(category.toLowerCase())
      );
    }
    
    // Limit results
    const limitedItems = filteredItems.slice(0, limit);

    return NextResponse.json(limitedItems);
  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
