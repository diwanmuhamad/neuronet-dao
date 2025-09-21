"use client";

import React, { useState } from "react";
import { useAuth } from "@/src/contexts/AuthContext";
import { useCategories } from "@/src/hooks/useCategories";

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
  skipDuplicateCheck?: boolean;
}

export default function Step1Form({
  formData,
  updateFormData,
  onNext,
  skipDuplicateCheck,
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

      // Check for duplicate content on the canister unless explicitly skipped (e.g., update flow)
      if (!skipDuplicateCheck) {
        const isDuplicate = await actor.check_content_duplicate(
          result.contentHash
        );
        if (isDuplicate) {
          throw new Error(
            "This content already exists on the marketplace. Please create unique content."
          );
        }
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
    <div className="create-item__form">
      {/* Header - Enhanced with app's section header pattern and improved typography */}
      <div className="section__header text-center mb-0">
        <h3 className="title title-animation">
          Item Details
        </h3>
        <h3 style={{marginBottom: "60px"}}>
          Provide information about your AI creation
        </h3>
      </div>

      <div className="row gaper">
        {/* Title - Enhanced input styling with gradient backgrounds and improved focus states */}
        <div className="col-12">
          <div className="input-single">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => updateFormData({ title: e.target.value })}
              required
              autoComplete="off"
              placeholder="Enter a descriptive title"
            />
          </div>
        </div>

        {/* Price and Type - Using app's grid system */}
        <div className="col-12 col-md-6">
          <div className="input-single">
            <label htmlFor="price">Price (ICP)</label>
            <input
              id="price"
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
        </div>

        <div className="col-12 col-md-6">
          <div className="input-single">
            <label htmlFor="itemType">Item Type</label>
            <select
              id="itemType"
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
          </div>
        </div>

        {/* Category - Using app's input-single pattern */}
        <div className="col-12">
          <div className="input-single">
            <label htmlFor="category">Category</label>
            <select
              id="category"
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
          </div>
        </div>

        {/* Content - Enhanced file upload areas with improved visual feedback and hover effects */}
        <div className="col-12">
          <div className="input-single">
            <label htmlFor="content">Content</label>
            {formData.itemType === "ai_output" ? (
              <div className="content-upload">
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
                  className="content-upload__area"
                >
                  <div className="content-upload__content">
                    <i className="material-symbols-outlined">cloud_upload</i>
                    <p className="content-upload__text">
                      {formData.content ? "Image selected" : "Choose AI Output Image"}
                    </p>
                    <p className="content-upload__subtext">
                      JPG, PNG (MAX. 1MB)
                    </p>
                  </div>
                </label>
                {formData.content && (
                  <div className="content-upload__success">
                    <i className="material-symbols-outlined">check_circle</i>
                    Image ready for upload
                  </div>
                )}
              </div>
            ) : formData.itemType === "dataset" ? (
              <div className="content-upload">
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
                  className="content-upload__area"
                >
                  <div className="content-upload__content">
                    <i className="material-symbols-outlined">description</i>
                    <p className="content-upload__text">
                      {formData.content ? "CSV file selected" : "Choose Dataset File"}
                    </p>
                    <p className="content-upload__subtext">
                      CSV format (MAX. 1MB)
                    </p>
                  </div>
                </label>
                {formData.content && (
                  <div className="content-upload__success">
                    <i className="material-symbols-outlined">check_circle</i>
                    CSV file ready for upload
                  </div>
                )}
              </div>
            ) : (
              <textarea
                id="content"
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
                rows={5}
              />
            )}
            <div className="tertiary-text mt-2">Max size: 1MB</div>
          </div>
        </div>

        {/* Description - Using app's input-single pattern */}
        <div className="col-12">
          <div className="input-single">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                updateFormData({ description: e.target.value })
              }
              required
              autoComplete="off"
              placeholder="Describe your item and its use cases..."
              rows={4}
            />
          </div>
        </div>

        {/* License Terms - Using app's input-single pattern */}
        <div className="col-12">
          <div className="input-single">
            <label htmlFor="licenseTerms">License Terms</label>
            <select
              id="licenseTerms"
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
          </div>
        </div>

        {/* Next Button - Enhanced with app's button pattern and improved loading states */}
        <div className="col-12">
          <div className="section__content-cta text-center">
            <button
              type="button"
              className="btn btn--primary"
              onClick={handleNext}
              disabled={!principal || uploadingContent}
            >
              {uploadingContent ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Uploading Content...
                </>
              ) : (
                <>
                  Next: Upload Images
                  <i className="material-symbols-outlined">arrow_forward</i>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Error Message - Using app's error styling pattern */}
      {message && (
        <div className="mt-6 p-4 bg-red-500/10 border border-red-400/20 rounded-xl text-red-300 text-center" style={{ marginTop: '15px' }}>
          <div className="flex items-center justify-center gap-2">
            <i className="material-symbols-outlined">error</i>
            <span>{message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
