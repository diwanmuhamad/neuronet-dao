"use client";
import React from "react";

interface FeaturedItem {
  title: string;
  price: string;
  category: string;
  image: string;
  size?: string;
  type?: string;
  rating?: number;
}

interface FeaturedSectionProps {
  title: string;
  items: FeaturedItem[];
  backgroundColor?: string;
  itemType?: "prompt" | "dataset" | "ai-output";
}

export default function FeaturedSection({
  title,
  items,
  backgroundColor = "transparent",
  itemType = "prompt",
}: FeaturedSectionProps) {
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

  return (
    <section className={`py-16 px-8 ${backgroundColor}`}>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8">{title}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-12">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-gray-800/50 rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span
                    className={`px-2 py-1 ${getBadgeColor(itemType)} text-white text-xs font-medium rounded-full`}
                  >
                    {item.category}
                  </span>
                </div>
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
                  <span className="text-white font-bold">{item.price} ICP</span>
                  <div className="flex items-center gap-1 text-yellow-400 text-sm">
                    ★★★★★
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
