"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

interface ActionCard {
  icon: string;
  title: string;
  description: string;
  gradient?: string;
  href?: string;
  onClick?: () => void;
}

interface ActionCardsSectionProps {
  cards: ActionCard[];
  backgroundColor?: string;
  sectionTitle?: string;
  sectionSubtitle?: string;
}

// Icon component with proper SVG icons instead of emojis for better consistency
const IconComponent = ({ type }: { type: string }) => {
  const icons = {
    creator: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
    build: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.78 0-2.678-2.153-1.415-3.414l5-5A2 2 0 009 9.172V5L8 4z"
        />
      </svg>
    ),
    community: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
        />
      </svg>
    ),
    explore: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        />
      </svg>
    ),
    default: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
  };

  return icons[type as keyof typeof icons] || icons.default;
};

export default function ActionCardsSection({
  cards,
  backgroundColor = "transparent",
  sectionTitle = "Get Started",
  sectionSubtitle = "Your journey begin with our AI marketplace",
}: ActionCardsSectionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const defaultCards: ActionCard[] = [
    {
      icon: "creator",
      title: "Hire AI Creators",
      description: "Connect with world-class AI experts and prompt engineers",
      href: "/marketplace/creators",
    },
    {
      icon: "build",
      title: "Build AI Apps",
      description: "Create powerful AI applications using our prompt library",
      href: "/marketplace/build",
    },
    {
      icon: "community",
      title: "Join Community",
      description: "Connect with thousands of AI creators and enthusiasts",
      href: "/community",
    },
    {
      icon: "explore",
      title: "Explore Marketplace",
      description: "Discover high-quality prompts, datasets, and AI models",
      href: "/marketplace",
    },
  ];

  const cardsToRender = cards.length > 0 ? cards : defaultCards;

  const CardContent = ({
    card,
    index,
  }: {
    card: ActionCard;
    index: number;
  }) => (
    <div
      className={`group relative bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-500 hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10 cursor-pointer ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
      style={{
        transitionDelay: `${index * 150}ms`,
      }}
    >
      {/* Subtle background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-700/50 rounded-xl mb-6 text-gray-300 group-hover:text-purple-300 group-hover:bg-purple-500/10 transition-all duration-300">
          <IconComponent type={card.icon} />
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-100 transition-colors duration-300">
          {card.title}
        </h3>

        {/* Description */}
        <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
          {card.description}
        </p>

        {/* Hover arrow indicator */}
        <div className="flex items-center mt-6 text-gray-500 group-hover:text-purple-400 transition-all duration-300">
          <span className="text-sm font-medium mr-2 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0">
            Learn more
          </span>
          <svg
            className="w-4 h-4 transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>

      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );

  return (
    <section
      className={`py-24 px-6 ${backgroundColor} relative overflow-hidden`}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/20 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2
            className={`text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 mb-4 transition-all duration-1000 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            {sectionTitle}
          </h2>
          <p
            className={`text-xl text-gray-400 max-w-2xl mx-auto transition-all duration-1000 delay-200 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            {sectionSubtitle}
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {cardsToRender.map((card, index) => {
            if (card.href) {
              return (
                <Link key={index} href={card.href}>
                  <CardContent card={card} index={index} />
                </Link>
              );
            }

            return (
              <div key={index} onClick={card.onClick}>
                <CardContent card={card} index={index} />
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div
          className={`text-center mt-16 transition-all duration-1000 delay-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <p className="text-gray-400 mb-6">
            Ready to get started? Join thousands of AI creators today.
          </p>
          <Link href="/marketplace">
            <button className="group relative px-8 py-4 bg-gray-800/60 backdrop-blur-sm text-white rounded-xl font-semibold border border-gray-600/50 hover:border-purple-400/50 hover:bg-gray-700/60 transition-all duration-300 transform hover:scale-105">
              <span className="relative z-10 flex items-center gap-2">
                Browse Marketplace
                <svg
                  className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
            </button>
          </Link>
        </div>
      </div>

      {/* Subtle animated elements */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-purple-400/30 rounded-full animate-pulse" />
      <div
        className="absolute bottom-20 right-10 w-3 h-3 bg-pink-400/20 rounded-full animate-pulse"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute top-1/2 left-20 w-1 h-1 bg-purple-300/40 rounded-full animate-pulse"
        style={{ animationDelay: "2s" }}
      />
    </section>
  );
}
