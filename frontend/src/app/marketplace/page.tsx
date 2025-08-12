"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useAnonymousWallet } from "../../hooks/useAnonymousWallet";
import { getActor } from "../../ic/agent";

import Link from "next/link";
import Image from "next/image";
import Navbar from "../../components/Navbar";

interface MarketplaceItem {
  id: number;
  owner: string;
  title: string;
  description: string;
  price: bigint;
  itemType: string;
  metadata: string;
  comments: Comment[];
  averageRating: number;
  totalRatings: number;
  timestamp?: number;
}

interface Comment {
  id: number;
  itemId: number;
  author: string;
  content: string;
  timestamp: number;
  rating: number;
}

const ITEMS_PER_PAGE = 12;
const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1686191128892-34af9b70e99c?w=400&h=300&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1692607136002-3895c1f212e7?w=400&h=300&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1633174524827-db00a6b7bc74?w=400&h=300&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=300&fit=crop&crop=center",
];

const StarRating = ({
  rating,
  totalRatings,
}: {
  rating: number;
  totalRatings: number;
}) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(
        <svg
          key={i}
          className="w-3 h-3 text-yellow-400 fill-current"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>,
      );
    } else if (i === fullStars && hasHalfStar) {
      stars.push(
        <div key={i} className="relative">
          <svg
            className="w-3 h-3 text-gray-600 fill-current"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <svg
            className="w-3 h-3 text-yellow-400 fill-current absolute top-0 left-0"
            viewBox="0 0 20 20"
            style={{ clipPath: "inset(0 50% 0 0)" }}
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>,
      );
    } else {
      stars.push(
        <svg
          key={i}
          className="w-3 h-3 text-gray-600 fill-current"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>,
      );
    }
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex">{stars}</div>
      <span className="text-xs text-white ml-1 font-medium">
        {rating > 0 ? rating.toFixed(1) : "5.0"}{" "}
        {totalRatings > 0 && `(${totalRatings})`}
      </span>
    </div>
  );
};

const getPlatformBadge = (itemType: string) => {
  const badges = {
    "AI Image": { icon: "🖼️", label: "Midjourney", color: "bg-purple-600" },
    Text: { icon: "💬", label: "ChatGPT", color: "bg-green-600" },
    Video: { icon: "🎥", label: "Midjourney Video", color: "bg-red-600" },
    Audio: { icon: "🎵", label: "Audio AI", color: "bg-blue-600" },
    Code: { icon: "💻", label: "Code AI", color: "bg-yellow-600" },
    Data: { icon: "📊", label: "Data AI", color: "bg-indigo-600" },
  };

  return (
    badges[itemType as keyof typeof badges] || {
      icon: "⚡",
      label: "AI Tool",
      color: "bg-gray-600",
    }
  );
};

const getRandomImage = (id: number | bigint) => {
  const numId = typeof id === "bigint" ? Number(id) : id;
  return PLACEHOLDER_IMAGES[numId % PLACEHOLDER_IMAGES.length];
};

const ItemCard = ({
  item,
  isHovered,
  onHover,
  onLeave,
}: {
  item: MarketplaceItem;
  isHovered: boolean;
  onHover: (item: MarketplaceItem) => void;
  onLeave: () => void;
}) => {
  const badge = getPlatformBadge(item.itemType);
  const imageUrl = getRandomImage(item.id);

  return (
    <div
      className={`group cursor-pointer relative transition-transform duration-200 ease-out will-change-transform ${
        isHovered ? "scale-125 z-50" : "scale-100 z-10"
      }`}
      onMouseEnter={() => onHover(item)}
      onMouseLeave={onLeave}
      onClick={() => (window.location.href = `/marketplace/${item.id}`)}
    >
      <div
        className={`bg-gray-800 rounded-xl overflow-hidden transition-all duration-200 border ${
          isHovered
            ? "border-purple-500 shadow-xl shadow-purple-500/20"
            : "border-gray-700 hover:border-gray-600"
        }`}
      >
        <div className="relative">
          <Image
            src={imageUrl}
            alt={item.title}
            width={400}
            height={240}
            className={`w-full object-cover transition-all duration-200 ${
              isHovered ? "h-60" : "h-48"
            }`}
          />

          {/* Platform Badge */}
          <div className="absolute top-3 left-3">
            <div
              className={`${badge.color} text-white font-medium flex items-center gap-1 transition-all duration-200 ${
                isHovered
                  ? "text-sm px-3 py-2 rounded-lg"
                  : "text-xs px-2 py-1 rounded-md"
              }`}
            >
              <span>{badge.icon}</span>
              <span>{badge.label}</span>
            </div>
          </div>

          {/* Rating Badge */}
          <div className="absolute top-3 right-3">
            <div
              className={`bg-black/70 backdrop-blur-sm text-white flex items-center gap-1 transition-all duration-200 ${
                isHovered ? "px-3 py-2 rounded-lg" : "px-2 py-1 rounded-md"
              }`}
            >
              <StarRating
                rating={item.averageRating || 5.0}
                totalRatings={item.totalRatings}
              />
            </div>
          </div>

          {/* Type Badge */}
          {item.itemType && (
            <div className="absolute bottom-3 right-3">
              <span
                className={`bg-yellow-500 text-black font-bold transition-all duration-200 ${
                  isHovered
                    ? "text-sm px-3 py-2 rounded-lg"
                    : "text-xs px-2 py-1 rounded-md"
                }`}
              >
                ✨ Veo
              </span>
            </div>
          )}

          {/* Expanded Details (only show when hovered) */}
          {isHovered && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end">
              <div className="p-5 w-full">
                <p className="text-white text-sm opacity-90 line-clamp-2 mb-3">
                  {item.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-white text-xs opacity-75">
                    {item.comments?.length || 0} comments
                  </span>
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-lg text-xs font-semibold">
                    Get prompt
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div
          className={`transition-all duration-200 ${isHovered ? "p-5" : "p-4"}`}
        >
          <h3
            className={`text-white font-medium mb-2 line-clamp-2 group-hover:text-gray-300 transition-all duration-200 ${
              isHovered ? "text-base" : "text-sm"
            }`}
          >
            {item.title}
          </h3>

          <div className="flex items-center justify-between">
            <span
              className={`text-white font-bold transition-all duration-200 ${
                isHovered ? "text-xl" : "text-base"
              }`}
            >
              ${((Number(item.price) / 100_000_000) * 10).toFixed(2)}
            </span>
            <span
              className={`text-gray-400 transition-all duration-200 ${
                isHovered ? "text-sm" : "text-xs"
              }`}
            >
              {item.itemType || "AI Tool"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const FilterDropdown = ({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors border border-gray-700 text-sm"
      >
        <span>{label}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                  value === option
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function MarketplacePage() {
  const { principal, connect, disconnect, loading, identity, balance } =
    useAnonymousWallet();

  const [allItems, setAllItems] = useState<MarketplaceItem[]>([]);
  const [displayedItems, setDisplayedItems] = useState<MarketplaceItem[]>([]);
  const [fetching, setFetching] = useState(false);
  const [message, setMessage] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Most relevant");
  const [filterBy, setFilterBy] = useState("All Filters");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const [hoveredItem, setHoveredItem] = useState<MarketplaceItem | null>(null);

  const fetchItems = useCallback(async () => {
    setFetching(true);
    try {
      const actor = await getActor(identity || undefined);
      console.log("Testing canister connection...");
      const items = (await actor.get_items()) as MarketplaceItem[];
      console.log("Successfully fetched items:", items);

      // Add timestamp for sorting (using id as proxy for creation order)
      const itemsWithTimestamp = items.map((item) => ({
        ...item,
        timestamp: item.id,
      }));

      setAllItems(itemsWithTimestamp);
      setDisplayedItems(itemsWithTimestamp.slice(0, ITEMS_PER_PAGE));
      setCurrentPage(1);
      setHasMoreItems(itemsWithTimestamp.length > ITEMS_PER_PAGE);
    } catch (e) {
      console.error("Failed to fetch items:", e);
      setMessage("Failed to fetch items.");
    }
    setFetching(false);
  }, [identity]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
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
      items = items.filter((item) => item.itemType === filterBy);
    }

    // Apply sorting
    switch (sortBy) {
      case "Newest":
        items.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        break;
      case "Price: Low to High":
        items.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "Price: High to Low":
        items.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "Highest Rated":
        items.sort((a, b) => b.averageRating - a.averageRating);
        break;
      default: // Most relevant
        items.sort((a, b) => (b.totalRatings || 0) - (a.totalRatings || 0));
    }

    return items;
  }, [allItems, searchTerm, filterBy, sortBy]);

  // Update displayed items
  useEffect(() => {
    const itemsToShow = filteredAndSortedItems.slice(
      0,
      currentPage * ITEMS_PER_PAGE,
    );
    setDisplayedItems(itemsToShow);
    setHasMoreItems(itemsToShow.length < filteredAndSortedItems.length);
  }, [filteredAndSortedItems, currentPage]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 1000 &&
        hasMoreItems &&
        !fetching
      ) {
        setCurrentPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMoreItems, fetching]);

  const sortOptions = [
    "Most relevant",
    "Newest",
    "Price: Low to High",
    "Price: High to Low",
    "Highest Rated",
  ];
  const filterOptions = [
    "All Filters",
    "AI Image",
    "Text",
    "Video",
    "Audio",
    "Code",
    "Data",
  ];

  const handleItemHover = (item: MarketplaceItem) => {
    setHoveredItem(item);
  };

  const handleItemLeave = () => {
    setHoveredItem(null);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">Trending Prompts</h1>

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

        {message && (
          <div className="mb-6 p-4 bg-blue-900/50 text-blue-300 rounded-lg text-center border border-blue-800">
            {message}
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
            placeholder="Search prompts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-white placeholder-gray-400"
          />
        </div>

        {/* Items Grid */}
        {fetching && displayedItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading prompts...</p>
          </div>
        ) : filteredAndSortedItems.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            {searchTerm
              ? `No prompts found matching "${searchTerm}".`
              : "No prompts available."}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedItems.map((item) => (
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
            {hasMoreItems && (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-gray-400 text-sm">Loading more prompts...</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
