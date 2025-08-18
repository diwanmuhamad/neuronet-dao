"use client";
import { useState, useMemo } from "react";

export interface FilterOption {
  label: string;
  value: string;
  checked: boolean;
}

export interface FilterSection {
  title: string;
  options: FilterOption[];
  type: "checkbox" | "radio";
}

interface UseFilterDrawerProps {
  categories: string[]; // Array of category names for the current item type
}

export function useFilterDrawer({ categories }: UseFilterDrawerProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filterSections: FilterSection[] = useMemo(() => {
    // Generate category options based on actual categories
    const categoryOptions = [
      {
        label: "All Categories",
        value: "All",
        checked: selectedCategory === "All",
      },
      ...categories.map((categoryName) => ({
        label: categoryName,
        value: categoryName,
        checked: selectedCategory === categoryName,
      })),
    ];

    return [
      {
        title: "Category",
        options: categoryOptions,
        type: "radio" as const,
      },
    ];
  }, [selectedCategory, categories]);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const handleFilterChange = (
    sectionIndex: number,
    optionIndex: number,
    checked: boolean,
  ) => {
    const section = filterSections[sectionIndex];
    const option = section.options[optionIndex];

    if (section.title === "Category" && checked) {
      setSelectedCategory(option.value);
    }
  };

  const clearAllFilters = () => {
    setSelectedCategory("All");
  };

  const hasActiveFilters = useMemo(() => {
    return selectedCategory !== "All";
  }, [selectedCategory]);

  const getFilteredItems = <
    T extends {
      category?: string;
    },
  >(
    items: T[],
  ): T[] => {
    return items.filter((item) => {
      // Filter by category
      if (selectedCategory !== "All") {
        if (!item.category || item.category !== selectedCategory) {
          return false;
        }
      }

      return true;
    });
  };

  return {
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    filterSections,
    handleFilterChange,
    clearAllFilters,
    hasActiveFilters,
    getFilteredItems,
  };
}
