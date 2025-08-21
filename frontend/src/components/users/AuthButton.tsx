"use client";
import React from "react";
import { useAuth } from "../../contexts/AuthContext";

const AuthButton: React.FC = () => {
  const { isAuthenticated, login, loading } = useAuth();

  if (loading) {
    return (
      <button
        disabled
        className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-gray-300 rounded-lg cursor-not-allowed"
      >
        <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
        Loading...
      </button>
    );
  }

  if (isAuthenticated) {
    return null; // UserDropdown handles authenticated state
  }

  return (
    <button
      onClick={login}
      className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors font-medium cursor-pointer"
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
          d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
        />
      </svg>
      Login
    </button>
  );
};

export default AuthButton;
