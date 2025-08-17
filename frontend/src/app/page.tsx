"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import ActionCardsSection from "../components/ActionCardsSection";
import FeaturedSection from "../components/FeaturedSection";
import TrendingSection from "../components/TrendingSection";
import { useAuth } from "../contexts/AuthContext";
import { useCategories } from "../hooks/useCategories";
import {
  samplePrompts,
  sampleDatasets,
  sampleAIOutputs,
  trendingPromptsColumn1,
  trendingPromptsColumn2,
  trendingPromptsColumn3,
  trendingPromptsColumn4,
  trendingDatasets,
  trendingAIOutputs,
  defaultActionCards,
} from "../utils/sampleData";

export default function HomePage() {
  const [stats, setStats] = useState({
    totalPrompts: 210000,
    fiveStarReviews: 22000,
    trustedUsers: 350000,
  });

  const { isAuthenticated, principal } = useAuth();
  const {
    getPromptCategories,
    getDatasetCategories,
    getAIOutputCategories,
    loading: categoriesLoading,
  } = useCategories();

  // Get dynamic data based on categories
  const getPromptData = () => {
    const promptCategories = getPromptCategories();
    return samplePrompts.map((prompt, index) => ({
      ...prompt,
      category: promptCategories[index]?.name || prompt.category,
    }));
  };

  const getDatasetData = () => {
    const datasetCategories = getDatasetCategories();
    return sampleDatasets.map((dataset, index) => ({
      ...dataset,
      category: datasetCategories[index]?.name || dataset.category,
    }));
  };

  const getAIOutputData = () => {
    const aiOutputCategories = getAIOutputCategories();
    return sampleAIOutputs.map((output, index) => ({
      ...output,
      category: aiOutputCategories[index]?.name || output.category,
    }));
  };

  // Custom action cards with dynamic stats
  const customActionCards = [
    ...defaultActionCards.slice(0, 3),
    {
      ...defaultActionCards[3],
      description: `Browse ${stats.totalPrompts.toLocaleString()}+ quality prompts`,
    },
  ];

  // Trending data structure
  const trendingPromptsColumns = [
    { items: trendingPromptsColumn1 },
    { items: trendingPromptsColumn2 },
    { items: trendingPromptsColumn3 },
    { items: trendingPromptsColumn4 },
  ];

  const trendingDatasetsColumns = trendingDatasets.map((items) => ({ items }));
  const trendingAIOutputsColumns = trendingAIOutputs.map((items) => ({
    items,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <Navbar />

      {/* Hero Section */}
      <HeroSection
        title="On-Chain AI Marketplace"
        subtitle="The decentralized AI marketplace for prompts, datasets, and model outputs."
        description="Midjourney, ChatGPT, Sora, FLUX & more"
        stats={stats}
        primaryButtonText="Explore Marketplace"
        primaryButtonLink="/marketplace"
        secondaryButtonText="Docs"
      />

      {/* Action Cards */}
      <ActionCardsSection cards={customActionCards} />

      {/* Featured Prompts Section */}
      <FeaturedSection
        title="Featured Prompts"
        items={getPromptData()}
        itemType="prompt"
      />

      {/* Featured Datasets Section */}
      <FeaturedSection
        title="Featured Datasets"
        items={getDatasetData()}
        backgroundColor="bg-gray-900/50"
        itemType="dataset"
      />

      {/* Featured AI Outputs Section */}
      <FeaturedSection
        title="Featured AI Outputs"
        items={getAIOutputData()}
        itemType="ai-output"
      />

      {/* Trending Prompts Section */}
      <TrendingSection
        title="Trending Prompts"
        columns={trendingPromptsColumns}
        backgroundColor="bg-gray-900/50"
        itemType="prompt"
      />

      {/* Trending Datasets Section */}
      <TrendingSection
        title="Trending Datasets"
        columns={trendingDatasetsColumns}
        backgroundColor="transparent"
        itemType="dataset"
      />

      {/* Trending AI Outputs Section */}
      <TrendingSection
        title="Trending AI Outputs"
        columns={trendingAIOutputsColumns}
        backgroundColor="bg-gray-900/50"
        itemType="ai-output"
      />

      {/* Footer */}
      <footer className="bg-gray-900 py-16 px-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-pink-500 rounded-lg"></div>
                <span className="text-white font-bold text-xl">
                  NeuroNet DAO
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-6 max-w-md">
                The premier decentralized AI marketplace for buying and selling
                prompts, datasets, and AI outputs. Built on the Internet
                Computer for true decentralization.
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
                >
                  <span className="text-gray-400">𝕏</span>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
                >
                  <span className="text-gray-400">📧</span>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
                >
                  <span className="text-gray-400">💬</span>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Marketplace</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <Link href="/marketplace" className="block hover:text-white">
                  Browse All
                </Link>
                <a href="#" className="block hover:text-white">
                  Prompts
                </a>
                <a href="#" className="block hover:text-white">
                  Datasets
                </a>
                <a href="#" className="block hover:text-white">
                  AI Outputs
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
