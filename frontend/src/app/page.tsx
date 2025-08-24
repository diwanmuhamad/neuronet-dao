"use client";
import React, { useState } from "react";
import Navbar from "../components/common/Navbar";
import HeroSection from "../components/marketplace/HeroSection";
import ActionCardsSection from "../components/marketplace/ActionCardsSection";
import FeaturedSection from "../components/marketplace/FeaturedSection";
import TrendingSection from "../components/marketplace/TrendingSection";
import { useMarketplaceData } from "../hooks/useMarketplaceData";
import { defaultActionCards } from "../utils/sampleData";
import Footer from "@/components/common/Footer";

export default function HomePage() {
  const [stats] = useState({
    totalPrompts: 210000,
    fiveStarReviews: 22000,
    trustedUsers: 350000,
  });

  // Use real marketplace data
  const {
    featuredPrompts,
    featuredDatasets,
    featuredAIOutputs,
    trendingPromptsColumns,
    trendingDatasetsColumns,
    trendingAIOutputsColumns,
    loading: marketplaceLoading,
    error: marketplaceError,
  } = useMarketplaceData();
  // Custom action cards with dynamic stats
  const customActionCards = [
    ...defaultActionCards.slice(0, 3),
    {
      ...defaultActionCards[3],
      description: `Browse ${stats.totalPrompts.toLocaleString()}+ quality prompts`,
    },
  ];

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
        primaryButtonLink="/marketplace/prompt"
        secondaryButtonText="Learn More"
      />

      {/* Action Cards */}
      <ActionCardsSection cards={customActionCards} />

      {/* Loading State */}
      {marketplaceLoading && (
        <div className="text-center py-16">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading marketplace data...</p>
        </div>
      )}

      {/* Error State */}
      {marketplaceError && (
        <div className="text-center py-16">
          <div className="text-red-400 mb-4">⚠️ {marketplaceError}</div>
          <button
            onClick={() => window.location.reload()}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      )}

      {/* Show sections only when data is loaded and no errors */}
      {!marketplaceLoading && !marketplaceError && (
        <>
          {
            /* Featured Prompts Section */
            featuredPrompts.length > 0 && (
              <FeaturedSection
                title="Featured Prompts"
                items={featuredPrompts}
                itemType="prompt"
              />
            )
          }

          {
            /* Featured Datasets Section */
            featuredDatasets.length > 0 && (
              <FeaturedSection
                title="Featured Datasets"
                items={featuredDatasets}
                backgroundColor="bg-gray-900/50"
                itemType="dataset"
              />
            )
          }

          {
            /* Featured AI Outputs Section */
            featuredAIOutputs.length > 0 && (
              <FeaturedSection
                title="Featured AI Outputs"
                items={featuredAIOutputs}
                itemType="ai-output"
              />
            )
          }

          {
            /* Trending Prompts Section */
            trendingPromptsColumns[0].length > 0 && (
              <TrendingSection
                title="Trending Prompts"
                columns={trendingPromptsColumns.map((items) => ({ items }))}
                backgroundColor="bg-gray-900/50"
                itemType="prompt"
              />
            )
          }

          {
            /* Trending Datasets Section */
            trendingDatasetsColumns[0].length > 0 && (
              <TrendingSection
                title="Trending Datasets"
                columns={trendingDatasetsColumns.map((items) => ({ items }))}
                backgroundColor="transparent"
                itemType="dataset"
              />
            )
          }

          {
            /* Trending AI Outputs Section */
            trendingAIOutputsColumns[0].length > 0 && (
              <TrendingSection
                title="Trending AI Outputs"
                columns={trendingAIOutputsColumns.map((items) => ({ items }))}
                backgroundColor="bg-gray-900/50"
                itemType="ai-output"
              />
            )
          }
        </>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
