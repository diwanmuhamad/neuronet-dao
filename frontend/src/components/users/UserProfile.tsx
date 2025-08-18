"use client";
import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

const UserProfile: React.FC = () => {
  const {
    isAuthenticated,
    principal,
    balance,
    balanceLoading,
    refreshBalance,
  } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const formatPrincipal = (principal: string) => {
    if (principal.length <= 20) return principal;
    return `${principal.slice(0, 10)}...${principal.slice(-10)}`;
  };

  const handleRefreshBalance = async () => {
    setIsRefreshing(true);
    try {
      await refreshBalance();
    } catch (error) {
      console.error("Failed to refresh balance:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  if (!isAuthenticated || !principal) {
    return null;
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg border border-gray-700/50 rounded-lg p-6 max-w-md">
      <h3 className="text-xl font-bold text-white mb-4">User Profile</h3>

      {/* Principal ID */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Principal ID
        </label>
        <div className="flex items-center gap-2">
          <div className="flex-1 px-3 py-2 bg-gray-800/50 text-gray-200 rounded border border-gray-600 text-sm font-mono">
            {formatPrincipal(principal)}
          </div>
          <button
            onClick={() => copyToClipboard(principal)}
            className="p-2 bg-violet-600 hover:bg-violet-700 text-white rounded transition-colors"
            title="Copy full principal ID"
          >
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
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Balance */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
          Balance
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-400">Auto-refresh</span>
          </div>
        </label>
        <div className="flex items-center gap-2">
          <div className="flex-1 px-3 py-2 bg-gray-800/50 text-gray-200 rounded border border-gray-600 text-sm flex items-center gap-2">
            {balanceLoading ? (
              <>
                <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Loading...</span>
              </>
            ) : (
              `${balance.toFixed(2)} ICP`
            )}
          </div>
          <button
            onClick={handleRefreshBalance}
            disabled={isRefreshing}
            className="p-2 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-600 text-white rounded transition-colors"
            title="Refresh balance"
          >
            {isRefreshing ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Authentication Status */}
      <div className="flex items-center gap-2 text-sm">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className="text-green-400 font-medium">
          Authenticated with Internet Identity
        </span>
      </div>
    </div>
  );
};

export default UserProfile;
