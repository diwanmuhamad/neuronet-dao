"use client";
import React from "react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-gradient-to-br from-indigo-200 via-blue-100 to-pink-100 relative overflow-x-hidden">
      {/* Navigation Bar */}
      <nav className="w-full flex items-center justify-between px-8 py-4 bg-white/60 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-10 shadow-lg rounded-b-2xl">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-extrabold text-indigo-700 tracking-tight drop-shadow">
            NeuroNet
          </span>
          <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full ml-2 font-semibold">
            DAO
          </span>
        </div>
        <div className="flex gap-6 items-center text-gray-700 font-medium">
          <Link
            href="/marketplace"
            className="hover:text-indigo-600 transition-colors duration-200"
          >
            Marketplace
          </Link>
          <a
            href="#docs"
            className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all duration-200 shadow-lg"
          >
            Docs
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center flex-1 text-center py-24 px-4 relative">
        {/* Animated cubes and shapes around the hero only */}
        <svg
          className="absolute left-10 top-16 w-24 h-24 opacity-90 animate-cube-float1 z-10"
          viewBox="0 0 96 96"
          fill="none"
        >
          <rect
            x="12"
            y="12"
            width="72"
            height="72"
            rx="16"
            fill="url(#cube1)"
            stroke="#fff"
            strokeWidth="2"
          />
          <defs>
            <linearGradient
              id="cube1"
              x1="0"
              y1="0"
              x2="96"
              y2="96"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#7B2FF2" />
              <stop offset="1" stopColor="#232ED1" />
            </linearGradient>
          </defs>
        </svg>
        <svg
          className="absolute right-24 top-24 w-16 h-16 opacity-90 animate-cube-float2 z-10"
          viewBox="0 0 64 64"
          fill="none"
        >
          <rect
            x="8"
            y="8"
            width="48"
            height="48"
            rx="12"
            fill="url(#cube2)"
            stroke="#fff"
            strokeWidth="2"
          />
          <defs>
            <linearGradient
              id="cube2"
              x1="0"
              y1="0"
              x2="64"
              y2="64"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#F7971E" />
              <stop offset="1" stopColor="#F472b6" />
            </linearGradient>
          </defs>
        </svg>
        <svg
          className="absolute left-1/3 bottom-10 w-20 h-20 opacity-90 animate-cube-float3 z-10"
          viewBox="0 0 80 80"
          fill="none"
        >
          <rect
            x="10"
            y="10"
            width="60"
            height="60"
            rx="14"
            fill="url(#cube3)"
            stroke="#fff"
            strokeWidth="2"
          />
          <defs>
            <linearGradient
              id="cube3"
              x1="0"
              y1="0"
              x2="80"
              y2="80"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#6ee7b7" />
              <stop offset="1" stopColor="#0ea5e9" />
            </linearGradient>
          </defs>
        </svg>
        <svg
          className="absolute right-1/4 bottom-20 w-28 h-28 opacity-90 animate-cube-float4 z-10"
          viewBox="0 0 112 112"
          fill="none"
        >
          <rect
            x="16"
            y="16"
            width="80"
            height="80"
            rx="20"
            fill="url(#cube4)"
            stroke="#fff"
            strokeWidth="2"
          />
          <defs>
            <linearGradient
              id="cube4"
              x1="0"
              y1="0"
              x2="112"
              y2="112"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#fef08a" />
              <stop offset="1" stopColor="#f472b6" />
            </linearGradient>
          </defs>
        </svg>
        {/* Animated SVG background blob */}
        <svg
          className="absolute left-1/2 top-0 -translate-x-1/2 -z-10 opacity-30"
          width="700"
          height="400"
          viewBox="0 0 700 400"
          fill="none"
        >
          <ellipse
            cx="350"
            cy="200"
            rx="320"
            ry="160"
            fill="url(#paint0_radial)"
          />
          <defs>
            <radialGradient
              id="paint0_radial"
              cx="0"
              cy="0"
              r="1"
              gradientTransform="translate(350 200) scale(320 160)"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#a5b4fc" />
              <stop offset="1" stopColor="#818cf8" stopOpacity="0.2" />
            </radialGradient>
          </defs>
        </svg>
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-8">
          <h1 className="text-5xl sm:text-7xl font-extrabold bg-gradient-to-r from-indigo-600 via-blue-500 to-pink-400 bg-clip-text text-transparent mb-4 leading-tight animate-gradient-x drop-shadow-lg">
            The On-Chain AI Marketplace
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-xl">
            Discover, buy, and sell AI prompts, datasets, and model
            outputs—fully decentralized, governed by you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Link href="/marketplace">
              <button className="px-8 py-3 bg-gradient-to-r from-pink-500 via-indigo-500 to-blue-500 text-white rounded-full text-lg font-semibold shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-200 focus:scale-105 animate-glow cursor-pointer">
                Explore Marketplace
              </button>
            </Link>
            <a
              href="#docs"
              className="px-8 py-3 bg-white/80 border border-indigo-200 text-indigo-700 rounded-full text-lg font-semibold shadow hover:bg-indigo-50 transition-all duration-200"
            >
              Docs
            </a>
          </div>
          {/* Modern illustration */}
          <svg
            width="180"
            height="120"
            viewBox="0 0 180 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto"
          >
            <ellipse cx="90" cy="60" rx="80" ry="40" fill="#e0e7ff" />
            <ellipse cx="90" cy="60" rx="60" ry="28" fill="#c7d2fe" />
            <ellipse cx="90" cy="60" rx="32" ry="16" fill="#818cf8" />
            <circle cx="90" cy="60" r="14" fill="#fff" />
            <text
              x="90"
              y="68"
              textAnchor="middle"
              fontSize="20"
              fontWeight="bold"
              fill="#6366f1"
            >
              AI
            </text>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-transparent">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {/* On-Chain AI */}
            <div className="relative group rounded-3xl p-8 flex flex-col items-center shadow-2xl bg-gradient-to-br from-indigo-500 via-blue-400 to-purple-400 overflow-hidden hover:scale-105 hover:shadow-2xl transition-all duration-300">
              <div className="mb-4 flex items-center justify-center">
                <span className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/80 shadow-lg ring-4 ring-indigo-300 group-hover:ring-indigo-500 transition-all duration-300">
                  <span className="text-5xl">🧠</span>
                </span>
              </div>
              <h3 className="font-bold text-lg mb-3 text-white drop-shadow text-center">
                On-Chain AI
              </h3>
              <p className="text-white/90 text-center text-base">
                Run and license AI models.
              </p>
            </div>
            {/* Prompt Marketplace */}
            <div className="relative group rounded-3xl p-8 flex flex-col items-center shadow-2xl bg-gradient-to-br from-pink-400 via-yellow-300 to-orange-400 overflow-hidden hover:scale-105 hover:shadow-2xl transition-all duration-300">
              <div className="mb-4 flex items-center justify-center">
                <span className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/80 shadow-lg ring-4 ring-pink-300 group-hover:ring-pink-500 transition-all duration-300">
                  <span className="text-5xl">📦</span>
                </span>
              </div>
              <h3 className="font-bold text-lg mb-3 text-white drop-shadow text-center">
                Prompt Marketplace
              </h3>
              <p className="text-white/90 text-center text-base">
                Buy, sell, and license prompts.
              </p>
            </div>
            {/* Verifiable Outputs */}
            <div className="relative group rounded-3xl p-8 flex flex-col items-center shadow-2xl bg-gradient-to-br from-green-400 via-teal-400 to-blue-400 overflow-hidden hover:scale-105 hover:shadow-2xl transition-all duration-300">
              <div className="mb-4 flex items-center justify-center">
                <span className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/80 shadow-lg ring-4 ring-green-300 group-hover:ring-green-500 transition-all duration-300">
                  <span className="text-5xl">🔒</span>
                </span>
              </div>
              <h3 className="font-bold text-lg mb-3 text-white drop-shadow text-center">
                Verifiable Outputs
              </h3>
              <p className="text-white/90 text-center text-base">
                Trust every result, on-chain.
              </p>
            </div>
            {/* DAO Governance */}
            <div className="relative group rounded-3xl p-8 flex flex-col items-center shadow-2xl bg-gradient-to-br from-yellow-400 via-pink-400 to-purple-400 overflow-hidden hover:scale-105 hover:shadow-2xl transition-all duration-300">
              <div className="mb-4 flex items-center justify-center">
                <span className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/80 shadow-lg ring-4 ring-yellow-300 group-hover:ring-yellow-500 transition-all duration-300">
                  <span className="text-5xl">🏛️</span>
                </span>
              </div>
              <h3 className="font-bold text-lg mb-3 text-white drop-shadow text-center">
                DAO Governance
              </h3>
              <p className="text-white/90 text-center text-base">
                Community-powered, fair, open.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-white border-t">
        <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-gray-500 text-sm">
          <div>© {new Date().getFullYear()} NeuroNet DAO</div>
          <div className="flex gap-4 mt-2 md:mt-0">
            <a href="#docs" className="hover:text-indigo-600">
              Docs
            </a>
            <a href="#support" className="hover:text-indigo-600">
              Support
            </a>
          </div>
        </div>
      </footer>

      {/* Animations */}
      <style>{`
        .animate-cube-float1 {
          animation: cubeFloat1 8s ease-in-out infinite alternate;
        }
        .animate-cube-float2 {
          animation: cubeFloat2 10s ease-in-out infinite alternate;
        }
        .animate-cube-float3 {
          animation: cubeFloat3 12s ease-in-out infinite alternate;
        }
        .animate-cube-float4 {
          animation: cubeFloat4 14s ease-in-out infinite alternate;
        }
        @keyframes cubeFloat1 {
          0% { transform: translateY(0) scale(1) rotate(-8deg); }
          50% { transform: translateY(-32px) scale(1.08) rotate(8deg); }
          100% { transform: translateY(0) scale(1) rotate(-8deg); }
        }
        @keyframes cubeFloat2 {
          0% { transform: translateY(0) scale(1) rotate(6deg); }
          50% { transform: translateY(-24px) scale(1.04) rotate(-6deg); }
          100% { transform: translateY(0) scale(1) rotate(6deg); }
        }
        @keyframes cubeFloat3 {
          0% { transform: translateY(0) scale(1) rotate(0deg); }
          50% { transform: translateY(-18px) scale(1.06) rotate(12deg); }
          100% { transform: translateY(0) scale(1) rotate(0deg); }
        }
        @keyframes cubeFloat4 {
          0% { transform: translateY(0) scale(1) rotate(-12deg); }
          50% { transform: translateY(-28px) scale(1.1) rotate(12deg); }
          100% { transform: translateY(0) scale(1) rotate(-12deg); }
        }
        .animate-glow {
          box-shadow: 0 0 16px 2px #818cf8, 0 0 32px 8px #f0abfc33;
        }
      `}</style>
    </div>
  );
}
