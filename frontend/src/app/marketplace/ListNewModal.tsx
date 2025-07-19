import React, { useState } from "react";
import { getActor } from "../../ic/agent";
import { usePlugWallet } from "../../hooks/usePlugWallet";

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
  const { principal, connect, disconnect, loading } = usePlugWallet();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [itemType, setItemType] = useState<"Prompt" | "Dataset">("Prompt");
  const [metadata, setMetadata] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [content, setContent] = useState("");

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!principal) return;
    setSubmitting(true);
    setMessage("Submitting...");
    try {
      const actor = getActor();
      await actor.list_item(
        title,
        description,
        content,
        BigInt(price),
        { [itemType]: null },
        metadata
      );
      setMessage("Item listed!");
      setTitle("");
      setDescription("");
      setContent("");
      setPrice("");
      setMetadata("");
      onListed();
      setTimeout(() => {
        setMessage("");
        onClose();
      }, 1000);
    } catch (e) {
      setMessage("Failed to list item.");
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
          List a New Prompt
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
          {/* Content */}
          <div className="relative">
            <textarea
              id="content"
              className="peer w-full px-4 pt-6 pb-2 bg-white/30 border border-white/40 rounded-xl outline-none focus:ring-2 focus:ring-indigo-300 transition-all placeholder-transparent text-black/90 shadow-sm resize-none min-h-[80px] backdrop-blur-md"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              autoComplete="off"
              placeholder="Prompt Content"
            />
            <label
              htmlFor="content"
              className="absolute left-4 top-2 text-black/60 text-sm font-semibold pointer-events-none transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-black/40 peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-500"
            >
              Prompt Content
            </label>
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
          {/* Price and Type */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <input
                id="price"
                className="peer w-full px-4 pt-6 pb-2 bg-white/30 border border-white/40 rounded-xl outline-none focus:ring-2 focus:ring-pink-300 transition-all placeholder-transparent text-black/90 shadow-sm backdrop-blur-md"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                autoComplete="off"
                placeholder="Price (ICP)"
                min="0"
                step="any"
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
                onChange={(e) =>
                  setItemType(e.target.value as "Prompt" | "Dataset")
                }
              >
                <option value="Prompt">Prompt</option>
              </select>
              <label
                htmlFor="itemType"
                className="absolute left-4 top-2 text-black/60 text-sm font-semibold pointer-events-none transition-all duration-200 peer-focus:text-pink-500"
              >
                Type
              </label>
            </div>
          </div>
          {/* Metadata */}
          <div className="relative">
            <input
              id="metadata"
              className="peer w-full px-4 pt-6 pb-2 bg-white/30 border border-white/40 rounded-xl outline-none focus:ring-2 focus:ring-pink-300 transition-all placeholder-transparent text-black/90 shadow-sm backdrop-blur-md"
              value={metadata}
              onChange={(e) => setMetadata(e.target.value)}
              autoComplete="off"
              placeholder="Metadata (optional)"
            />
            <label
              htmlFor="metadata"
              className="absolute left-4 top-2 text-black/60 text-sm font-semibold pointer-events-none transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-black/40 peer-focus:top-2 peer-focus:text-sm peer-focus:text-pink-500"
            >
              Metadata (optional)
            </label>
          </div>
          <button
            className="w-full px-4 py-2 bg-gradient-to-r from-indigo-500 to-pink-400 text-white rounded-full font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200 mt-2"
            type="submit"
            disabled={!principal || submitting}
          >
            List Item
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
