"use client";
import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";

interface UserDropdownProps {
  onCreateClick?: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ onCreateClick }) => {
  const {
    isAuthenticated,
    principal,
    balance,
    balanceLoading,
    refreshBalance,
    logout,
    loading,
  } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!isAuthenticated || !principal) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-full bg-violet-600 hover:bg-violet-700 transition-colors"
        disabled={loading}
      >
        {loading ? (
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-violet-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        )}
        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-violet-600 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold">User Profile</h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-400 text-sm">Authenticated</span>
                </div>
              </div>
            </div>

            {/* Principal ID */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Principal ID
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2 bg-gray-700 text-gray-200 rounded border border-gray-600 text-sm font-mono">
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
                {/*<div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-400">Auto-refresh</span>
                </div>*/}
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2 bg-gray-700 text-gray-200 rounded border border-gray-600 text-sm flex items-center gap-2">
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

            {/* Divider */}
            <hr className="border-gray-700 mb-4" />

            {/* Actions */}
            <div className="space-y-2">
              {onCreateClick && (
                <button
                  onClick={() => {
                    onCreateClick();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
                >
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
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Create New Item
                  </div>
                </button>
              )}

              <button
                onClick={() => {
                  router.push("/profile");
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
              >
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
                  My Profile
                </div>
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
              >
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
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Settings
                </div>
              </button>

              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors"
              >
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
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
