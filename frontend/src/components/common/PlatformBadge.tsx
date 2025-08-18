import { Category, useCategories } from "@/hooks/useCategories";
import React, { useEffect, useState } from "react";

interface PlatformBadgeProps {
  category: string; // Optional category field
}

const PlatformBadge: React.FC<PlatformBadgeProps> = ({ category }) => {
  const {
    getPromptCategories,
    getDatasetCategories,
    getAIOutputCategories,
    loading: categoriesLoading,
  } = useCategories();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (categoriesLoading) return;
    const promptCategories = getPromptCategories();
    const datasetCategories = getDatasetCategories();
    const aiOutputCategories = getAIOutputCategories();
    setCategories([
      ...promptCategories,
      ...datasetCategories,
      ...aiOutputCategories,
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoriesLoading]);

  const badges = categories.reduce(
    (
      acc: Record<string, { icon: string; label: string; color: string }>,
      category,
    ) => {
      acc[category.name] = {
        icon: "⚡",
        label: category.name,
        color: "bg-green-600",
      };
      return acc;
    },
    {},
  );

  // Try to find badge by category first, then by itemType
  const badge = badges[category as keyof typeof badges] || {
    icon: "⚡",
    label: "AI Tool",
    color: "bg-gray-600",
  };

  return (
    <>
      {categoriesLoading ? (
        <div className="w-10 h-10 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      ) : (
        <div
          className={`${badge.color} text-white px-3 py-1 rounded-lg font-medium flex items-center gap-2 text-sm`}
        >
          <span>{badge.icon}</span>
          <span>{badge.label}</span>
        </div>
      )}
    </>
  );
};

export default PlatformBadge;
