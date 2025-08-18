import { useState, useEffect, useCallback } from "react";
import { getActor } from "../ic/agent";
import { useAuth } from "../contexts/AuthContext";

export interface MarketplaceItem {
  id: number;
  owner: string;
  title: string;
  description: string;
  price: bigint;
  itemType: string;
  category: string;
  metadata: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  comments: any[];
  averageRating: number;
  totalRatings: number;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export interface FeaturedItem {
  title: string;
  price: string;
  category: string;
  image: string;
  size?: string;
  type?: string;
  rating?: number;
}

export interface TrendingItem {
  rank: number;
  title: string;
  category: string;
  price: string;
  rating: number;
  image?: string;
}

export function useMarketplaceData() {
  const { identity } = useAuth();
  const [featuredPrompts, setFeaturedPrompts] = useState<FeaturedItem[]>([]);
  const [featuredDatasets, setFeaturedDatasets] = useState<FeaturedItem[]>([]);
  const [featuredAIOutputs, setFeaturedAIOutputs] = useState<FeaturedItem[]>(
    [],
  );
  const [trendingPrompts, setTrendingPrompts] = useState<TrendingItem[]>([]);
  const [trendingDatasets, setTrendingDatasets] = useState<TrendingItem[]>([]);
  const [trendingAIOutputs, setTrendingAIOutputs] = useState<TrendingItem[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to convert marketplace item to featured item
  const convertToFeaturedItem = (
    item: MarketplaceItem,
    index: number,
  ): FeaturedItem => {
    const placeholderImages = [
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=300&h=200&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1686191128892-34af9b70e99c?w=300&h=200&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1692607136002-3895c1f212e7?w=300&h=200&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1633174524827-db00a6b7bc74?w=300&h=200&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=300&h=200&fit=crop&crop=center",
    ];

    return {
      title: item.title,
      price: (Number(item.price) / 100_000_000).toFixed(2),
      category: item.category,
      image: placeholderImages[index % placeholderImages.length],
      rating: item.averageRating || 5.0,
    };
  };

  // Helper function to convert marketplace item to trending item
  const convertToTrendingItem = (
    item: MarketplaceItem,
    index: number,
  ): TrendingItem => {
    return {
      rank: index + 1,
      title: item.title,
      category: item.category,
      price: (Number(item.price) / 100_000_000).toFixed(2),
      rating: item.averageRating || 5.0,
    };
  };

  // Helper function to split trending items into columns
  const splitIntoColumns = (
    items: TrendingItem[],
    columnsCount: number = 4,
  ): TrendingItem[][] => {
    const columns: TrendingItem[][] = [];
    const itemsPerColumn = Math.ceil(items.length / columnsCount);

    for (let i = 0; i < columnsCount; i++) {
      const startIndex = i * itemsPerColumn;
      const endIndex = Math.min(startIndex + itemsPerColumn, items.length);
      columns.push(items.slice(startIndex, endIndex));
    }

    return columns;
  };

  const fetchFeaturedItems = useCallback(async () => {
    if (!identity) return;

    try {
      const actor = await getActor(identity);

      // Fetch featured items (most viewed) - limit to 5 items each
      const [prompts, datasets, aiOutputs] = await Promise.all([
        actor.get_featured_items("prompt", 5),
        actor.get_featured_items("dataset", 5),
        actor.get_featured_items("ai_output", 5),
      ]);

      setFeaturedPrompts(
        (prompts as MarketplaceItem[]).map(convertToFeaturedItem),
      );
      setFeaturedDatasets(
        (datasets as MarketplaceItem[]).map(convertToFeaturedItem),
      );
      setFeaturedAIOutputs(
        (aiOutputs as MarketplaceItem[]).map(convertToFeaturedItem),
      );
    } catch (err) {
      console.error("Error fetching featured items:", err);
      setError("Failed to fetch featured items");
    }
  }, [identity]);

  const fetchTrendingItems = useCallback(async () => {
    if (!identity) return;

    try {
      const actor = await getActor(identity);

      // Fetch trending items (most viewed and commented) - limit to 20 items each for columns
      const [prompts, datasets, aiOutputs] = await Promise.all([
        actor.get_trending_items("prompt", 20),
        actor.get_trending_items("dataset", 20),
        actor.get_trending_items("ai_output", 20),
      ]);

      setTrendingPrompts(
        (prompts as MarketplaceItem[]).map(convertToTrendingItem),
      );
      setTrendingDatasets(
        (datasets as MarketplaceItem[]).map(convertToTrendingItem),
      );
      setTrendingAIOutputs(
        (aiOutputs as MarketplaceItem[]).map(convertToTrendingItem),
      );
    } catch (err) {
      console.error("Error fetching trending items:", err);
      setError("Failed to fetch trending items");
    }
  }, [identity]);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);

    await Promise.all([fetchFeaturedItems(), fetchTrendingItems()]);

    setLoading(false);
  }, [fetchFeaturedItems, fetchTrendingItems]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return {
    // Featured items
    featuredPrompts,
    featuredDatasets,
    featuredAIOutputs,

    // Trending items
    trendingPrompts,
    trendingDatasets,
    trendingAIOutputs,

    // Trending items split into columns
    trendingPromptsColumns: splitIntoColumns(trendingPrompts, 4),
    trendingDatasetsColumns: splitIntoColumns(trendingDatasets, 2),
    trendingAIOutputsColumns: splitIntoColumns(trendingAIOutputs, 2),

    // State
    loading,
    error,

    // Refresh function
    refresh: fetchAllData,
  };
}
