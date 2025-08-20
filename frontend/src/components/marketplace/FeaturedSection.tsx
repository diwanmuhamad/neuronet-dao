"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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

const StarRating = ({
  rating,
  totalRatings,
}: {
  rating: number;
  totalRatings?: number;
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
        </svg>
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
        </div>
      );
    } else {
      stars.push(
        <svg
          key={i}
          className="w-3 h-3 text-gray-600 fill-current"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex">{stars}</div>
      <span className="text-xs text-white ml-1 font-medium">
        {rating > 0 ? rating.toFixed(1) : "0.0"}{" "}
        {totalRatings && totalRatings > 0 && `(${totalRatings})`}
      </span>
    </div>
  );
};

export default function FeaturedSection({
  title,
  items,
  backgroundColor = "transparent",
  itemType = "prompt",
}: FeaturedSectionProps) {
  const router = useRouter();

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
                key={item.id || index}
                className="bg-gray-800/50 rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-purple-500/20"
                onClick={() => handleItemClick(item)}
              >
                <div className="relative">
                  <Image
                    src={imageUrl}
                    alt={item.title}
                    width={600}
                    height={192}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = DEFAULT_IMAGE;
                    }}
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
