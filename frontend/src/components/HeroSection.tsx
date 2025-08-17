"use client";
import React from "react";
import Link from "next/link";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  description: string;
  stats: {
    totalPrompts: number;
    fiveStarReviews: number;
    trustedUsers: number;
  };
  featuredIn?: string[];
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  backgroundGradient?: string;
}

export default function HeroSection({
  title,
  subtitle,
  description,
  stats,
  featuredIn = [
    "THE VERGE",
    "WIRED",
    "FAST COMPANY",
    "FINANCIAL TIMES",
    "TechCrunch",
    "Vogue",
    "WSJ"
  ],
  primaryButtonText = "Explore Marketplace",
  primaryButtonLink = "/marketplace",
  secondaryButtonText = "Docs",
  backgroundGradient = "bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900"
}: HeroSectionProps) {
  return (
    <section className="py-20 px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-6xl md:text-7xl font-bold text-white mb-6">
          {title}
        </h1>
        <p className="text-xl text-gray-300 mb-4 max-w-3xl mx-auto">
          {subtitle}
        </p>
        <p className="text-lg text-gray-400 mb-12">
          {description}
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
          {featuredIn.map((publication, index) => (
            <span key={publication}>
              <span className="text-gray-300 font-medium">{publication}</span>
              {index < featuredIn.length - 1 && ", "}
            </span>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link href={primaryButtonLink}>
            <button className="px-8 py-3 bg-gradient-to-r from-violet-500 to-pink-500 text-white rounded-xl font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-200">
              {primaryButtonText}
            </button>
          </Link>
          <button className="px-8 py-3 bg-gray-800 text-white rounded-xl font-medium text-lg border border-gray-700 hover:bg-gray-700 transition-all duration-200">
            {secondaryButtonText}
          </button>
        </div>
      </div>
    </section>
  );
}
