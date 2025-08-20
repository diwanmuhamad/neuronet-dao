"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface TrendingItem {
  id?: number;
  rank: number;
  title: string;
  category: string;
  price: string;
  rating: number;
  image?: string;
  thumbnailImages?: string[];
}

interface TrendingColumn {
  items: TrendingItem[];
}

interface TrendingSectionProps {
  title: string;
  columns: TrendingColumn[];
  backgroundColor?: string;
  itemType?: "prompt" | "dataset" | "ai-output";
}

const DEFAULT_IMAGE = "/placeholder_default.svg";

const getItemImage = (item: TrendingItem) => {
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

export default function TrendingSection({
  title,
  columns,
  backgroundColor = "bg-gray-900/50",
  itemType = "prompt",
}: TrendingSectionProps) {
  const getRankBadgeColor = (itemType: string) => {
    switch (itemType) {
      case "dataset":
        return "bg-blue-500";
      case "ai-output":
        return "bg-green-500";
      default:
        return "bg-violet-500";
    }
  };

  const router = useRouter();
  const handleItemClick = (item: TrendingItem) => {
    router.push(`/marketplace/items/${item.id}`);
  };

  return (
    <section className={`py-16 px-8 ${backgroundColor}`}>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8">{title}</h2>

        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns.length} gap-8`}
        >
          {columns.map((column, columnIndex) => (
            <div key={columnIndex} className="space-y-4">
              {column.items.map((item) => {
                const imageUrl = getItemImage(item);
                console.log(imageUrl);
                return (
                  <div
                    key={item.rank}
                    className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-all cursor-pointer"
                    onClick={() => handleItemClick(item)}
                  >
                    <div
                      className={`w-8 h-8 ${getRankBadgeColor(
                        itemType
                      )} rounded-lg flex items-center justify-center font-bold text-white text-sm`}
                    >
                      {item.rank}
                    </div>
                    <div className="w-12 h-12 bg-gray-700 rounded-lg overflow-hidden">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={item.title}
                          width={600} // set an explicit width
                          height={192} // set an explicit height (48 * 4 = 192px)
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-700"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white text-sm font-medium truncate">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-400">
                          {item.category}
                        </span>

                        {item.rating > 0 && (
                          <div className="flex items-center gap-1 text-yellow-400 text-xs">
                            ★ {item.rating}
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="text-white font-bold text-sm">
                      {item.price} ICP
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
