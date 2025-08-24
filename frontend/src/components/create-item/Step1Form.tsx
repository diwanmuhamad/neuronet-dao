"use client";

import React, { useState } from "react";
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
  const [uploadingContent, setUploadingContent] = useState(false);

  // Upload content to S3 and get hash
  const uploadContentToS3 = async (
    content: string,
    itemType: string
  ): Promise<{
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
      const isDuplicate = await actor.check_content_duplicate(
        result.contentHash
      );
      if (isDuplicate) {
        throw new Error(
          "This content already exists on the marketplace. Please create unique content."
        );
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
      const uploadResult = await uploadContentToS3(
        formData.content,
        formData.itemType
      );

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
      setMessage(
        error instanceof Error ? error.message : "Failed to upload content."
      );
    } finally {
      setUploadingContent(false);
    }
  };

  return (
    <div className="p-8">
      <div className="w-full mx-auto">
        {/* Elegant Card Container */}
        <div className="relative bg-gray-900/40 backdrop-blur-2xl border border-gray-700/30 rounded-3xl p-8 shadow-2xl">
          {/* Subtle Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-cyan-500/5 rounded-3xl pointer-events-none" />

          {/* Header */}
          <div className="relative text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-100 mb-2">
              Item Details
            </h2>
            <p className="text-gray-400 text-sm">
              Provide information about your AI creation
            </p>
          </div>

          <div className="relative space-y-6">
            {/* Title */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title
              </label>
              <input
                id="title"
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/30 rounded-xl outline-none focus:ring-2 focus:ring-violet-400/50 focus:border-violet-400/50 transition-all duration-300 text-gray-100 placeholder-gray-400 shadow-sm group-hover:border-gray-500/40"
                value={formData.title}
                onChange={(e) => updateFormData({ title: e.target.value })}
                required
                autoComplete="off"
                placeholder="Enter a descriptive title"
              />
            </div>

            {/* Price and Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Price (ICP)
                </label>
                <input
                  id="price"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/30 rounded-xl outline-none focus:ring-2 focus:ring-violet-400/50 focus:border-violet-400/50 transition-all duration-300 text-gray-100 placeholder-gray-400 shadow-sm group-hover:border-gray-500/40"
                  type="number"
                  value={formData.price}
                  onChange={(e) => {
                    const value = e.target.value;
                    const decimalPart = value.split(".")[1];
                    if (decimalPart && decimalPart.length > 8) {
                      const truncated = parseFloat(value).toFixed(8);
                      updateFormData({ price: truncated });
                    } else {
                      updateFormData({ price: value });
                    }
                  }}
                  required
                  autoComplete="off"
                  placeholder="0.00"
                  min="0"
                  step="0.00000001"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Item Type
                </label>
                <div className="relative">
                  <select
                    id="itemType"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/30 rounded-xl outline-none focus:ring-2 focus:ring-violet-400/50 focus:border-violet-400/50 transition-all duration-300 text-gray-100 shadow-sm appearance-none cursor-pointer group-hover:border-gray-500/40"
                    value={formData.itemType}
                    onChange={(e) => {
                      updateFormData({
                        itemType: e.target.value as
                          | "prompt"
                          | "dataset"
                          | "ai_output",
                        category: "",
                      });
                    }}
                  >
                    <option value="prompt">Prompt</option>
                    <option value="dataset">Dataset</option>
                    <option value="ai_output">AI Output</option>
                  </select>
                  <svg
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <div className="relative">
                <select
                  id="category"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/30 rounded-xl outline-none focus:ring-2 focus:ring-violet-400/50 focus:border-violet-400/50 transition-all duration-300 text-gray-100 shadow-sm appearance-none cursor-pointer group-hover:border-gray-500/40"
                  value={formData.category}
                  onChange={(e) => updateFormData({ category: e.target.value })}
                  required
                >
                  <option value="">Choose a category</option>
                  {getCategoriesByType(formData.itemType).map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <svg
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Content */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Content
              </label>
              {formData.itemType === "ai_output" ? (
                <div className="space-y-3">
                  <input
                    type="file"
                    id="content"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const maxSize = 1024 * 1024;
                        if (file.size > maxSize) {
                          setMessage(
                            "File size exceeds 1MB limit. Please choose a smaller image."
                          );
                          return;
                        }
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const result = event.target?.result as string;
                          updateFormData({ content: result });
                          setMessage("");
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                  <label
                    htmlFor="content"
                    className="flex flex-col items-center justify-center w-full h-32 bg-gray-800/30 border-2 border-dashed border-gray-600/40 rounded-xl cursor-pointer hover:bg-gray-700/30 hover:border-violet-400/60 transition-all duration-300 group-hover:border-gray-500/50"
                  >
                    <div className="flex flex-col items-center justify-center p-6">
                      <svg
                        className="w-8 h-8 mb-3 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <p className="mb-1 text-sm text-gray-300">
                        <span className="font-medium">
                          {formData.content
                            ? "Image selected"
                            : "Choose AI Output Image"}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        JPG, PNG (MAX. 1MB)
                      </p>
                    </div>
                  </label>
                  {formData.content && (
                    <div className="text-sm text-emerald-400 text-center font-medium">
                      ✓ Image ready for upload
                    </div>
                  )}
                </div>
              ) : formData.itemType === "dataset" ? (
                <div className="space-y-3">
                  <input
                    type="file"
                    id="content"
                    accept=".csv,text/csv"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const maxSize = 1024 * 1024;
                        if (file.size > maxSize) {
                          setMessage(
                            "File size exceeds 1MB limit. Please choose a smaller CSV file."
                          );
                          return;
                        }
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const result = event.target?.result as string;
                          updateFormData({ content: result });
                          setMessage("");
                        };
                        reader.readAsText(file);
                      }
                    }}
                    className="hidden"
                  />
                  <label
                    htmlFor="content"
                    className="flex flex-col items-center justify-center w-full h-32 bg-gray-800/30 border-2 border-dashed border-gray-600/40 rounded-xl cursor-pointer hover:bg-gray-700/30 hover:border-violet-400/60 transition-all duration-300 group-hover:border-gray-500/50"
                  >
                    <div className="flex flex-col items-center justify-center p-6">
                      <svg
                        className="w-8 h-8 mb-3 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <p className="mb-1 text-sm text-gray-300">
                        <span className="font-medium">
                          {formData.content
                            ? "CSV file selected"
                            : "Choose Dataset File"}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        CSV format (MAX. 1MB)
                      </p>
                    </div>
                  </label>
                  {formData.content && (
                    <div className="text-sm text-emerald-400 text-center font-medium">
                      ✓ CSV file ready for upload
                    </div>
                  )}
                </div>
              ) : (
                <textarea
                  id="content"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/30 rounded-xl outline-none focus:ring-2 focus:ring-violet-400/50 focus:border-violet-400/50 transition-all duration-300 text-gray-100 placeholder-gray-400 shadow-sm resize-none min-h-[120px] group-hover:border-gray-500/40"
                  value={formData.content}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (Buffer.byteLength(value, "utf8") > 1024 * 1024) {
                      setMessage(
                        "Content size exceeds 1MB limit. Please use shorter text."
                      );
                      return;
                    }
                    updateFormData({ content: value });
                    setMessage("");
                  }}
                  required
                  autoComplete="off"
                  placeholder={
                    formData.itemType === "prompt"
                      ? "Enter your AI prompt..."
                      : "Enter content..."
                  }
                />
              )}
              <div className="text-xs text-gray-500 mt-2">Max size: 1MB</div>
            </div>

            {/* Description */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                id="description"
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/30 rounded-xl outline-none focus:ring-2 focus:ring-violet-400/50 focus:border-violet-400/50 transition-all duration-300 text-gray-100 placeholder-gray-400 shadow-sm resize-none min-h-[100px] group-hover:border-gray-500/40"
                value={formData.description}
                onChange={(e) =>
                  updateFormData({ description: e.target.value })
                }
                required
                autoComplete="off"
                placeholder="Describe your item and its use cases..."
              />
            </div>

            {/* License Terms */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                License Terms
              </label>
              <div className="relative">
                <select
                  id="licenseTerms"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/30 rounded-xl outline-none focus:ring-2 focus:ring-violet-400/50 focus:border-violet-400/50 transition-all duration-300 text-gray-100 shadow-sm appearance-none cursor-pointer group-hover:border-gray-500/40"
                  value={formData.licenseTerms}
                  onChange={(e) =>
                    updateFormData({ licenseTerms: e.target.value })
                  }
                  required
                >
                  <option value="Non-commercial use only">
                    Non-commercial use only
                  </option>
                  <option value="Commercial use allowed">
                    Commercial use allowed
                  </option>
                  <option value="Educational use only">
                    Educational use only
                  </option>
                  <option value="Research use only">Research use only</option>
                  <option value="Attribution required">
                    Attribution required
                  </option>
                  <option value="Custom license">Custom license</option>
                </select>
                <svg
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Next Button */}
            <div className="pt-6">
              <button
                className="group relative w-full px-6 py-4 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-xl font-semibold text-base shadow-lg hover:shadow-violet-500/25 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none"
                onClick={handleNext}
                disabled={!principal || uploadingContent}
              >
                <div className="flex items-center justify-center gap-3">
                  {uploadingContent ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Uploading Content...</span>
                    </>
                  ) : (
                    <>
                      <span>Next: Upload Images</span>
                      <svg
                        className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>

          {message && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-400/20 rounded-xl text-red-300 text-center backdrop-blur-sm">
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{message}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
