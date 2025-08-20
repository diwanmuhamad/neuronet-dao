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
  // S3 storage fields
  contentHash?: string;
  contentFileKey?: string;
  contentFileName?: string;
  contentRetrievalUrl?: string;
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
  const [uploadingContent, setUploadingContent] = useState(false);

  // Upload content to S3 and get hash
  const uploadContentToS3 = async (content: string, itemType: string): Promise<{
    contentHash: string;
    fileKey: string;
    fileName: string;
    retrievalUrl: string;
  } | null> => {
    if (!principal || !actor) return null;

    try {
      const response = await fetch("/api/upload/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          itemType,
          principal: principal.toString(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to upload content");
      }

      const result = await response.json();
      
      // Check for duplicate content on the canister
      const isDuplicate = await actor.check_content_duplicate(result.contentHash);
      if (isDuplicate) {
        throw new Error("This content already exists on the marketplace. Please create unique content.");
      }

      return {
        contentHash: result.contentHash,
        fileKey: result.fileKey,
        fileName: result.fileName,
        retrievalUrl: result.retrievalUrl,
      };
    } catch (error) {
      console.error("Error uploading content:", error);
      throw error;
    }
  };

  const handleNext = async () => {
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

    setUploadingContent(true);
    setMessage("Uploading content to S3...");

    try {
      const uploadResult = await uploadContentToS3(formData.content, formData.itemType);
      
      if (uploadResult) {
        // Update form data with S3 information
        updateFormData({
          contentHash: uploadResult.contentHash,
          contentFileKey: uploadResult.fileKey,
          contentFileName: uploadResult.fileName,
          contentRetrievalUrl: uploadResult.retrievalUrl,
        });
        
        setMessage("");
        onNext();
      } else {
        setMessage("Failed to upload content.");
      }
    } catch (error) {
      console.error("Error uploading content:", error);
      setMessage(error instanceof Error ? error.message : "Failed to upload content.");
    } finally {
      setUploadingContent(false);
    }
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
            {formData.itemType === "ai_output" ? (
              <div className="space-y-2">
                <input
                  type="file"
                  id="content"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // Check file size (1MB limit)
                      const maxSize = 1024 * 1024; // 1MB
                      if (file.size > maxSize) {
                        setMessage("File size exceeds 1MB limit. Please choose a smaller image.");
                        return;
                      }
                      
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const result = event.target?.result as string;
                        updateFormData({ content: result });
                        setMessage(""); // Clear any previous error messages
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden"
                />
                <label
                  htmlFor="content"
                  className="block w-full px-4 py-3 bg-white/30 border border-white/40 rounded-xl cursor-pointer hover:bg-white/40 transition-all text-center text-black/90"
                >
                  {formData.content ? "Image selected" : "Choose AI Output Image (JPG, PNG)"}
                </label>
                <div className="text-xs text-gray-500 text-center">
                  Max file size: 1MB
                </div>
                {formData.content && (
                  <div className="text-xs text-green-600 text-center">
                    ✓ Image ready for upload
                  </div>
                )}
              </div>
            ) : formData.itemType === "dataset" ? (
              <div className="space-y-2">
                <input
                  type="file"
                  id="content"
                  accept=".csv,text/csv"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // Check file size (1MB limit)
                      const maxSize = 1024 * 1024; // 1MB
                      if (file.size > maxSize) {
                        setMessage("File size exceeds 1MB limit. Please choose a smaller CSV file.");
                        return;
                      }
                      
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const result = event.target?.result as string;
                        updateFormData({ content: result });
                        setMessage(""); // Clear any previous error messages
                      };
                      reader.readAsText(file);
                    }
                  }}
                  className="hidden"
                />
                <label
                  htmlFor="content"
                  className="block w-full px-4 py-3 bg-white/30 border border-white/40 rounded-xl cursor-pointer hover:bg-white/40 transition-all text-center text-black/90"
                >
                  {formData.content ? "CSV file selected" : "Choose Dataset File (CSV)"}
                </label>
                <div className="text-xs text-gray-500 text-center">
                  Max file size: 1MB
                </div>
                {formData.content && (
                  <div className="text-xs text-green-600 text-center">
                    ✓ CSV file ready for upload
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <textarea
                  id="content"
                  className="peer w-full px-4 pt-6 pb-2 bg-white/30 border border-white/40 rounded-xl outline-none focus:ring-2 focus:ring-indigo-300 transition-all placeholder-transparent text-black/90 shadow-sm resize-none min-h-[80px] backdrop-blur-md"
                  value={formData.content}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Check if content would exceed 1MB (approximately 1,000,000 characters for UTF-8)
                    if (Buffer.byteLength(value, 'utf8') > 1024 * 1024) {
                      setMessage("Content size exceeds 1MB limit. Please use shorter text.");
                      return;
                    }
                    updateFormData({ content: value });
                    setMessage(""); // Clear any previous error messages
                  }}
                  required
                  autoComplete="off"
                  placeholder="Content"
                />
                <div className="text-xs text-gray-500 text-right">
                  Max size: 1MB
                </div>
              </div>
            )}
            <label
              htmlFor="content"
              className={`absolute left-4 top-2 text-black/60 text-sm font-semibold pointer-events-none transition-all duration-200 ${
                formData.itemType === "ai_output" || formData.itemType === "dataset"
                  ? "hidden" 
                  : "peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-black/40 peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-500"
              }`}
            >
              {formData.itemType === "prompt"
                ? "Prompt"
                : formData.itemType === "dataset"
                  ? "Dataset (CSV format)"
                  : "Output Link"}
            </label>

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
            className="w-full px-4 py-3 bg-gradient-to-r from-indigo-500 to-pink-400 text-white rounded-full font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleNext}
            disabled={!principal || uploadingContent}
          >
            {uploadingContent ? "Uploading Content..." : "Next: Upload Images"}
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
