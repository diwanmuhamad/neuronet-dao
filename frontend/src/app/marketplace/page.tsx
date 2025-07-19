"use client";
import React, { useState, useEffect } from "react";
import { useAnonymousWallet } from "../../hooks/useAnonymousWallet";
import { getActor } from "../../ic/agent";
import ListNewModal from "./ListNewModal";
import Link from "next/link";

export default function MarketplacePage() {
  const { principal, connect, disconnect, loading, identity } =
    useAnonymousWallet();
  const [items, setItems] = useState<any[]>([]);
  const [fetching, setFetching] = useState(false);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setFetching(true);
    try {
      const actor = await getActor(identity || undefined);
      console.log("Testing canister connection...");
      const items = await actor.get_items();
      console.log("Successfully fetched items:", items);
      setItems(items as any[]);
    } catch (e) {
      console.error("Failed to fetch items:", e);
      setMessage("Failed to fetch items.");
    }
    setFetching(false);
  };

  const handleBuy = async (itemId: any) => {
    if (!principal) return;
    try {
      const actor = await getActor(identity || undefined);
      const result = await actor.buy_item(itemId);
      if (result) {
        setMessage("Item purchased successfully!");
        fetchItems();
      } else {
        setMessage("Failed to purchase item.");
      }
    } catch (e) {
      setMessage("Failed to purchase item.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-blue-100 to-pink-100">
      {/* Modern Navbar */}
      <nav className="w-full flex items-center justify-between px-8 py-4 bg-white/60 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-20 shadow-lg rounded-b-2xl mb-10">
        <Link href="/">
          {" "}
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
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-2 bg-gradient-to-r from-pink-500 via-indigo-500 to-blue-500 text-white rounded-full font-semibold shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-200"
          >
            List New
          </button>
          <a
            href="/my-licenses"
            className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full font-semibold shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-200"
          >
            My Licenses
          </a>
          {loading ? (
            <span className="text-gray-500 text-sm">Connecting...</span>
          ) : principal ? (
            <div className="flex flex-col items-end">
              <span className="text-green-600 font-mono text-xs mb-1">
                {principal}
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
              Connect
            </button>
          )}
        </div>
      </nav>
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <h1 className="text-2xl text-center sm:text-3xl font-extrabold bg-gradient-to-r from-indigo-600 via-blue-500 to-pink-400 bg-clip-text text-transparent drop-shadow mb-10">
          Marketplace
        </h1>
        {message && (
          <div className="mb-4 p-4 bg-blue-100 text-blue-700 rounded-lg text-center">
            {message}
          </div>
        )}
        {fetching ? (
          <div className="text-center py-8">Loading items...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            No items available.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item: any) => (
              <div
                key={item.id}
                className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 border border-white/30"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-indigo-600">
                    {item.price} ICP
                  </span>
                  <button
                    onClick={() => handleBuy(item.id)}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-pink-400 text-white rounded-full font-semibold shadow hover:scale-105 transition-all duration-200"
                  >
                    Buy
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <ListNewModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onListed={fetchItems}
        principal={principal}
        identity={identity}
      />
    </div>
  );
}
