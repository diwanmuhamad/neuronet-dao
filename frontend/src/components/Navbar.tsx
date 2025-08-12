"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthButton from "./AuthButton";
import UserDropdown from "./UserDropdown";
import ListNewModal from "./ListNewModal";
import { useAuth } from "../contexts/AuthContext";

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const [showListModal, setShowListModal] = useState(false);

  const getLinkClassName = (path: string) => {
    const isActive = pathname === path;
    return `transition-colors ${
      isActive ? "text-white font-medium" : "text-gray-300 hover:text-white"
    }`;
  };

  const handleListNewItem = () => {
    // Refresh the page after item is listed
    window.location.reload();
  };

  return (
    <>
      <nav className="w-full flex items-center justify-between px-8 py-4 bg-gray-900/80 backdrop-blur-lg border-b border-gray-700/50 sticky top-0 z-50">
        <Link href="/">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <span className="text-2xl font-bold text-white">NeuroNet</span>
            <span className="text-xs bg-violet-100 text-violet-700 px-2 py-1 rounded-full font-semibold">
              DAO
            </span>
          </div>
        </Link>

        {/*<div className="hidden md:flex items-center gap-8">
        <button className="text-gray-300 hover:text-white transition-colors flex items-center gap-1">
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
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          Categories
        </button>
      </div>*/}

        <div className="flex items-center gap-6">
          {/*{pathname === "/marketplace" && (
            <div className="hidden lg:block relative max-w-md w-md">
              <input
                type="text"
                placeholder="Search prompts"
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-violet-500 pr-10"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          )}*/}

          <div className="flex items-center gap-10">
            <Link
              href="/marketplace"
              className={getLinkClassName("/marketplace")}
            >
              Marketplace
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  href="/my-licenses"
                  className={getLinkClassName("/my-licenses")}
                >
                  My Licenses
                </Link>
                {pathname === "/marketplace" && (
                  <button
                    onClick={() => setShowListModal(true)}
                    className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Create
                  </button>
                )}
              </>
            )}

            <AuthButton />
            <UserDropdown onCreateClick={() => setShowListModal(true)} />
          </div>
        </div>
      </nav>

      {/* List New Modal */}
      <ListNewModal
        open={showListModal}
        onClose={() => setShowListModal(false)}
        onListed={handleListNewItem}
      />
    </>
  );
};

export default Navbar;
