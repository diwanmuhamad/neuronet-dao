"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { getActor } from "../../../ic/agent";
import { useCategories } from "../../../hooks/useCategories";
import { usePagination } from "../../../hooks/usePagination";
import ItemCard from "../../../components/marketplace/ItemCard";
import FilterDropdown from "../../../components/marketplace/FilterDropdown";
import Navbar from "../../../components/common/Navbar";
import { useAuth } from "@/contexts/AuthContext";

interface MarketplaceItem {
  id: number;
  owner: string;
  title: string;
  description: string;
  price: bigint;
  itemType: string;
  category: string;
  metadata: string;
  comments: any[];
  averageRating: number;
  totalRatings: number;
  createdAt: number;
  updatedAt: number;
}

const ITEMS_PER_PAGE = 20;

export default function MarketplaceTypePage() {
  const params = useParams();
  const type = params.type as string;
  
  const { identity } = useAuth();
  const { categories, itemTypes, loading: categoriesLoading } = useCategories();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Most relevant");
  const [filterBy, setFilterBy] = useState("All Filters");
  const [hoveredItem, setHoveredItem] = useState<MarketplaceItem | null>(null);
  const [totalItems, setTotalItems] = useState(0);

  // Use pagination hook
  const {
    items: allItems,
    loading: paginationLoading,
    hasMore,
    error: paginationError,
    loadMoreThrottled,
    reset: resetPagination,
  } = usePagination<MarketplaceItem>({
    limit: ITEMS_PER_PAGE,
    throttleMs: 300,
  });

  // Fetch items function
  const fetchItems = useCallback(async (page: number, limit: number): Promise<MarketplaceItem[]> => {
    if (!identity) return [];

    try {
      const actor = await getActor(identity);
      const items = await actor.get_items_by_type_paginated(type, page, limit);
      return items as MarketplaceItem[];
    } catch (error) {
      console.error("Failed to fetch items:", error);
      throw new Error("Failed to fetch items");
    }
  }, [identity, type]);

  // Get total count
  const fetchTotalCount = useCallback(async () => {
    if (!identity) return;

    try {
      const actor = await getActor(identity);
      const count = await actor.get_items_count_by_type(type);
      setTotalItems(Number(count));
    } catch (error) {
      console.error("Failed to fetch total count:", error);
    }
  }, [identity, type]);

  // Initialize data
  useEffect(() => {
    if (identity) {
      fetchTotalCount();
      loadMoreThrottled(fetchItems);
    }
  }, [identity, type]);

  // Filter and sort items
  const filteredAndSortedItems = React.useMemo(() => {
    let items = [...allItems];

    // Apply search filter
    if (searchTerm.trim()) {
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Apply category filter
    if (filterBy !== "All Filters") {
      items = items.filter((item) => item.category === filterBy);
    }

    // Helper to compare bigint safely
    const compareBigInt = (a?: bigint | number, b?: bigint | number, asc = true) => {
        const aVal = BigInt(a ?? 0);
        const bVal = BigInt(b ?? 0);
        
        if (aVal === bVal) return 0;
        return asc ? (aVal < bVal ? -1 : 1) : (aVal > bVal ? -1 : 1);
    };

    // Apply sorting
    switch (sortBy) {
        case "Newest":
        items.sort((a, b) => compareBigInt(b.createdAt, a.createdAt, true)); // descending
        break;

        case "Price: Low to High":
        items.sort((a, b) => compareBigInt(a.price, b.price, true)); // ascending
        break;

        case "Price: High to Low":
        items.sort((a, b) => compareBigInt(b.price, a.price, true)); // descending
        break;

        case "Highest Rated":
        items.sort((a, b) => b.averageRating - a.averageRating); // stays number
        break;

        default: // Most relevant
        items.sort((a, b) => compareBigInt(b.totalRatings, a.totalRatings, true));
    }

    return items;
  }, [allItems, searchTerm, filterBy, sortBy]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 1000 &&
        hasMore &&
        !paginationLoading
      ) {
        loadMoreThrottled(fetchItems);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, paginationLoading]);

  const sortOptions = [
    "Most relevant",
    "Newest",
    "Price: Low to High",
    "Price: High to Low",
    "Highest Rated",
  ];
  
  const filterOptions = React.useMemo(() => {
    const categoryNames = categories
      .filter(cat => cat.itemType === type)
      .map(cat => cat.name);
    return ["All Filters", ...categoryNames];
  }, [categories, type]);

  const handleItemHover = (item: MarketplaceItem) => {
    setHoveredItem(item);
  };

  const handleItemLeave = () => {
    setHoveredItem(null);
  };

  const getTypeTitle = (type: string) => {
    switch (type) {
      case 'prompt':
        return 'Prompts';
      case 'dataset':
        return 'Datasets';
      case 'ai_output':
        return 'AI Outputs';
      default:
        return 'Items';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {getTypeTitle(type)} ({totalItems})
            </h1>
            <p className="text-gray-400 mt-1">
              Discover and explore {getTypeTitle(type).toLowerCase()}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <FilterDropdown
              label={filterBy}
              options={filterOptions}
              value={filterBy}
              onChange={setFilterBy}
            />

            <FilterDropdown
              label={sortBy}
              options={sortOptions}
              value={sortBy}
              onChange={setSortBy}
            />
          </div>
        </div>

        {/* Error State */}
        {paginationError && (
          <div className="mb-6 p-4 bg-red-900/50 text-red-300 rounded-lg text-center border border-red-800">
            {paginationError}
          </div>
        )}

        {/* Search Bar */}
        <div className="relative max-w-md mb-8">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder={`Search ${getTypeTitle(type).toLowerCase()}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-white placeholder-gray-400"
          />
        </div>

        {/* Items Grid */}
        {paginationLoading && allItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading {getTypeTitle(type).toLowerCase()}...</p>
          </div>
        ) : filteredAndSortedItems.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            {searchTerm
              ? `No ${getTypeTitle(type).toLowerCase()} found matching "${searchTerm}".`
              : `No ${getTypeTitle(type).toLowerCase()} available.`}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  isHovered={hoveredItem?.id === item.id}
                  onHover={handleItemHover}
                  onLeave={handleItemLeave}
                />
              ))}
            </div>

            {/* Loading indicator for infinite scroll */}
            {hasMore && (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-gray-400 text-sm">Loading more {getTypeTitle(type).toLowerCase()}...</p>
              </div>
            )}

            {/* End of results */}
            {!hasMore && allItems.length > 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400 text-sm">You've reached the end of all {getTypeTitle(type).toLowerCase()}.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
