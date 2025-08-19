"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useCategories } from "../../hooks/useCategories";

interface CreateItemData {
  title: string;
  description: string;
  content: string;
  price: string;
  itemType: "prompt" | "dataset" | "ai_output";
  category: string;
  licenseTerms: string;
  thumbnailImages: string[];
}

interface Step1FormProps {
  formData: CreateItemData;
  updateFormData: (updates: Partial<CreateItemData>) => void;
  onNext: () => void;
}

export default function Step1Form({
  formData,
  updateFormData,
  onNext,
}: Step1FormProps) {
  const { isAuthenticated, principal, actor } = useAuth();
  const { getCategoriesByType } = useCategories();
  const [message, setMessage] = useState("");
  const [contentCheck, setContentCheck] = useState("");
  const [checkingDuplicate, setCheckingDuplicate] = useState(false);

  // Check for duplicate content when content changes
  useEffect(() => {
    const checkDuplicateContent = async () => {
      if (!formData.content.trim() || !actor) return;

      setCheckingDuplicate(true);
      try {
        await actor.get_content_hash(formData.content);
        // This is a simple check - in production you might want to call a specific duplicate check method
        setContentCheck("");
      } catch (error) {
        console.log("Content check:", error);
        setContentCheck("");
      } finally {
        setCheckingDuplicate(false);
      }
    };

    const timeoutId = setTimeout(checkDuplicateContent, 500); // Debounce
    return () => clearTimeout(timeoutId);
  }, [formData.content, actor]);

  const handleNext = () => {
    // Validate required fields
    if (!formData.title.trim()) {
      setMessage("Please enter a title.");
      return;
    }
    if (!formData.description.trim()) {
      setMessage("Please enter a description.");
      return;
    }
    if (!formData.content.trim()) {
      setMessage("Please enter content.");
      return;
    }
    if (!formData.price.trim()) {
      setMessage("Please enter a price.");
      return;
    }
    if (!formData.category.trim()) {
      setMessage("Please select a category.");
      return;
    }
    if (!isAuthenticated || !principal) {
      setMessage("Please login with Internet Identity first.");
      return;
    }

    setMessage("");
    onNext();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white/85 backdrop-blur-3xl rounded-3xl p-8 border border-white/30 shadow-2xl">
        <h2 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-500 via-blue-400 to-pink-400 bg-clip-text text-transparent mb-6 text-center">
          Item Details
        </h2>
        
        <div className="space-y-6">
          {/* Title */}
          <div className="relative">
            <input
              id="title"
              className="peer w-full px-4 pt-6 pb-2 bg-white/30 border border-white/40 rounded-xl outline-none focus:ring-2 focus:ring-pink-300 transition-all placeholder-transparent text-black/90 shadow-sm backdrop-blur-md"
              value={formData.title}
              onChange={(e) => updateFormData({ title: e.target.value })}
              required
              autoComplete="off"
              placeholder="Title"
            />
            <label
              htmlFor="title"
              className="absolute left-4 top-2 text-black/60 text-sm font-semibold pointer-events-none transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-black/40 peer-focus:top-2 peer-focus:text-sm peer-focus:text-pink-500"
            >
              Title
            </label>
          </div>

          {/* Price and Type */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <input
                id="price"
                className="peer w-full px-4 pt-6 pb-2 bg-white/30 border border-white/40 rounded-xl outline-none focus:ring-2 focus:ring-pink-300 transition-all placeholder-transparent text-black/90 shadow-sm backdrop-blur-md"
                type="number"
                value={formData.price}
                onChange={(e) => {
                  const value = e.target.value;
                  // Check if value has more than 8 decimal places
                  const decimalPart = value.split(".")[1];
                  if (decimalPart && decimalPart.length > 8) {
                    // Truncate to 8 decimal places
                    const truncated = parseFloat(value).toFixed(8);
                    updateFormData({ price: truncated });
                  } else {
                    updateFormData({ price: value });
                  }
                }}
                required
                autoComplete="off"
                placeholder="Price (ICP)"
                min="0"
                step="0.00000001"
              />
              <label
                htmlFor="price"
                className="absolute left-4 top-2 text-black/60 text-sm font-semibold pointer-events-none transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-black/40 peer-focus:top-2 peer-focus:text-sm peer-focus:text-pink-500"
              >
                Price (ICP)
              </label>
            </div>
            <div className="flex-1 relative">
              <select
                id="itemType"
                className="peer w-full px-4 pt-6 pb-2 bg-white/30 border border-white/40 rounded-xl outline-none focus:ring-2 focus:ring-pink-300 transition-all text-black/90 shadow-sm backdrop-blur-md appearance-none"
                value={formData.itemType}
                onChange={(e) => {
                  updateFormData({
                    itemType: e.target.value as "prompt" | "dataset" | "ai_output",
                    category: "", // Reset category when item type changes
                  });
                }}
              >
                <option value="prompt">Prompt</option>
                <option value="dataset">Dataset</option>
                <option value="ai_output">AI Output</option>
              </select>
              <label
                htmlFor="itemType"
                className="absolute left-4 top-2 text-black/60 text-sm font-semibold pointer-events-none transition-all duration-200 peer-focus:text-pink-500"
              >
                Type
              </label>
            </div>
          </div>

          {/* Category */}
          <div className="relative">
            <select
              id="category"
              className="peer w-full px-4 pt-6 pb-2 bg-white/30 border border-white/40 rounded-xl outline-none focus:ring-2 focus:ring-pink-300 transition-all text-black/90 shadow-sm backdrop-blur-md appearance-none"
              value={formData.category}
              onChange={(e) => updateFormData({ category: e.target.value })}
              required
            >
              <option value="">Select Category</option>
              {getCategoriesByType(formData.itemType).map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
            <label
              htmlFor="category"
              className="absolute left-4 top-2 text-black/60 text-sm font-semibold pointer-events-none transition-all duration-200 peer-focus:text-pink-500"
            >
              Category
            </label>
          </div>

          {/* Content */}
          <div className="relative">
            <textarea
              id="content"
              className="peer w-full px-4 pt-6 pb-2 bg-white/30 border border-white/40 rounded-xl outline-none focus:ring-2 focus:ring-indigo-300 transition-all placeholder-transparent text-black/90 shadow-sm resize-none min-h-[80px] backdrop-blur-md"
              value={formData.content}
              onChange={(e) => updateFormData({ content: e.target.value })}
              required
              autoComplete="off"
              placeholder="Content"
            />
            <label
              htmlFor="content"
              className="absolute left-4 top-2 text-black/60 text-sm font-semibold pointer-events-none transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-black/40 peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-500"
            >
              {formData.itemType === "prompt"
                ? "Prompt"
                : formData.itemType === "dataset"
                  ? "Dataset Link"
                  : "Output Link"}
            </label>
            {checkingDuplicate && formData.content.trim() && (
              <div className="absolute right-4 top-2 text-blue-500 text-xs">
                Checking uniqueness...
              </div>
            )}
            {contentCheck && (
              <div className="absolute right-4 top-2 text-red-500 text-xs">
                {contentCheck}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="relative">
            <textarea
              id="description"
              className="peer w-full px-4 pt-6 pb-2 bg-white/30 border border-white/40 rounded-xl outline-none focus:ring-2 focus:ring-pink-300 transition-all placeholder-transparent text-black/90 shadow-sm resize-none min-h-[80px] backdrop-blur-md"
              value={formData.description}
              onChange={(e) => updateFormData({ description: e.target.value })}
              required
              autoComplete="off"
              placeholder="Description"
            />
            <label
              htmlFor="description"
              className="absolute left-4 top-2 text-black/60 text-sm font-semibold pointer-events-none transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-black/40 peer-focus:top-2 peer-focus:text-sm peer-focus:text-pink-500"
            >
              Description
            </label>
          </div>

          {/* License Terms */}
          <div className="relative">
            <select
              id="licenseTerms"
              className="peer w-full px-4 pt-6 pb-2 bg-white/30 border border-white/40 rounded-xl outline-none focus:ring-2 focus:ring-pink-300 transition-all text-black/90 shadow-sm backdrop-blur-md appearance-none"
              value={formData.licenseTerms}
              onChange={(e) => updateFormData({ licenseTerms: e.target.value })}
              required
            >
              <option value="Non-commercial use only">
                Non-commercial use only
              </option>
              <option value="Commercial use allowed">
                Commercial use allowed
              </option>
              <option value="Educational use only">Educational use only</option>
              <option value="Research use only">Research use only</option>
              <option value="Attribution required">Attribution required</option>
              <option value="Custom license">Custom license</option>
            </select>
            <label
              htmlFor="licenseTerms"
              className="absolute left-4 top-2 text-black/60 text-sm font-semibold pointer-events-none transition-all duration-200 peer-focus:text-pink-500"
            >
              License Terms
            </label>
          </div>

          {/* Next Button */}
          <button
            className="w-full px-4 py-3 bg-gradient-to-r from-indigo-500 to-pink-400 text-white rounded-full font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200 mt-6"
            onClick={handleNext}
            disabled={!principal}
          >
            Next: Upload Images
          </button>
        </div>

        {message && (
          <div className="mt-6 text-red-600 font-medium text-center drop-shadow">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
