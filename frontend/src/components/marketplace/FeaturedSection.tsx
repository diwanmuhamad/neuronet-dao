"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import StarRating from "../common/StarRating";
import SecureImage from "../common/SecureImage";

interface FeaturedItem {
  id?: number;
  title: string;
  price: string;
  category: string;
  image: string;
  size?: string;
  type?: string;
  rating?: number;
  thumbnailImages?: string[];
  averageRating?: number;
  totalRatings?: number;
}

interface FeaturedSectionProps {
  title: string;
  items: FeaturedItem[];
  backgroundColor?: string;
  itemType?: "prompt" | "dataset" | "ai-output";
}

const DEFAULT_IMAGE = "/placeholder_default.svg";

export default function FeaturedSection({
  title,
  items,
  backgroundColor = "transparent",
  itemType = "prompt",
}: FeaturedSectionProps) {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);

  const getBadgeColor = (itemType: string) => {
    switch (itemType) {
      case "dataset":
        return "bg-blue-500";
      case "ai-output":
        return "bg-green-500";
      default:
        return "bg-violet-500";
    }
  };

  const getItemImage = (item: FeaturedItem) => {
    // First try to get from thumbnailImages array (from actual marketplace data)
    if (item.thumbnailImages && item.thumbnailImages.length > 0) {
      return item.thumbnailImages[0];
    }
    // Fallback to the image property (from placeholder data)
    if (item.image) {
      return item.image;
    }
    // Final fallback to default image
    return DEFAULT_IMAGE;
  };

  const handleItemClick = (item: FeaturedItem) => {
    router.push(`/marketplace/items/${item.id}`);
  };

  return (
    <section className={`py-16 px-8 ${backgroundColor}`}>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8">{title}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-12">
          {items.map((item, index) => {
            const imageUrl = getItemImage(item);
            const rating = item.averageRating || 0; // Default to 5.0 if no rating
            const totalRatings = item.totalRatings || 0;
            console.log(item);

            return (
              <div
                key={`${item.id}-${index}`}
                className="bg-gray-800/50 rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-purple-500/20"
                onClick={() => handleItemClick(item)}
              >
                <div className="relative">
                  <SecureImage
                    src={imageError ? DEFAULT_IMAGE : imageUrl}
                    alt={item.title}
                    width={600}
                    height={192}
                    className={`w-full object-cover transition-all duration-200 h-48`}
                    onError={() => setImageError(true)}
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-2 py-1 ${getBadgeColor(
                        itemType
                      )} text-white text-xs font-medium rounded-full`}
                    >
                      {item.category}
                    </span>
                  </div>

                  {rating > 0 && (
                    <div className="absolute top-40 right-3 bg-black/70 backdrop-blur-sm text-white flex items-center gap-1 transition-all duration-200 px-2 py-1 rounded-md">
                      <StarRating rating={rating} totalRatings={totalRatings} />
                    </div>
                  )}

                  {item.type && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-1 bg-black/70 text-white text-xs font-medium rounded-full">
                        {item.type}
                      </span>
                    </div>
                  )}
                  {item.size && (
                    <div className="absolute bottom-3 right-3">
                      <span className="px-2 py-1 bg-black/70 text-white text-xs font-medium rounded-full">
                        {item.size}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-white text-sm mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold">
                      {item.price} ICP
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
