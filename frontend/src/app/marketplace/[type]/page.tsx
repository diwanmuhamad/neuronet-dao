"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { getActor } from "../../../ic/agent";
import { useCategories } from "../../../hooks/useCategories";
import { usePagination } from "../../../hooks/usePagination";
import { useFilterDrawer } from "../../../hooks/useFilterDrawer";
import ItemCard from "../../../components/marketplace/ItemCard";
import FilterDropdown from "../../../components/marketplace/FilterDropdown";
import FilterDrawer from "../../../components/marketplace/FilterDrawer";
import Navbar from "../../../components/common/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { Item } from "@/components/items/interfaces";

const ITEMS_PER_PAGE = 20;

export default function MarketplaceTypePage() {
  const params = useParams();
  const type = params.type as "prompt" | "dataset" | "ai_output";
  const router = useRouter();

  const { identity, isAuthenticated } = useAuth();
  const { categories } = useCategories();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Most relevant");
  const [hoveredItem, setHoveredItem] = useState<Item | null>(null);
  const [totalItems, setTotalItems] = useState(0);

  // Filter drawer hook
  const {
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    filterSections,

    handleFilterChange,
    clearAllFilters,
    hasActiveFilters,
    getFilteredItems,
  } = useFilterDrawer({
    categories: categories
      .filter((cat) => cat.itemType === type)
      .map((cat) => cat.name),
  });

  // Use pagination hook
  const {
    items: allItems,
    loading: paginationLoading,
    hasMore,
    error: paginationError,
    loadMoreThrottled,
  } = usePagination<Item>({
    limit: ITEMS_PER_PAGE,
    throttleMs: 300,
    resetDependencies: [type],
  });

  // Fetch items function
  const fetchItems = useCallback(
    async (page: number, limit: number): Promise<Item[]> => {
      if (!isAuthenticated) return [];

      try {
        const actor = await getActor(identity || undefined);
        const items = await actor.get_items_by_type_paginated(
          type,
          page,
          limit
        );
        return items as Item[];
      } catch (error) {
        console.error("Failed to fetch items:", error);
        throw new Error("Failed to fetch items");
      }
    },
    [identity, type]
  );

  // Get total count
  const fetchTotalCount = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const actor = await getActor(identity || undefined);
      const count = await actor.get_items_count_by_type(type);
      setTotalItems(Number(count));
    } catch (error) {
      console.error("Failed to fetch total count:", error);
    }
  }, [identity, type]);

  // Initialize data
  useEffect(() => {
    if (isAuthenticated) {
      fetchTotalCount();
      loadMoreThrottled(fetchItems);
    }
  }, [isAuthenticated, type]);

  // Filter and sort items
  const filteredAndSortedItems = React.useMemo(() => {
    let items = [...allItems];

    // Apply search filter
    if (searchTerm.trim()) {
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply drawer filters
    items = getFilteredItems(items);

    // Helper to compare bigint safely
    const compareBigInt = (
      a?: bigint | number,
      b?: bigint | number,
      asc = true
    ) => {
      const aVal = BigInt(a ?? 0);
      const bVal = BigInt(b ?? 0);

      if (aVal === bVal) return 0;
      return asc ? (aVal < bVal ? -1 : 1) : aVal > bVal ? -1 : 1;
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
        items.sort((a, b) =>
          compareBigInt(b.totalRatings, a.totalRatings, true)
        );
    }

    return items;
  }, [allItems, searchTerm, sortBy, getFilteredItems]);

  // Calculate if we have more items to load based on total count
  const actualHasMore = React.useMemo(() => {
    if (totalItems === 0) return false;
    return allItems.length < totalItems && hasMore;
  }, [allItems.length, totalItems, hasMore]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 1000 &&
        actualHasMore &&
        !paginationLoading
      ) {
        loadMoreThrottled(fetchItems);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [actualHasMore, paginationLoading]);

  const sortOptions = [
    "Most relevant",
    "Newest",
    "Price: Low to High",
    "Price: High to Low",
    "Highest Rated",
  ];

  const handleItemHover = (item: Item) => {
    setHoveredItem(item);
  };

  const handleItemLeave = () => {
    setHoveredItem(null);
  };

  const getTypeTitle = (type: string) => {
    switch (type) {
      case "prompt":
        return "Prompts";
      case "dataset":
        return "Datasets";
      case "ai_output":
        return "AI Outputs";
      default:
        return "Items";
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
            {isAuthenticated && (
              <button
                onClick={() => router.push("/create-item")}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-pink-400 text-white rounded-lg font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200 cursor-pointer"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span>Create New Item</span>
              </button>
            )}

            <button
              onClick={openDrawer}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors border text-sm font-medium ${
                hasActiveFilters
                  ? "bg-purple-600 hover:bg-purple-700 text-white border-purple-600"
                  : "bg-gray-800 hover:bg-gray-700 text-white border-gray-700"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"
                />
              </svg>
              <span>Filters</span>
              {hasActiveFilters && (
                <div className="w-2 h-2 bg-white rounded-full"></div>
              )}
            </button>

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
            <p className="text-gray-400">
              Loading {getTypeTitle(type).toLowerCase()}...
            </p>
          </div>
        ) : filteredAndSortedItems.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            {searchTerm
              ? `No ${getTypeTitle(
                  type
                ).toLowerCase()} found matching "${searchTerm}".`
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
            {paginationLoading && allItems.length > 0 && (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-gray-400 text-sm">
                  Loading more {getTypeTitle(type).toLowerCase()}...
                </p>
              </div>
            )}

            {/* End of results */}
            {!actualHasMore &&
              allItems.length > 0 &&
              !paginationLoading &&
              allItems.length >= totalItems && (
                <div className="text-center py-8">
                  <p className="text-gray-400 text-sm">
                    You&apos;ve reached the end. Showing all {totalItems}{" "}
                    {getTypeTitle(type).toLowerCase()}.
                  </p>
                </div>
              )}
          </>
        )}
      </div>

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        filterSections={filterSections}
        onFilterChange={handleFilterChange}
        onClearAll={clearAllFilters}
      />
    </div>
  );
}
