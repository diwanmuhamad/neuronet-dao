"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import AuthButton from "../components/AuthButton";
import UserDropdown from "../components/UserDropdown";
import { useAuth } from "../contexts/AuthContext";

export default function HomePage() {
  const [stats, setStats] = useState({
    totalPrompts: 210000,
    fiveStarReviews: 22000,
    trustedUsers: 350000,
  });

  const { isAuthenticated, principal } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Navigation */}
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

        <div className="hidden md:flex items-center gap-8">
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
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden lg:block relative max-w-md">
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

          <div className="flex items-center gap-4">
            <button className="text-gray-300 hover:text-white transition-colors">
              Hire
            </button>
            <button className="text-gray-300 hover:text-white transition-colors">
              Create
            </button>
            <button className="text-gray-300 hover:text-white transition-colors">
              Sell
            </button>
            <AuthButton />
            <UserDropdown />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6">
            On-Chain AI Marketplace
          </h1>
          <p className="text-xl text-gray-300 mb-4 max-w-3xl mx-auto">
            The decentralized AI marketplace for prompts, datasets, and model
            outputs.
          </p>
          <p className="text-lg text-gray-400 mb-12">
            <span className="text-violet-400">Midjourney</span>,{" "}
            <span className="text-pink-400">ChatGPT</span>,{" "}
            <span className="text-blue-400">Sora</span>,{" "}
            <span className="text-green-400">FLUX</span> & more
          </p>

          <div className="flex items-center justify-center gap-6 mb-12">
            <div className="flex text-yellow-400 text-lg">★★★★★</div>
            <span className="text-gray-300">
              {stats.fiveStarReviews.toLocaleString()}+ five star reviews
            </span>
            <span className="text-gray-400">✓</span>
            <span className="text-gray-300">
              Trusted by {stats.trustedUsers.toLocaleString()}+ users
            </span>
          </div>

          <div className="text-sm text-gray-400 mb-8">
            Featured in{" "}
            <span className="text-gray-300 font-medium">THE VERGE</span>,{" "}
            <span className="text-gray-300 font-medium">WIRED</span>,{" "}
            <span className="text-gray-300 font-medium">FAST COMPANY</span>,{" "}
            <span className="text-gray-300 font-medium">FINANCIAL TIMES</span>,{" "}
            <span className="text-gray-300 font-medium">TechCrunch</span>,{" "}
            <span className="text-gray-300 font-medium">Vogue</span>,{" "}
            <span className="text-gray-300 font-medium">WSJ</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/marketplace">
              <button className="px-8 py-3 bg-gradient-to-r from-violet-500 to-pink-500 text-white rounded-xl font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-200">
                Explore Marketplace
              </button>
            </Link>
            <button className="px-8 py-3 bg-gray-800 text-white rounded-xl font-medium text-lg border border-gray-700 hover:bg-gray-700 transition-all duration-200">
              Docs
            </button>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-6 text-left hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                  <span className="text-3xl">🎨</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">
                    Hire an AI Creator
                  </h3>
                  <p className="text-white/80 text-sm">
                    Discover world class AI experts
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-6 text-left hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                  <span className="text-3xl">🚀</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">
                    Build an AI App
                  </h3>
                  <p className="text-white/80 text-sm">
                    Create AI apps using prompts
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-pink-600 to-red-600 rounded-2xl p-6 text-left hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                  <span className="text-3xl">👥</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">
                    Join a Community
                  </h3>
                  <p className="text-white/80 text-sm">
                    Chat with other AI creators
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-600 to-teal-600 rounded-2xl p-6 text-left hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                  <span className="text-3xl">🔍</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">
                    Explore the Marketplace
                  </h3>
                  <p className="text-white/80 text-sm">
                    Browse {stats.totalPrompts.toLocaleString()}+ quality
                    prompts
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Prompts Section */}
      <section className="py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8">
            Featured Prompts
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-12">
            {[
              {
                title: "Immersive Retro RPG Videos",
                price: "$4.99",
                category: "Midjourney Video",
                image:
                  "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop",
              },
              {
                title: "About Me Graphic Social Bio Visuals",
                price: "$4.99",
                category: "ChatGPT Image",
                image:
                  "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=200&fit=crop",
              },
              {
                title: "Motion Blur Focal Product Videos",
                price: "$4.99",
                category: "Midjourney Video",
                image:
                  "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop",
              },
              {
                title: "Back To School Poster Elements",
                price: "$3.99",
                category: "Imagen",
                image:
                  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&h=200&fit=crop",
              },
              {
                title: "Turn Anything Into Surprise Creative",
                price: "$5.99",
                category: "Veo",
                image:
                  "https://images.unsplash.com/photo-1536431311719-398b6704d4cc?w=300&h=200&fit=crop",
              },
              {
                title: "Modern Minimalist Design Templates",
                price: "$6.99",
                category: "DALL-E",
                image:
                  "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=200&fit=crop",
              },
            ].map((prompt, index) => (
              <div
                key={index}
                className="bg-gray-800/50 rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={prompt.image}
                    alt={prompt.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-violet-500 text-white text-xs font-medium rounded-full">
                      {prompt.category}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-white text-sm mb-2 line-clamp-2">
                    {prompt.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold">{prompt.price}</span>
                    <div className="flex items-center gap-1 text-yellow-400 text-sm">
                      ★★★★★
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Datasets Section */}
      <section className="py-16 px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8">
            Featured Datasets
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-12">
            {[
              {
                title: "Medical Image Classification Dataset",
                price: "$29.99",
                category: "Healthcare",
                image:
                  "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop",
                size: "50K images",
              },
              {
                title: "Financial Time Series Data",
                price: "$19.99",
                category: "Finance",
                image:
                  "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300&h=200&fit=crop",
                size: "100K records",
              },
              {
                title: "Natural Language Processing Corpus",
                price: "$24.99",
                category: "NLP",
                image:
                  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop",
                size: "1M sentences",
              },
              {
                title: "E-commerce Product Reviews",
                price: "$15.99",
                category: "Retail",
                image:
                  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop",
                size: "250K reviews",
              },
              {
                title: "Autonomous Vehicle Training Data",
                price: "$49.99",
                category: "Automotive",
                image:
                  "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=300&h=200&fit=crop",
                size: "75K frames",
              },
              {
                title: "Social Media Sentiment Dataset",
                price: "$12.99",
                category: "Social",
                image:
                  "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&h=200&fit=crop",
                size: "500K posts",
              },
            ].map((dataset, index) => (
              <div
                key={index}
                className="bg-gray-800/50 rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={dataset.image}
                    alt={dataset.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
                      {dataset.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 bg-black/70 text-white text-xs font-medium rounded-full">
                      {dataset.size}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-white text-sm mb-2 line-clamp-2">
                    {dataset.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold">
                      {dataset.price}
                    </span>
                    <div className="flex items-center gap-1 text-yellow-400 text-sm">
                      ★★★★★
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured AI Outputs Section */}
      <section className="py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8">
            Featured AI Outputs
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-12">
            {[
              {
                title: "Professional Headshot Collection",
                price: "$9.99",
                category: "Photography",
                image:
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop",
                type: "50 images",
              },
              {
                title: "Logo Design Variations",
                price: "$14.99",
                category: "Design",
                image:
                  "https://images.unsplash.com/photo-1634942537034-2531766767d1?w=300&h=200&fit=crop",
                type: "25 logos",
              },
              {
                title: "Marketing Copy Templates",
                price: "$7.99",
                category: "Copywriting",
                image:
                  "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=300&h=200&fit=crop",
                type: "30 templates",
              },
              {
                title: "Product Mockup Collection",
                price: "$19.99",
                category: "Product",
                image:
                  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop",
                type: "40 mockups",
              },
              {
                title: "Code Documentation Set",
                price: "$12.99",
                category: "Development",
                image:
                  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=200&fit=crop",
                type: "15 docs",
              },
              {
                title: "Video Script Bundle",
                price: "$16.99",
                category: "Content",
                image:
                  "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=200&fit=crop",
                type: "20 scripts",
              },
            ].map((output, index) => (
              <div
                key={index}
                className="bg-gray-800/50 rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={output.image}
                    alt={output.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                      {output.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 bg-black/70 text-white text-xs font-medium rounded-full">
                      {output.type}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-white text-sm mb-2 line-clamp-2">
                    {output.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold">{output.price}</span>
                    <div className="flex items-center gap-1 text-yellow-400 text-sm">
                      ★★★★★
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Prompts Section */}
      <section className="py-16 px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8">
            Trending Prompts
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Column 1 */}
            <div className="space-y-4">
              {[
                {
                  rank: 1,
                  title: "Haunted Halloween Dolls Video",
                  category: "Midjourney Video",
                  price: "$5.99",
                  rating: 5.0,
                },
                {
                  rank: 2,
                  title: "Gothic Halloween Junk Journal",
                  category: "Midjourney",
                  price: "$3.99",
                  rating: 5.0,
                },
                {
                  rank: 3,
                  title: "Adorable 3D Characters In Costume",
                  category: "ChatGPT Image",
                  price: "Free",
                  rating: 5.0,
                },
                {
                  rank: 4,
                  title: "Cactus Dreams Boho Junk Journal",
                  category: "Midjourney",
                  price: "$2.99",
                  rating: 4.8,
                },
                {
                  rank: 5,
                  title: "ASMR Squeezing Out Jelly Animation",
                  category: "Veo",
                  price: "$6.99",
                  rating: 4.9,
                },
              ].map((item) => (
                <div
                  key={item.rank}
                  className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 bg-violet-500 rounded-lg flex items-center justify-center font-bold text-white text-sm">
                    {item.rank}
                  </div>
                  <div className="w-12 h-12 bg-gray-700 rounded-lg"></div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white text-sm font-medium truncate">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-400">
                        {item.category}
                      </span>
                      <div className="flex items-center gap-1 text-yellow-400 text-xs">
                        ★ {item.rating}
                      </div>
                    </div>
                  </div>
                  <span className="text-white font-bold text-sm">
                    {item.price}
                  </span>
                </div>
              ))}
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              {[
                {
                  rank: 6,
                  title: "Victorian Halloween Junk Journal",
                  category: "Midjourney",
                  price: "$4.99",
                  rating: 5.0,
                },
                {
                  rank: 7,
                  title: "Haunted Harvest Halloween Journal",
                  category: "Midjourney",
                  price: "$4.99",
                  rating: 5.0,
                },
                {
                  rank: 8,
                  title: "Farmhouse Halloween Junk Journal",
                  category: "Midjourney",
                  price: "$4.99",
                  rating: 5.0,
                },
                {
                  rank: 9,
                  title: "Discount Flyer Poster Creator",
                  category: "ChatGPT Image",
                  price: "$3.99",
                  rating: 4.7,
                },
                {
                  rank: 10,
                  title: "Illustrations Of Ancient Chinese",
                  category: "Midjourney",
                  price: "$4.99",
                  rating: 4.8,
                },
              ].map((item) => (
                <div
                  key={item.rank}
                  className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 bg-violet-500 rounded-lg flex items-center justify-center font-bold text-white text-sm">
                    {item.rank}
                  </div>
                  <div className="w-12 h-12 bg-gray-700 rounded-lg"></div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white text-sm font-medium truncate">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-400">
                        {item.category}
                      </span>
                      <div className="flex items-center gap-1 text-yellow-400 text-xs">
                        ★ {item.rating}
                      </div>
                    </div>
                  </div>
                  <span className="text-white font-bold text-sm">
                    {item.price}
                  </span>
                </div>
              ))}
            </div>

            {/* Column 3 */}
            <div className="space-y-4">
              {[
                {
                  rank: 11,
                  title: "Medieval Tapestry Art Style",
                  category: "Midjourney",
                  price: "$4.99",
                  rating: 4.9,
                },
                {
                  rank: 12,
                  title: "Adorable Stuffed Toy Design",
                  category: "Midjourney",
                  price: "$3.99",
                  rating: 5.0,
                },
                {
                  rank: 13,
                  title: "Modern Blue Gold Art Style",
                  category: "Midjourney",
                  price: "$4.99",
                  rating: 4.8,
                },
                {
                  rank: 14,
                  title: "Futuristic SciFi Moto Car Render",
                  category: "Midjourney",
                  price: "Free",
                  rating: 4.7,
                },
                {
                  rank: 15,
                  title: "Mythical Creatures As Models",
                  category: "Leonardo AI",
                  price: "$2.99",
                  rating: 4.9,
                },
              ].map((item) => (
                <div
                  key={item.rank}
                  className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 bg-violet-500 rounded-lg flex items-center justify-center font-bold text-white text-sm">
                    {item.rank}
                  </div>
                  <div className="w-12 h-12 bg-gray-700 rounded-lg"></div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white text-sm font-medium truncate">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-400">
                        {item.category}
                      </span>
                      <div className="flex items-center gap-1 text-yellow-400 text-xs">
                        ★ {item.rating}
                      </div>
                    </div>
                  </div>
                  <span className="text-white font-bold text-sm">
                    {item.price}
                  </span>
                </div>
              ))}
            </div>

            {/* Column 4 */}
            <div className="space-y-4">
              {[
                {
                  rank: 16,
                  title: "Fantasy Character Portraits",
                  category: "DALL-E",
                  price: "$5.99",
                  rating: 4.9,
                },
                {
                  rank: 17,
                  title: "Cyberpunk City Landscapes",
                  category: "Midjourney",
                  price: "$4.99",
                  rating: 4.8,
                },
                {
                  rank: 18,
                  title: "Vintage Photography Styles",
                  category: "Stable Diffusion",
                  price: "$3.99",
                  rating: 4.7,
                },
                {
                  rank: 19,
                  title: "Abstract Art Generator",
                  category: "FLUX",
                  price: "$6.99",
                  rating: 4.9,
                },
                {
                  rank: 20,
                  title: "Product Photography Setup",
                  category: "Midjourney",
                  price: "$5.99",
                  rating: 5.0,
                },
              ].map((item) => (
                <div
                  key={item.rank}
                  className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 bg-violet-500 rounded-lg flex items-center justify-center font-bold text-white text-sm">
                    {item.rank}
                  </div>
                  <div className="w-12 h-12 bg-gray-700 rounded-lg"></div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white text-sm font-medium truncate">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-400">
                        {item.category}
                      </span>
                      <div className="flex items-center gap-1 text-yellow-400 text-xs">
                        ★ {item.rating}
                      </div>
                    </div>
                  </div>
                  <span className="text-white font-bold text-sm">
                    {item.price}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/marketplace">
              <button className="px-8 py-3 bg-gradient-to-r from-violet-500 to-pink-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200">
                View All Prompts
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Datasets Section */}
      <section className="py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8">
            Trending Datasets
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Column 1 */}
            <div className="space-y-4">
              {[
                {
                  rank: 1,
                  title: "Computer Vision Training Data",
                  category: "Vision",
                  price: "$89.99",
                  rating: 5.0,
                  size: "100K images",
                },
                {
                  rank: 2,
                  title: "Customer Support Conversations",
                  category: "NLP",
                  price: "$45.99",
                  rating: 4.9,
                  size: "50K chats",
                },
                {
                  rank: 3,
                  title: "Stock Market Historical Data",
                  category: "Finance",
                  price: "$65.99",
                  rating: 4.8,
                  size: "10 years",
                },
                {
                  rank: 4,
                  title: "Social Media Analytics Dataset",
                  category: "Social",
                  price: "$29.99",
                  rating: 4.7,
                  size: "1M posts",
                },
                {
                  rank: 5,
                  title: "IoT Sensor Data Collection",
                  category: "IoT",
                  price: "$39.99",
                  rating: 4.9,
                  size: "500K readings",
                },
              ].map((item) => (
                <div
                  key={item.rank}
                  className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-white text-sm">
                    {item.rank}
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
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
                        d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white text-sm font-medium truncate">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-blue-400">
                        {item.category}
                      </span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-400">{item.size}</span>
                      <div className="flex items-center gap-1 text-yellow-400 text-xs">
                        ★ {item.rating}
                      </div>
                    </div>
                  </div>
                  <span className="text-white font-bold text-sm">
                    {item.price}
                  </span>
                </div>
              ))}
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              {[
                {
                  rank: 6,
                  title: "Medical Image Annotations",
                  category: "Healthcare",
                  price: "$129.99",
                  rating: 5.0,
                  size: "25K scans",
                },
                {
                  rank: 7,
                  title: "E-commerce Product Catalog",
                  category: "Retail",
                  price: "$35.99",
                  rating: 4.8,
                  size: "200K products",
                },
                {
                  rank: 8,
                  title: "Weather Prediction Dataset",
                  category: "Climate",
                  price: "$55.99",
                  rating: 4.7,
                  size: "5 years",
                },
                {
                  rank: 9,
                  title: "Speech Recognition Training",
                  category: "Audio",
                  price: "$75.99",
                  rating: 4.9,
                  size: "100K hours",
                },
                {
                  rank: 10,
                  title: "Cybersecurity Log Data",
                  category: "Security",
                  price: "$95.99",
                  rating: 4.8,
                  size: "1TB logs",
                },
              ].map((item) => (
                <div
                  key={item.rank}
                  className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-white text-sm">
                    {item.rank}
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
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
                        d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white text-sm font-medium truncate">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-blue-400">
                        {item.category}
                      </span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-400">{item.size}</span>
                      <div className="flex items-center gap-1 text-yellow-400 text-xs">
                        ★ {item.rating}
                      </div>
                    </div>
                  </div>
                  <span className="text-white font-bold text-sm">
                    {item.price}
                  </span>
                </div>
              ))}
            </div>

            {/* Column 3 */}
            <div className="space-y-4">
              {[
                {
                  rank: 11,
                  title: "Autonomous Driving Scenarios",
                  category: "Automotive",
                  price: "$199.99",
                  rating: 5.0,
                  size: "1M frames",
                },
                {
                  rank: 12,
                  title: "Legal Document Analysis",
                  category: "Legal",
                  price: "$85.99",
                  rating: 4.9,
                  size: "50K docs",
                },
                {
                  rank: 13,
                  title: "Game Analytics Dataset",
                  category: "Gaming",
                  price: "$25.99",
                  rating: 4.7,
                  size: "10M events",
                },
                {
                  rank: 14,
                  title: "Real Estate Market Data",
                  category: "Property",
                  price: "$45.99",
                  rating: 4.8,
                  size: "100K listings",
                },
                {
                  rank: 15,
                  title: "Supply Chain Logistics",
                  category: "Logistics",
                  price: "$65.99",
                  rating: 4.9,
                  size: "500K shipments",
                },
              ].map((item) => (
                <div
                  key={item.rank}
                  className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-white text-sm">
                    {item.rank}
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
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
                        d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white text-sm font-medium truncate">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-blue-400">
                        {item.category}
                      </span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-400">{item.size}</span>
                      <div className="flex items-center gap-1 text-yellow-400 text-xs">
                        ★ {item.rating}
                      </div>
                    </div>
                  </div>
                  <span className="text-white font-bold text-sm">
                    {item.price}
                  </span>
                </div>
              ))}
            </div>

            {/* Column 4 */}
            <div className="space-y-4">
              {[
                {
                  rank: 16,
                  title: "Satellite Imagery Dataset",
                  category: "Geospatial",
                  price: "$299.99",
                  rating: 5.0,
                  size: "50K images",
                },
                {
                  rank: 17,
                  title: "Multi-language Text Corpus",
                  category: "Translation",
                  price: "$115.99",
                  rating: 4.9,
                  size: "20 languages",
                },
                {
                  rank: 18,
                  title: "Biometric Recognition Data",
                  category: "Biometrics",
                  price: "$175.99",
                  rating: 4.8,
                  size: "100K samples",
                },
                {
                  rank: 19,
                  title: "Agricultural Monitoring Set",
                  category: "Agriculture",
                  price: "$85.99",
                  rating: 4.7,
                  size: "2 years",
                },
                {
                  rank: 20,
                  title: "Network Traffic Analysis",
                  category: "Network",
                  price: "$125.99",
                  rating: 4.9,
                  size: "1TB traffic",
                },
              ].map((item) => (
                <div
                  key={item.rank}
                  className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-white text-sm">
                    {item.rank}
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
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
                        d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white text-sm font-medium truncate">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-blue-400">
                        {item.category}
                      </span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-400">{item.size}</span>
                      <div className="flex items-center gap-1 text-yellow-400 text-xs">
                        ★ {item.rating}
                      </div>
                    </div>
                  </div>
                  <span className="text-white font-bold text-sm">
                    {item.price}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200">
              View All Datasets
            </button>
          </div>
        </div>
      </section>

      {/* Trending AI Outputs Section */}
      <section className="py-16 px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8">
            Trending AI Outputs
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Column 1 */}
            <div className="space-y-4">
              {[
                {
                  rank: 1,
                  title: "Corporate Headshot Pack",
                  category: "Photography",
                  price: "$24.99",
                  rating: 5.0,
                  type: "100 images",
                },
                {
                  rank: 2,
                  title: "Logo Design Collection",
                  category: "Branding",
                  price: "$39.99",
                  rating: 4.9,
                  type: "50 logos",
                },
                {
                  rank: 3,
                  title: "Marketing Email Templates",
                  category: "Marketing",
                  price: "$19.99",
                  rating: 4.8,
                  type: "75 templates",
                },
                {
                  rank: 4,
                  title: "Website Copy Bundle",
                  category: "Copywriting",
                  price: "$29.99",
                  rating: 4.9,
                  type: "25 pages",
                },
                {
                  rank: 5,
                  title: "Product Description Set",
                  category: "E-commerce",
                  price: "$15.99",
                  rating: 4.7,
                  type: "200 descriptions",
                },
              ].map((item) => (
                <div
                  key={item.rank}
                  className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center font-bold text-white text-sm">
                    {item.rank}
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
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
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white text-sm font-medium truncate">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-green-400">
                        {item.category}
                      </span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-400">{item.type}</span>
                      <div className="flex items-center gap-1 text-yellow-400 text-xs">
                        ★ {item.rating}
                      </div>
                    </div>
                  </div>
                  <span className="text-white font-bold text-sm">
                    {item.price}
                  </span>
                </div>
              ))}
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              {[
                {
                  rank: 6,
                  title: "Social Media Post Pack",
                  category: "Social Media",
                  price: "$18.99",
                  rating: 4.8,
                  type: "150 posts",
                },
                {
                  rank: 7,
                  title: "Video Script Collection",
                  category: "Video",
                  price: "$34.99",
                  rating: 4.9,
                  type: "30 scripts",
                },
                {
                  rank: 8,
                  title: "Code Documentation Bundle",
                  category: "Development",
                  price: "$22.99",
                  rating: 4.7,
                  type: "20 docs",
                },
                {
                  rank: 9,
                  title: "Business Plan Templates",
                  category: "Business",
                  price: "$49.99",
                  rating: 5.0,
                  type: "10 plans",
                },
                {
                  rank: 10,
                  title: "Resume Optimization Pack",
                  category: "Career",
                  price: "$16.99",
                  rating: 4.8,
                  type: "25 resumes",
                },
              ].map((item) => (
                <div
                  key={item.rank}
                  className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center font-bold text-white text-sm">
                    {item.rank}
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
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
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white text-sm font-medium truncate">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-green-400">
                        {item.category}
                      </span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-400">{item.type}</span>
                      <div className="flex items-center gap-1 text-yellow-400 text-xs">
                        ★ {item.rating}
                      </div>
                    </div>
                  </div>
                  <span className="text-white font-bold text-sm">
                    {item.price}
                  </span>
                </div>
              ))}
            </div>

            {/* Column 3 */}
            <div className="space-y-4">
              {[
                {
                  rank: 11,
                  title: "Presentation Slide Decks",
                  category: "Presentation",
                  price: "$27.99",
                  rating: 4.9,
                  type: "40 slides",
                },
                {
                  rank: 12,
                  title: "Newsletter Content Pack",
                  category: "Newsletter",
                  price: "$21.99",
                  rating: 4.8,
                  type: "50 issues",
                },
                {
                  rank: 13,
                  title: "Podcast Episode Scripts",
                  category: "Podcasting",
                  price: "$32.99",
                  rating: 4.9,
                  type: "25 episodes",
                },
                {
                  rank: 14,
                  title: "Product Photography Set",
                  category: "Product",
                  price: "$45.99",
                  rating: 5.0,
                  type: "200 photos",
                },
                {
                  rank: 15,
                  title: "Educational Course Content",
                  category: "Education",
                  price: "$89.99",
                  rating: 4.9,
                  type: "15 modules",
                },
              ].map((item) => (
                <div
                  key={item.rank}
                  className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center font-bold text-white text-sm">
                    {item.rank}
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
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
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white text-sm font-medium truncate">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-green-400">
                        {item.category}
                      </span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-400">{item.type}</span>
                      <div className="flex items-center gap-1 text-yellow-400 text-xs">
                        ★ {item.rating}
                      </div>
                    </div>
                  </div>
                  <span className="text-white font-bold text-sm">
                    {item.price}
                  </span>
                </div>
              ))}
            </div>

            {/* Column 4 */}
            <div className="space-y-4">
              {[
                {
                  rank: 16,
                  title: "Web Design Mockups",
                  category: "Web Design",
                  price: "$55.99",
                  rating: 5.0,
                  type: "35 mockups",
                },
                {
                  rank: 17,
                  title: "App Interface Designs",
                  category: "UI/UX",
                  price: "$67.99",
                  rating: 4.9,
                  type: "50 screens",
                },
                {
                  rank: 18,
                  title: "SEO Content Articles",
                  category: "SEO",
                  price: "$38.99",
                  rating: 4.8,
                  type: "100 articles",
                },
                {
                  rank: 19,
                  title: "Animation Sequences",
                  category: "Animation",
                  price: "$75.99",
                  rating: 4.9,
                  type: "20 animations",
                },
                {
                  rank: 20,
                  title: "Legal Document Templates",
                  category: "Legal",
                  price: "$125.99",
                  rating: 5.0,
                  type: "15 templates",
                },
              ].map((item) => (
                <div
                  key={item.rank}
                  className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center font-bold text-white text-sm">
                    {item.rank}
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
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
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white text-sm font-medium truncate">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-green-400">
                        {item.category}
                      </span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-400">{item.type}</span>
                      <div className="flex items-center gap-1 text-yellow-400 text-xs">
                        ★ {item.rating}
                      </div>
                    </div>
                  </div>
                  <span className="text-white font-bold text-sm">
                    {item.price}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <button className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200">
              View All AI Outputs
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">N</span>
                </div>
                <span className="text-2xl font-bold text-white">NeuroNet</span>
                <span className="text-xs bg-violet-100 text-violet-700 px-2 py-1 rounded-full font-semibold">
                  DAO
                </span>
              </div>
              <p className="text-gray-400 text-sm">
                The decentralized AI marketplace for prompts, datasets, and
                model outputs.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Marketplace</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <Link href="/marketplace" className="block hover:text-white">
                  All Prompts
                </Link>
                <a href="#" className="block hover:text-white">
                  Featured
                </a>
                <a href="#" className="block hover:text-white">
                  Trending
                </a>
                <a href="#" className="block hover:text-white">
                  New Releases
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Create</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <a href="#" className="block hover:text-white">
                  Sell Prompts
                </a>
                <a href="#" className="block hover:text-white">
                  Creator Guide
                </a>
                <a href="#" className="block hover:text-white">
                  Community
                </a>
                <a href="#" className="block hover:text-white">
                  Resources
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <a href="#" className="block hover:text-white">
                  Help Center
                </a>
                <a href="#" className="block hover:text-white">
                  Documentation
                </a>
                <a href="#" className="block hover:text-white">
                  Contact Us
                </a>
                <a href="#" className="block hover:text-white">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} NeuroNet DAO. All rights reserved.
            </p>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm">
                Terms
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
