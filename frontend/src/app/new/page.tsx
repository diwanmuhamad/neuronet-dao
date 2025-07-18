"use client";
import React, { useState } from "react";
import WalletConnect from "../../components/WalletConnect";
import { getActor } from "../../ic/agent";

const NewItem = () => {
  const [principal, setPrincipal] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [itemType, setItemType] = useState<"Prompt" | "Dataset">("Prompt");
  const [metadata, setMetadata] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!principal) return;
    setMessage("Submitting...");
    try {
      const actor = getActor();
      await actor.list_item(
        title,
        description,
        BigInt(price),
        { [itemType]: null },
        metadata
      );
      setMessage("Item listed!");
      setTitle("");
      setDescription("");
      setPrice("");
      setMetadata("");
    } catch (e) {
      setMessage("Failed to list item.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">List a New Prompt or Dataset</h1>
      <WalletConnect principal={principal} setPrincipal={setPrincipal} />
      {message && <div className="my-2 text-blue-600">{message}</div>}
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div>
          <label className="block font-semibold">Title</label>
          <input
            className="w-full border p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-semibold">Description</label>
          <textarea
            className="w-full border p-2 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-semibold">Price (ICP)</label>
          <input
            className="w-full border p-2 rounded"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-semibold">Type</label>
          <select
            className="w-full border p-2 rounded"
            value={itemType}
            onChange={(e) => setItemType(e.target.value as any)}
          >
            <option value="Prompt">Prompt</option>
            <option value="Dataset">Dataset</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold">Metadata (optional)</label>
          <input
            className="w-full border p-2 rounded"
            value={metadata}
            onChange={(e) => setMetadata(e.target.value)}
          />
        </div>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          type="submit"
          disabled={!principal}
        >
          List Item
        </button>
      </form>
    </div>
  );
};

export default NewItem;
