import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useCategories } from "../../hooks/useCategories";

interface ListNewModalProps {
  open: boolean;
  onClose: () => void;
  onListed: () => void;
}

export default function ListNewModal({
  open,
  onClose,
  onListed,
}: ListNewModalProps) {
  const { isAuthenticated, principal, actor } = useAuth();
  const { getCategoriesByType } = useCategories();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [price, setPrice] = useState("");
  const [itemType, setItemType] = useState<"prompt" | "dataset" | "ai_output">(
    "prompt",
  );
  const [category, setCategory] = useState("");
  const [licenseTerms, setLicenseTerms] = useState("Non-commercial use only");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [contentCheck, setContentCheck] = useState("");
  const [checkingDuplicate, setCheckingDuplicate] = useState(false);

  // Check for duplicate content when content changes
  useEffect(() => {
    const checkDuplicateContent = async () => {
      if (!content.trim() || !actor) return;

      setCheckingDuplicate(true);
      try {
        const contentHash = await actor.get_content_hash(content);
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
  }, [content, actor]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !principal) {
      setMessage("Please login with Internet Identity first.");
      return;
    }
    if (!actor) {
      setMessage("Actor not initialized. Please try again.");
      return;
    }
    setSubmitting(true);
    setMessage("Submitting...");
    try {
      // Convert price from ICP to e8s (1 ICP = 100,000,000 e8s)
      // Use string-based calculation to avoid floating-point precision issues
      console.log("Debug price conversion:");
      console.log("Original price input:", price);

      // Split the price into integer and decimal parts
      const [integerPart, decimalPart = ""] = price.split(".");
      const paddedDecimal = decimalPart.padEnd(8, "0").substring(0, 8); // Ensure exactly 8 decimal places
      const priceInE8s =
        parseInt(integerPart) * 100_000_000 + parseInt(paddedDecimal);

      console.log("Converted to e8s:", priceInE8s);

      const result = await actor.list_item(
        title,
        description,
        content,
        BigInt(priceInE8s),
        itemType, // Pass itemType as the itemType parameter
        category, // Pass category as the category parameter
        "",
        licenseTerms,
        BigInt(0),
      );

      // Handle Result type response
      if (result.ok !== undefined) {
        // Success case
        setMessage("Item listed successfully!");
        setTitle("");
        setDescription("");
        setContent("");
        setPrice("");
        setCategory("");
        setLicenseTerms("Non-commercial use only");
        onListed();
        setTimeout(() => {
          setMessage("");
          onClose();
        }, 1000);
      } else if (result.err !== undefined) {
        // Error case
        const errorType = Object.keys(result.err)[0];
        if (errorType === "DuplicateContent") {
          setMessage(
            "Error: This content already exists on the marketplace. Please create unique content.",
          );
        } else {
          setMessage(`Error: ${errorType}. Please try again.`);
        }
      }
    } catch (e) {
      console.error("Failed to list item:", e);
      setMessage(
        `Failed to list item: ${
          e instanceof Error ? e.message : "Unknown error"
        }`,
      );
    }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div
        className="relative w-full max-w-lg rounded-3xl p-8 border border-white/30 shadow-2xl bg-white/85 backdrop-blur-3xl animate-fade-in-up"
        style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)" }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black/70 hover:text-pink-400 text-2xl font-bold z-10"
        >
          &times;
        </button>
        <h1 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-500 via-blue-400 to-pink-400 bg-clip-text text-transparent mb-8 text-center drop-shadow-lg">
          List a New Item
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6 w-full">
          {/* Title */}
          <div className="relative">
            <input
              id="title"
              className="peer w-full px-4 pt-6 pb-2 bg-white/30 border border-white/40 rounded-xl outline-none focus:ring-2 focus:ring-pink-300 transition-all placeholder-transparent text-black/90 shadow-sm backdrop-blur-md"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
                value={price}
                onChange={(e) => {
                  const value = e.target.value;
                  // Check if value has more than 8 decimal places
                  const decimalPart = value.split(".")[1];
                  if (decimalPart && decimalPart.length > 8) {
                    // Truncate to 8 decimal places
                    const truncated = parseFloat(value).toFixed(8);
                    setPrice(truncated);
                  } else {
                    setPrice(value);
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
                value={itemType}
                onChange={(e) => {
                  setItemType(
                    e.target.value as "prompt" | "dataset" | "ai_output",
                  );
                  setCategory(""); // Reset category when item type changes
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
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              {getCategoriesByType(itemType).map((cat) => (
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
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              autoComplete="off"
              placeholder="Content"
            />
            <label
              htmlFor="content"
              className="absolute left-4 top-2 text-black/60 text-sm font-semibold pointer-events-none transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-black/40 peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-500"
            >
              {itemType === "prompt"
                ? "Prompt"
                : itemType === "dataset"
                  ? "Dataset Link"
                  : "Output Link"}
            </label>
            {checkingDuplicate && content.trim() && (
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              value={licenseTerms}
              onChange={(e) => setLicenseTerms(e.target.value)}
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
          <button
            className="w-full px-4 py-2 bg-gradient-to-r from-indigo-500 to-pink-400 text-white rounded-full font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200 mt-2"
            type="submit"
            disabled={!principal || submitting}
          >
            {submitting ? "Listing..." : "List Item"}
          </button>
        </form>
        {message && (
          <div className="mt-6 text-blue-700 font-medium text-center drop-shadow">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
