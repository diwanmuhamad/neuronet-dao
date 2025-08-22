import { useState, useEffect } from "react";
import { getActor } from "../ic/agent";
import { useAnonymousWallet } from "./useAnonymousWallet";
import { useAuth } from "@/contexts/AuthContext";

export interface Category {
  id: number;
  name: string;
  itemType: string;
  description: string;
}

export const useCategories = () => {
  const { identity } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [itemTypes, setItemTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async (itemType?: string) => {
    if (!identity) return;

    setLoading(true);
    setError(null);

    try {
      const actor = await getActor(identity);
      const result = await actor.get_categories(itemType ? [itemType] : []);
      setCategories(result as Category[]);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setError("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const fetchItemTypes = async () => {
    if (!identity) return;

    try {
      const actor = await getActor(identity);
      const result = await actor.get_item_types();
      setItemTypes(result as string[]);
    } catch (err) {
      console.error("Failed to fetch item types:", err);
    }
  };

  useEffect(() => {
    if (identity) {
      fetchCategories();
      fetchItemTypes();
    }
  }, [identity]);

  const getCategoriesByType = (itemType: string): Category[] => {
    return categories.filter((cat) => cat.itemType === itemType);
  };

  const getPromptCategories = (): Category[] => getCategoriesByType("prompt");
  const getDatasetCategories = (): Category[] => getCategoriesByType("dataset");
  const getAIOutputCategories = (): Category[] =>
    getCategoriesByType("ai_output");

  return {
    categories,
    itemTypes,
    loading,
    error,
    fetchCategories,
    fetchItemTypes,
    getCategoriesByType,
    getPromptCategories,
    getDatasetCategories,
    getAIOutputCategories,
  };
};
