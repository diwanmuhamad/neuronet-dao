"use client";

import React, { useState, useCallback, useEffect } from "react";
import SecureImage from "../containers/SecureImage";
import { useAuth } from "@/src/contexts/AuthContext";
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
  initialImageUrls?: string[];
  onSubmit?: (imageUrls: string[]) => Promise<void> | void;
}

interface UploadedImage {
  id: string;
  url: string;
  file?: File;
  uploading: boolean;
  error?: string;
}

export default function Step2Images({
  formData,
  onBack,
  onComplete,
  initialImageUrls,
  onSubmit,
}: Step2ImagesProps) {
  const { isAuthenticated, principal, actor } = useAuth();
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  // Preload existing images for update flow
  useEffect(() => {
    if (initialImageUrls && initialImageUrls.length > 0 && uploadedImages.length === 0) {
      const existing: UploadedImage[] = initialImageUrls.map((url) => ({
        id: Math.random().toString(36).substring(2, 15),
        url,
        uploading: false,
      }));
      setUploadedImages(existing);
    }
  }, [initialImageUrls]);

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
          const uploadedUrl = await uploadToS3(image.file as File);
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
      const uploadedUrl = await uploadToS3(image.file as File);
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
    if (!actor && !onSubmit) {
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
    setMessage(onSubmit ? "Updating item..." : "Creating item...");

    try {
      // Convert price from ICP to e8s
      const [integerPart, decimalPart = ""] = formData.price.split(".");
      const paddedDecimal = decimalPart.padEnd(8, "0").substring(0, 8);
      const priceInE8s =
        parseInt(integerPart) * 100_000_000 + parseInt(paddedDecimal);

      // Get URLs of successfully uploaded images, include existing ones
      const imageUrls = successfulUploads.map((img) => img.url);

      if (onSubmit) {
        await onSubmit(imageUrls);
        setMessage("Item updated successfully!");
        setTimeout(() => onComplete(), 500);
      } else {
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
      }
    } catch (e) {
      console.error("Failed to create item:", e);
      setMessage(
        `${onSubmit ? "Failed to update item" : "Failed to create item"}: ${
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
    <div className="create-item__form">
      {/* Header - Enhanced with app's section header pattern and improved typography */}
      <div className="section__header text-center mb-0">
        <h3 className="title title-animation">
          Thumbnail Images
        </h3>
        <p className="primary-text">
          Upload images to showcase your item (1-5 images)
        </p>
      </div>

      <div className="row gaper">
        {/* Upload Area - Enhanced with improved drag & drop styling and visual feedback */}
        <div className="col-12">
          <div
            {...getRootProps()}
            className={`image-upload__area ${
              isDragActive ? "image-upload__area--active" : ""
            }`}
          >
            <input {...getInputProps()} />
            <div className="image-upload__content">
              <div className="image-upload__icon">
                <i className="material-symbols-outlined">cloud_upload</i>
              </div>
              <div className="image-upload__text">
                {isDragActive
                  ? "Drop images here..."
                  : "Drag & drop images here, or click to select"}
              </div>
              <div className="image-upload__subtext">
                Minimum 1, Maximum 5 images • Max size: 1MB each • Formats: JPEG, PNG, WebP
              </div>
            </div>
          </div>
        </div>

        {/* Uploaded Images - Using app's grid system */}
        {uploadedImages.length > 0 && (
          <div className="col-12">
            <h4 className="mb-4">
              Uploaded Images ({successfulUploads.length}/5)
            </h4>
            <div className="row gaper">
              {uploadedImages.map((image) => (
                <div key={image.id} className="col-6 col-md-4 col-lg-3">
                  <div className="image-upload__preview">
                    <SecureImage
                      src={image.url}
                      alt="Uploaded thumbnail"
                      width={200}
                      height={128}
                      className="image-upload__preview-img"
                    />

                    {/* Loading overlay */}
                    {image.uploading && (
                      <div className="image-upload__overlay image-upload__overlay--loading">
                        <div className="image-upload__spinner"></div>
                      </div>
                    )}

                    {/* Error overlay */}
                    {image.error && (
                      <div className="image-upload__overlay image-upload__overlay--error">
                        <div className="image-upload__error-content">
                          <div className="image-upload__error-title">
                            Upload Failed
                          </div>
                          <div className="image-upload__error-message">{image.error}</div>
                          <button
                            onClick={() => retryUpload(image)}
                            className="btn btn--secondary btn-sm"
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
                        className="image-upload__remove"
                      >
                        <i className="material-symbols-outlined">close</i>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons - Using app's button patterns */}
        <div className="col-12">
          <div className="section__content-cta d-flex gap-4 justify-content-center">
            <button
              type="button"
              className="btn btn--secondary"
              onClick={onBack}
            >
              <i className="material-symbols-outlined">arrow_back</i>
              Back
            </button>
            <button
              type="button"
              className="btn btn--primary"
              onClick={handleSubmit}
              disabled={
                submitting ||
                uploadedImages.filter((img) => !img.uploading && !img.error)
                  .length === 0
              }
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {onSubmit ? "Updating Item..." : "Creating Item..."}
                </>
              ) : (
                <>
                  {onSubmit ? "Update Item" : "Create Item"}
                  <i className="material-symbols-outlined">check</i>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Message - Using app's message styling pattern */}
      {message && (
        <div
          className={`mt-6 p-4 rounded-xl text-center font-medium ${
            message.includes("successfully")
              ? "bg-green-500/10 border border-green-500/20 text-green-300"
              : "bg-red-500/10 border border-red-500/20 text-red-300"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <i className="material-symbols-outlined">
              {message.includes("successfully") ? "check_circle" : "error"}
            </i>
            <span>{message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
