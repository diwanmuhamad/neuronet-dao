"use client";
import React, { useEffect, useState } from "react";
import { useAnonymousWallet } from "../../hooks/useAnonymousWallet";
import { getActor } from "../../ic/agent";

const MyLicenses = () => {
  const { principal, connect, disconnect, loading, identity } =
    useAnonymousWallet();
  const [licenses, setLicenses] = useState<any[]>([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (principal) fetchLicenses();
  }, [principal]);

  const fetchLicenses = async () => {
    setFetching(true);
    try {
      const actor = await getActor(identity || undefined);
      const res = await actor.get_my_licenses();
      setLicenses(res as any[]);
    } catch (e) {
      console.error("Failed to fetch licenses:", e);
    }
    setFetching(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-blue-100 to-pink-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto p-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl sm:text-7xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-400 bg-clip-text text-transparent mb-6 drop-shadow-lg">
            My Licenses
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            View and manage all your purchased AI prompts and datasets
          </p>
        </div>

        {/* Navigation and Connection */}
        <div className="flex items-center justify-between mb-8 bg-white/60 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/30">
          <a
            href="/marketplace"
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
          >
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Marketplace
          </a>

          <div className="flex items-center gap-4">
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-500 text-sm">Connecting...</span>
              </div>
            ) : principal ? (
              <div className="flex items-center gap-4">
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
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
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

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/30 text-center">
            <div className="text-3xl font-bold text-indigo-600 mb-2">
              {licenses.length}
            </div>
            <div className="text-gray-600">Total Licenses</div>
          </div>
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/30 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {
                licenses.filter(
                  (l) =>
                    new Date(Number(l.timestamp) / 1000000) >
                    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                ).length
              }
            </div>
            <div className="text-gray-600">This Month</div>
          </div>
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/30 text-center">
            <div className="text-3xl font-bold text-pink-600 mb-2">
              {
                licenses.filter(
                  (l) =>
                    new Date(Number(l.timestamp) / 1000000) >
                    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                ).length
              }
            </div>
            <div className="text-gray-600">This Week</div>
          </div>
        </div>

        {/* Licenses Grid */}
        {fetching ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading your licenses...</p>
            </div>
          </div>
        ) : licenses.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-16 h-16 text-indigo-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No Licenses Yet
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You haven't purchased any prompts or datasets yet. Start exploring
              the marketplace to build your collection!
            </p>
            <a
              href="/marketplace"
              className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full font-semibold shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-200"
            >
              Explore Marketplace
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {licenses.map((lic: any, index: number) => (
              <div
                key={lic.id}
                className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/30 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="text-right">
                    <div className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-semibold">
                      Active
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800 mb-1">
                      License #{lic.id.toString()}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Item ID: {lic.itemId.toString()}
                    </p>
                  </div>

                  <div className="text-xs text-gray-500 space-y-1">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span>
                        Buyer:{" "}
                        {typeof lic.buyer === "string"
                          ? lic.buyer.substring(0, 8) + "..."
                          : lic.buyer?.toString?.().substring(0, 8) + "..."}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>
                        Purchased:{" "}
                        {new Date(
                          Number(lic.timestamp) / 1000000
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button className="w-full px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-semibold shadow hover:scale-105 transition-all duration-200">
                    View Details
                  </button>
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
