"use client";
import React from "react";
import Image from "next/image";

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

interface ItemCardProps {
  item: MarketplaceItem;
  isHovered: boolean;
  onHover: (item: MarketplaceItem) => void;
  onLeave: () => void;
}

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

export default function ItemCard({
  item,
  isHovered,
  onHover,
  onLeave,
}: ItemCardProps) {
  const badge = getPlatformBadge(item.itemType);
  const imageUrl = getRandomImage(item.id);

  return (
    <div
      className={`group cursor-pointer relative transition-transform duration-200 ease-out will-change-transform ${
        isHovered ? "scale-125 z-50" : "scale-100 z-10"
      }`}
      onMouseEnter={() => onHover(item)}
      onMouseLeave={onLeave}
      onClick={() => (window.location.href = `/marketplace/items/${item.id}`)}
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
                ✨ {item.itemType}
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
                    Get {item.itemType}
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
              {(Number(item.price) / 100_000_000).toFixed(2)} ICP
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
}
