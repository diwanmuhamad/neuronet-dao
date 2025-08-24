"use client";

import React, { useState, useCallback } from "react";
import SecureImage from "../common/SecureImage";
import { useAuth } from "../../contexts/AuthContext";
import { useDropzone } from "react-dropzone";

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

interface Step2ImagesProps {
  formData: CreateItemData;
  onBack: () => void;
  onComplete: () => void;
}

interface UploadedImage {
  id: string;
  url: string;
  file: File;
  uploading: boolean;
  error?: string;
}

export default function Step2Images({
  formData,
  onBack,
  onComplete,
}: Step2ImagesProps) {
  const { isAuthenticated, principal, actor } = useAuth();
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const uploadToS3 = useCallback(
    async (file: File): Promise<string> => {
      // Get presigned URL from our API
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          principal: principal?.toString(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to get upload URL");
      }

      const { uploadUrl, retrievalUrl } = await response.json();

      // Upload file directly to S3 using presigned URL
      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file to S3");
      }

      return retrievalUrl;
    },
    [principal],
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (uploadedImages.length + acceptedFiles.length > 5) {
        setMessage("Maximum 5 images allowed");
        return;
      }

      const newImages: UploadedImage[] = acceptedFiles.map((file) => ({
        id: Math.random().toString(36).substring(2, 15),
        url: URL.createObjectURL(file),
        file,
        uploading: true,
      }));

      setUploadedImages((prev) => [...prev, ...newImages]);

      // Upload each file
      for (const image of newImages) {
        try {
          const uploadedUrl = await uploadToS3(image.file);
          setUploadedImages((prev) =>
            prev.map((img) =>
              img.id === image.id
                ? { ...img, url: uploadedUrl, uploading: false }
                : img,
            ),
          );
        } catch (error) {
          setUploadedImages((prev) =>
            prev.map((img) =>
              img.id === image.id
                ? {
                    ...img,
                    uploading: false,
                    error:
                      error instanceof Error ? error.message : "Upload failed",
                  }
                : img,
            ),
          );
        }
      }
    },
    [uploadedImages.length, uploadToS3],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxSize: 1024 * 1024, // 1MB
    multiple: true,
  });

  const removeImage = (id: string) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== id));
  };

  const retryUpload = async (image: UploadedImage) => {
    setUploadedImages((prev) =>
      prev.map((img) =>
        img.id === image.id
          ? { ...img, uploading: true, error: undefined }
          : img,
      ),
    );

    try {
      const uploadedUrl = await uploadToS3(image.file);
      setUploadedImages((prev) =>
        prev.map((img) =>
          img.id === image.id
            ? { ...img, url: uploadedUrl, uploading: false }
            : img,
        ),
      );
    } catch (error) {
      setUploadedImages((prev) =>
        prev.map((img) =>
          img.id === image.id
            ? {
                ...img,
                uploading: false,
                error: error instanceof Error ? error.message : "Upload failed",
              }
            : img,
        ),
      );
    }
  };

  const handleSubmit = async () => {
    if (!isAuthenticated || !principal) {
      setMessage("Please login with Internet Identity first.");
      return;
    }
    if (!actor) {
      setMessage("Actor not initialized. Please try again.");
      return;
    }

    // Check if at least one image is uploaded
    const successfulUploads = uploadedImages.filter(
      (img) => !img.uploading && !img.error,
    );
    if (successfulUploads.length === 0) {
      setMessage("Please upload at least one image.");
      return;
    }

    setSubmitting(true);
    setMessage("Creating item...");

    try {
      // Convert price from ICP to e8s
      const [integerPart, decimalPart = ""] = formData.price.split(".");
      const paddedDecimal = decimalPart.padEnd(8, "0").substring(0, 8);
      const priceInE8s =
        parseInt(integerPart) * 100_000_000 + parseInt(paddedDecimal);

      // Get URLs of successfully uploaded images
      const imageUrls = successfulUploads.map((img) => img.url);

      // Check if S3 fields are available
      if (
        !formData.contentHash ||
        !formData.contentFileKey ||
        !formData.contentFileName ||
        !formData.contentRetrievalUrl
      ) {
        setMessage(
          "Content upload information is missing. Please go back and try again.",
        );
        return;
      }

      const result = await actor.list_item(
        formData.title,
        formData.description,
        formData.contentHash, // Use contentHash instead of content
        BigInt(priceInE8s),
        formData.itemType,
        formData.category,
        "",
        formData.licenseTerms,
        BigInt(0),
        imageUrls,
        formData.contentFileKey,
        formData.contentFileName,
        formData.contentRetrievalUrl,
      );

      if (result.ok !== undefined) {
        setMessage("Item created successfully!");
        setTimeout(() => {
          onComplete();
        }, 1000);
      } else if (result.err !== undefined) {
        const errorType = Object.keys(result.err)[0];
        setMessage(`Error: ${errorType}. Please try again.`);
      }
    } catch (e) {
      console.error("Failed to create item:", e);
      setMessage(
        `Failed to create item: ${
          e instanceof Error ? e.message : "Unknown error"
        }`,
      );
    }
    setSubmitting(false);
  };

  const successfulUploads = uploadedImages.filter(
    (img) => !img.uploading && !img.error,
  );

  return (
    <div className="p-8">
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200 mb-6 text-center">
          Thumbnail Images
        </h2>

        <div className="space-y-6">
          {/* Upload Area */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
              isDragActive
                ? "border-purple-400/50 bg-purple-500/10 backdrop-blur-sm"
                : "border-gray-600/50 bg-gray-700/30 hover:border-purple-500/50 hover:bg-purple-500/10"
            } backdrop-blur-sm`}
          >
            <input {...getInputProps()} />
            <div className="space-y-6">
              <div className="flex justify-center">
                <svg
                  className="w-16 h-16 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="text-xl font-semibold text-gray-200">
                {isDragActive
                  ? "Drop images here..."
                  : "Drag & drop images here, or click to select"}
              </div>
              <div className="text-sm text-gray-400">
                Minimum 1, Maximum 5 images • Max size: 1MB each • Formats:
                JPEG, PNG, WebP
              </div>
            </div>
          </div>

          {/* Uploaded Images */}
          {uploadedImages.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-200">
                Uploaded Images ({successfulUploads.length}/5)
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {uploadedImages.map((image) => (
                  <div
                    key={image.id}
                    className="relative group bg-gray-100 rounded-lg overflow-hidden"
                  >
                    <SecureImage
                      src={image.url}
                      alt="Uploaded thumbnail"
                      width={200}
                      height={128}
                      className="w-full h-32 object-cover"
                    />

                    {/* Loading overlay */}
                    {image.uploading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                      </div>
                    )}

                    {/* Error overlay */}
                    {image.error && (
                      <div className="absolute inset-0 bg-red-500/80 flex items-center justify-center">
                        <div className="text-white text-center p-2">
                          <div className="text-sm font-semibold">
                            Upload Failed
                          </div>
                          <div className="text-xs">{image.error}</div>
                          <button
                            onClick={() => retryUpload(image)}
                            className="mt-2 px-3 py-1 bg-white text-red-500 rounded text-xs font-semibold hover:bg-gray-100"
                          >
                            Retry
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Remove button */}
                    {!image.uploading && !image.error && (
                      <button
                        onClick={() => removeImage(image.id)}
                        className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-sm font-bold"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-6 mt-12">
            <button
              onClick={onBack}
              className="flex-1 px-8 py-4 bg-gray-800/60 backdrop-blur-sm text-white rounded-xl font-semibold border border-gray-600/50 hover:border-gray-500/50 hover:bg-gray-700/60 transition-all duration-300 transform hover:scale-[1.02]"
            >
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 17l-5-5m0 0l5-5m-5 5h12"
                  />
                </svg>
                Back
              </span>
            </button>
            <button
              onClick={handleSubmit}
              disabled={
                submitting ||
                uploadedImages.filter((img) => !img.uploading && !img.error)
                  .length === 0
              }
              className="group relative flex-1 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-lg shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-[1.02] overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating Item...
                  </>
                ) : (
                  <>
                    Create Item
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </>
                )}
              </span>
            </button>
          </div>
        </div>

        {message && (
          <div
            className={`mt-6 p-4 rounded-xl text-center backdrop-blur-sm font-medium ${
              message.includes("successfully")
                ? "bg-green-500/10 border border-green-500/20 text-green-300"
                : "bg-red-500/10 border border-red-500/20 text-red-300"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
