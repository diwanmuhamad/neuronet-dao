"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getActor } from "../../ic/agent";
import { usePlugWallet } from "../../hooks/usePlugWallet";
import ListNewModal from "./ListNewModal";

export default function MarketplacePage() {
  const { principal, connect, disconnect, loading } = usePlugWallet();
  const [items, setItems] = useState<any[]>([]);
  const [fetching, setFetching] = useState(false);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line
  }, []);

  const fetchItems = async () => {
    setFetching(true);
    try {
      const actor = getActor();
      const res = await actor.get_items();
      setItems(res);
    } catch (e) {
      setMessage("Failed to fetch items");
    }
    setFetching(false);
  };

  const handleBuy = async (itemId: any) => {
    if (!principal) return;
    setMessage("Processing...");
    try {
      const actor = getActor();
      const result = await actor.buy_item(itemId);
      if (result && result.length > 0) {
        setMessage("License purchased!");
      } else {
        setMessage("Purchase failed.");
      }
    } catch (e) {
      setMessage("Error during purchase.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-blue-100 to-pink-100">
      {/* Modern Navbar */}
      <nav className="w-full flex items-center justify-between px-8 py-4 bg-white/60 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-20 shadow-lg rounded-b-2xl mb-10">
        <Link href="/">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-extrabold text-indigo-700 tracking-tight drop-shadow">
              NeuroNet
            </span>
            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full ml-2 font-semibold">
              DAO
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          {loading ? (
            <span className="text-gray-500 text-sm">Checking wallet...</span>
          ) : principal ? (
            <div className="flex flex-col items-end">
              <span className="text-green-600 font-mono text-xs mb-1">
                {typeof principal === "string"
                  ? principal
                  : principal?.toString?.() || JSON.stringify(principal)}
              </span>
              <button
                onClick={disconnect}
                className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-pink-400 to-indigo-400 text-white font-semibold shadow hover:scale-105 transition-all duration-200"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={connect}
              className="px-6 py-2 bg-gradient-to-r from-pink-500 via-indigo-500 to-blue-500 text-white rounded-full font-semibold shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-200"
            >
              Connect Plug Wallet
            </button>
          )}
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-2 bg-gradient-to-r from-pink-500 via-indigo-500 to-blue-500 text-white rounded-full font-semibold shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-200"
          >
            List New
          </button>
        </div>
      </nav>
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <h1 className="text-3xl font-extrabold text-center mb-10 bg-gradient-to-r from-pink-500 via-indigo-500 to-blue-500 bg-clip-text text-transparent drop-shadow-lg">
          Marketplace
        </h1>
        {message && (
          <div className="mb-4 text-center text-blue-700 font-medium">
            {message}
          </div>
        )}
        {fetching ? (
          <div className="text-center py-20 text-lg text-gray-500">
            Loading...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {items.length === 0 ? (
              <div className="col-span-full text-center text-gray-400 py-20">
                No items found.
              </div>
            ) : (
              items.map((item: any) => (
                <div
                  key={item.id}
                  className="bg-white/80 rounded-2xl p-6 flex flex-col shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-200"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">
                      {item.itemType &&
                      Object.keys(item.itemType)[0] === "Prompt"
                        ? "💡"
                        : "📦"}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-indigo-200 to-pink-200 text-indigo-700 font-semibold">
                      {item.itemType && Object.keys(item.itemType)[0]}
                    </span>
                  </div>
                  <h2 className="font-bold text-lg mb-1 text-gray-900 truncate">
                    {item.title}
                  </h2>
                  <div className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {item.description}
                  </div>
                  <div className="text-sm text-gray-500 mb-1">
                    Price:{" "}
                    <span className="font-semibold text-indigo-600">
                      {item.price.toString()} ICP
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mb-4">
                    Owner:{" "}
                    {typeof item.owner === "string"
                      ? item.owner
                      : item.owner?.toString?.() || JSON.stringify(item.owner)}
                  </div>
                  <button
                    className={`mt-auto px-4 py-2 rounded-full font-semibold shadow bg-gradient-to-r from-indigo-500 to-pink-400 text-white hover:scale-105 hover:shadow-xl transition-all duration-200 ${
                      !principal ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={() => handleBuy(item.id)}
                    disabled={!principal}
                  >
                    Buy / License
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      <ListNewModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onListed={fetchItems}
      />
    </div>
  );
}
