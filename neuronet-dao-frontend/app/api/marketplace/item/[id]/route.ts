import { NextRequest, NextResponse } from 'next/server';
import { getActor } from '@/src/ic/agent';

export async function GET(
  request: NextRequest,
  context: any
) {
  try {
    const { params } = context;
    const itemId = Number(params?.id);
    
    if (isNaN(itemId)) {
      return NextResponse.json(
        { error: 'Invalid item ID' },
        { status: 400 }
      );
    }

    // Get actor to call canister
    const actor = await getActor();
    
    // Get item detail from canister
    const itemDetail = await actor.get_item_detail(itemId) as any;
    
    if (!itemDetail || !itemDetail[0]) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    const item = itemDetail[0];
    
    // Process the item data
    const processedItem = {
      id: Number(item.id),
      owner: item.owner.toText(),
      title: item.title,
      description: item.description,
      price: Number(item.price).toFixed(2),
      itemType: item.itemType,
      category: item.category,
      metadata: item.metadata,
      comments: item.comments.map((comment: any) => ({
        id: Number(comment.id),
        itemId: Number(comment.itemId),
        author: comment.author.toText(),
        content: comment.content,
        createdAt: Number(comment.createdAt),
        updatedAt: Number(comment.updatedAt),
        rating: Number(comment.rating)
      })),
      averageRating: Number(item.averageRating).toFixed(2),
      totalRatings: Number(item.totalRatings),
      createdAt: Number(item.createdAt),
      updatedAt: Number(item.updatedAt),
      contentHash: item.contentHash,
      isVerified: item.isVerified,
      licenseTerms: item.licenseTerms,
      royaltyPercent: Number(item.royaltyPercent),
      licensedWallets: item.licensedWallets.map((wallet: any) => wallet.toText()),
      thumbnailImages: item.thumbnailImages,
      contentFileKey: item.contentFileKey,
      contentFileName: item.contentFileName,
      contentRetrievalUrl: item.contentRetrievalUrl
    };

    return NextResponse.json(processedItem);
  } catch (error) {
    console.error('Error fetching item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
