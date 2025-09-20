import { NextRequest, NextResponse } from 'next/server';
import { getActor } from '@/src/ic/agent';

export async function GET(request: NextRequest) {
  try {
    // Get actor to call canister
    const actor = await getActor();
    
    // Get categories from canister
    const categories = await actor.get_categories([]) as any[];
    
    // Process the categories
    const processedCategories = categories.map((category: any) => ({
      id: Number(category.id),
      name: category.name,
      itemType: category.itemType,
      description: category.description
    }));

    return NextResponse.json(processedCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
