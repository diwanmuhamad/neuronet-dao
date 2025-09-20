import { z } from 'zod';

// Define the schemas for marketplace data
const ItemSchema = z.object({
  id: z.number(),
  owner: z.string(),
  title: z.string(),
  description: z.string(),
  price: z.number(),
  itemType: z.string(),
  category: z.string(),
  metadata: z.string(),
  comments: z.array(z.object({
    id: z.number(),
    itemId: z.number(),
    author: z.string(),
    content: z.string(),
    createdAt: z.number(),
    updatedAt: z.number(),
    rating: z.number()
  })),
  averageRating: z.number(),
  totalRatings: z.number(),
  createdAt: z.number(),
  updatedAt: z.number(),
  contentHash: z.string(),
  isVerified: z.boolean(),
  licenseTerms: z.string(),
  royaltyPercent: z.number(),
  licensedWallets: z.array(z.string()),
  thumbnailImages: z.array(z.string()),
  contentFileKey: z.string(),
  contentFileName: z.string(),
  contentRetrievalUrl: z.string()
});

const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  itemType: z.string(),
  description: z.string()
});

const UserSchema = z.object({
  principal: z.string(),
  balance: z.number(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  bio: z.string().optional(),
  rate: z.number().optional(),
  createdAt: z.number(),
  updatedAt: z.number()
});

// Helper function to get the current domain
function getCurrentDomain(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  // For server-side rendering, use environment variable or default
  return process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000';
}

// Helper function to format price from e8s to ICP
function formatPrice(priceInE8s: number): string {
  return (priceInE8s / 100000000).toFixed(8);
}

// Helper function to format timestamp to readable date
function formatDate(timestamp: number): string {
  return new Date(timestamp / 1000000).toLocaleDateString();
}

export const marketplaceTool = {
  id: 'marketplace_tool',
  name: 'marketplace_tool',
  description: 'Get information about items, categories, and users from the NeuroNet DAO marketplace',
  parameters: z.object({
    action: z.enum([
      'get_item_detail',
      'search_items',
      'get_categories',
      'get_user_profile',
      'get_item_comments',
      'get_featured_items',
      'get_trending_items',
      'get_items_by_category',
      'get_items_by_type',
      'get_all_items'
    ]),
    itemId: z.number().optional(),
    searchQuery: z.string().optional(),
    category: z.string().optional(),
    itemType: z.string().optional(),
    limit: z.number().optional().default(10),
    userPrincipal: z.string().optional()
  }),
  execute: async ({ action, itemId, searchQuery, category, itemType, limit, userPrincipal }: {
    action: string;
    itemId?: number;
    searchQuery?: string;
    category?: string;
    itemType?: string;
    limit?: number;
    userPrincipal?: string;
  }) => {
    try {
      const domain = getCurrentDomain();
      
      switch (action) {
        case 'get_item_detail':
          if (!itemId) {
            throw new Error('Item ID is required for get_item_detail action');
          }
          
          // Simulate canister call - in real implementation, you'd call your canister
          const itemDetail = await fetch(`${domain}/api/marketplace/item/${itemId}`)
            .then(res => res.json())
            .catch(() => null);
          
          if (!itemDetail) {
            return {
              success: false,
              message: `Item with ID ${itemId} not found`,
              data: null
            };
          }
          
          return {
            success: true,
            message: `### ${itemDetail.title}\n\n**Description:** ${itemDetail.description}\n\n**Price:** ${formatPrice(itemDetail.price)} ICP\n**Category:** ${itemDetail.category}\n**Item Type:** ${itemDetail.itemType}\n**Author:** ${itemDetail.owner}\n**Average Rating:** ${itemDetail.averageRating} (${itemDetail.totalRatings} ratings)\n**Comments:** ${itemDetail.comments.length}\n**Verified:** ${itemDetail.isVerified ? 'Yes' : 'No'}\n**Created:** ${formatDate(itemDetail.createdAt)}\n\n[View Item Details](${domain}/marketplace/items/${itemDetail.id})`,
            data: {
              id: itemDetail.id,
              title: itemDetail.title,
              description: itemDetail.description,
              price: formatPrice(itemDetail.price),
              category: itemDetail.category,
              itemType: itemDetail.itemType,
              author: itemDetail.owner,
              averageRating: itemDetail.averageRating,
              totalRatings: itemDetail.totalRatings,
              commentsCount: itemDetail.comments.length,
              isVerified: itemDetail.isVerified,
              createdAt: formatDate(itemDetail.createdAt),
              thumbnailImages: itemDetail.thumbnailImages,
              itemUrl: `${domain}/marketplace/items/${itemDetail.id}`
            }
          };

        case 'search_items':
          if (!searchQuery) {
            throw new Error('Search query is required for search_items action');
          }
          
          const searchResults = await fetch(`${domain}/api/marketplace/search?q=${encodeURIComponent(searchQuery)}`)
            .then(res => res.json())
            .catch(() => []);
          
          const itemsList = searchResults.map((item: any, index: number) => 
            `${index + 1}. **${item.title}**\n   - Price: ${formatPrice(item.price)} ICP\n   - Category: ${item.category}\n   - Rating: ${item.averageRating} (${item.totalRatings} ratings)\n   - Verified: ${item.isVerified ? 'Yes' : 'No'}\n   - [View Details](${domain}/marketplace/items/${item.id})`
          ).join('\n\n');

          return {
            success: true,
            message: `Found ${searchResults.length} items matching "${searchQuery}":\n\n${itemsList}`,
            data: searchResults.map((item: any) => ({
              id: item.id,
              title: item.title,
              description: item.description,
              price: formatPrice(item.price),
              category: item.category,
              itemType: item.itemType,
              averageRating: item.averageRating,
              totalRatings: item.totalRatings,
              isVerified: item.isVerified,
              itemUrl: `${domain}/marketplace/items/${item.id}`
            }))
          };

        case 'get_categories':
          const categories = await fetch(`${domain}/api/marketplace/categories`)
            .then(res => res.json())
            .catch(() => []);
          
          const categoriesList = categories.map((cat: any, index: number) => 
            `${index + 1}. **${cat.name}** (${cat.itemType})\n   - ${cat.description}`
          ).join('\n\n');

          return {
            success: true,
            message: `Found ${categories.length} categories:\n\n${categoriesList}`,
            data: categories.map((cat: any) => ({
              id: cat.id,
              name: cat.name,
              itemType: cat.itemType,
              description: cat.description
            }))
          };

        case 'get_user_profile':
          if (!userPrincipal) {
            throw new Error('User principal is required for get_user_profile action');
          }
          
          const userProfile = await fetch(`${domain}/api/marketplace/user/${userPrincipal}`)
            .then(res => res.json())
            .catch(() => null);
          
          if (!userProfile) {
            return {
              success: false,
              message: `User profile not found`,
              data: null
            };
          }
          
          return {
            success: true,
            message: `Found user profile`,
            data: {
              principal: userProfile.principal,
              firstName: userProfile.firstName,
              lastName: userProfile.lastName,
              bio: userProfile.bio,
              rate: userProfile.rate,
              createdAt: formatDate(userProfile.createdAt)
            }
          };

        case 'get_item_comments':
          if (!itemId) {
            throw new Error('Item ID is required for get_item_comments action');
          }
          
          const comments = await fetch(`${domain}/api/marketplace/item/${itemId}/comments`)
            .then(res => res.json())
            .catch(() => []);
          
          return {
            success: true,
            message: `Found ${comments.length} comments for item ${itemId}`,
            data: comments.map((comment: any) => ({
              id: comment.id,
              author: comment.author,
              content: comment.content,
              rating: comment.rating,
              createdAt: formatDate(comment.createdAt)
            }))
          };

        case 'get_featured_items':
          const featuredItems = await fetch(`${domain}/api/marketplace/featured?type=${itemType || 'prompt'}&limit=${limit}`)
            .then(res => res.json())
            .catch(() => []);
          
          const featuredList = featuredItems.map((item: any, index: number) => 
            `${index + 1}. **${item.title}**\n   - Price: ${formatPrice(item.price)} ICP\n   - Category: ${item.category}\n   - Rating: ${item.averageRating} (${item.totalRatings} ratings)\n   - Verified: ${item.isVerified ? 'Yes' : 'No'}\n   - [View Details](${domain}/marketplace/items/${item.id})`
          ).join('\n\n');
          
          return {
            success: true,
            message: `Here are ${featuredItems.length} featured items:\n\n${featuredList}`,
            data: featuredItems.map((item: any) => ({
              id: item.id,
              title: item.title,
              description: item.description,
              price: formatPrice(item.price),
              category: item.category,
              itemType: item.itemType,
              averageRating: item.averageRating,
              totalRatings: item.totalRatings,
              isVerified: item.isVerified,
              itemUrl: `${domain}/marketplace/items/${item.id}`
            }))
          };

        case 'get_trending_items':
          const trendingItems = await fetch(`${domain}/api/marketplace/trending?type=${itemType || 'prompt'}&limit=${limit}`)
            .then(res => res.json())
            .catch(() => []);
          
          const trendingList = trendingItems.map((item: any, index: number) => 
            `${index + 1}. **${item.title}**\n   - Price: ${formatPrice(item.price)} ICP\n   - Category: ${item.category}\n   - Rating: ${item.averageRating} (${item.totalRatings} ratings)\n   - Verified: ${item.isVerified ? 'Yes' : 'No'}\n   - [View Details](${domain}/marketplace/items/${item.id})`
          ).join('\n\n');
          
          return {
            success: true,
            message: `Here are ${trendingItems.length} trending items:\n\n${trendingList}`,
            data: trendingItems.map((item: any) => ({
              id: item.id,
              title: item.title,
              description: item.description,
              price: formatPrice(item.price),
              category: item.category,
              itemType: item.itemType,
              averageRating: item.averageRating,
              totalRatings: item.totalRatings,
              isVerified: item.isVerified,
              itemUrl: `${domain}/marketplace/items/${item.id}`
            }))
          };

        case 'get_items_by_category':
          if (!category) {
            throw new Error('Category is required for get_items_by_category action');
          }
          
          const categoryItems = await fetch(`${domain}/api/marketplace/category/${encodeURIComponent(category)}`)
            .then(res => res.json())
            .catch(() => []);
          
          return {
            success: true,
            message: `Found ${categoryItems.length} items in category "${category}"`,
            data: categoryItems.map((item: any) => ({
              id: item.id,
              title: item.title,
              description: item.description,
              price: formatPrice(item.price),
              category: item.category,
              itemType: item.itemType,
              averageRating: item.averageRating,
              totalRatings: item.totalRatings,
              isVerified: item.isVerified,
              itemUrl: `${domain}/marketplace/items/${item.id}`
            }))
          };

        case 'get_items_by_type':
          if (!itemType) {
            throw new Error('Item type is required for get_items_by_type action');
          }
          
          const typeItems = await fetch(`${domain}/api/marketplace/type/${itemType}?limit=${limit}`)
            .then(res => res.json())
            .catch(() => []);
          
          return {
            success: true,
            message: `Found ${typeItems.length} items of type "${itemType}"`,
            data: typeItems.map((item: any) => ({
              id: item.id,
              title: item.title,
              description: item.description,
              price: formatPrice(item.price),
              category: item.category,
              itemType: item.itemType,
              averageRating: item.averageRating,
              totalRatings: item.totalRatings,
              isVerified: item.isVerified,
              itemUrl: `${domain}/marketplace/items/${item.id}`
            }))
          };

        case 'get_all_items':
          // Build query parameters
          const queryParams = new URLSearchParams();
          if (category) queryParams.append('category', category);
          if (itemType) queryParams.append('type', itemType);
          queryParams.append('limit', (limit || 10).toString());
          
          // Get all items with optional filtering
          const allItems = await fetch(`${domain}/api/marketplace/items?${queryParams.toString()}`)
            .then(res => res.json())
            .catch(() => []);
          
          const allItemsList = allItems.map((item: any, index: number) => 
            `${index + 1}. **${item.title}**\n   - Price: ${formatPrice(item.price)} ICP\n   - Category: ${item.category}\n   - Type: ${item.itemType}\n   - Rating: ${item.averageRating} (${item.totalRatings} ratings)\n   - Verified: ${item.isVerified ? 'Yes' : 'No'}\n   - [View Details](${domain}/marketplace/items/${item.id})`
          ).join('\n\n');
          
          return {
            success: true,
            message: category 
              ? `Found ${allItems.length} items in category "${category}":\n\n${allItemsList}`
              : `Found ${allItems.length} items:\n\n${allItemsList}`,
            data: allItems.map((item: any) => ({
              id: item.id,
              title: item.title,
              description: item.description,
              price: formatPrice(item.price),
              category: item.category,
              itemType: item.itemType,
              averageRating: item.averageRating,
              totalRatings: item.totalRatings,
              isVerified: item.isVerified,
              itemUrl: `${domain}/marketplace/items/${item.id}`
            }))
          };

        default:
          throw new Error(`Unknown action: ${action}`);
      }
    } catch (error) {
      return {
        success: false,
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        data: null
      };
    }
  }
};
