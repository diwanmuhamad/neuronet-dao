"use client";
import React, { useEffect, useState } from "react";
import { useAnonymousWallet } from "../../hooks/useAnonymousWallet";
import { getActor } from "../../ic/agent";

const MyLicenses = () => {
  const { principal, connect, disconnect, loading } = useAnonymousWallet();
  const [licenses, setLicenses] = useState<any[]>([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (principal) fetchLicenses();
  }, [principal]);

  const fetchLicenses = async () => {
    setFetching(true);
    try {
      const actor = await getActor();
      const res = await actor.get_my_licenses();
      setLicenses(res as any[]);
    } catch (e) {
      console.error("Failed to fetch licenses:", e);
    }
    setFetching(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-blue-100 to-pink-100">
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 via-blue-500 to-pink-400 bg-clip-text text-transparent">
            My Licenses
          </h1>
          <div className="flex items-center gap-4">
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
        </div>

        <div className="mb-6">
          <a
            href="/marketplace"
            className="text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            ← Back to Marketplace
          </a>
        </div>

        {fetching ? (
          <div className="text-center py-8 text-gray-600">
            Loading licenses...
          </div>
        ) : licenses.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            No licenses found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {licenses.map((lic: any) => (
              <div
                key={lic.id}
                className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/30"
              >
                <div className="font-bold text-lg text-gray-800 mb-2">
                  License #{lic.id.toString()}
                </div>
                <div className="text-gray-600 mb-2">
                  Item ID: {lic.itemId.toString()}
                </div>
                <div className="text-xs text-gray-500 mb-1">
                  Buyer:{" "}
                  {typeof lic.buyer === "string"
                    ? lic.buyer
                    : lic.buyer?.toString?.() || JSON.stringify(lic.buyer)}
                </div>
                <div className="text-xs text-gray-500">
                  Purchased:{" "}
                  {new Date(
                    Number(lic.timestamp) / 1000000
                  ).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLicenses;
