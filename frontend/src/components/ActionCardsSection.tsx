"use client";
import React from "react";

interface ActionCard {
  icon: string;
  title: string;
  description: string;
  gradient: string;
  onClick?: () => void;
}

interface ActionCardsSectionProps {
  cards: ActionCard[];
  backgroundColor?: string;
}

export default function ActionCardsSection({
  cards,
  backgroundColor = "transparent"
}: ActionCardsSectionProps) {
  const defaultCards: ActionCard[] = [
    {
      icon: "🎨",
      title: "Hire an AI Creator",
      description: "Discover world class AI experts",
      gradient: "bg-gradient-to-br from-purple-600 to-blue-600",
    },
    {
      icon: "🚀",
      title: "Build an AI App",
      description: "Create AI apps using prompts",
      gradient: "bg-gradient-to-br from-blue-600 to-cyan-600",
    },
    {
      icon: "👥",
      title: "Join a Community",
      description: "Chat with other AI creators",
      gradient: "bg-gradient-to-br from-pink-600 to-red-600",
    },
    {
      icon: "🔍",
      title: "Explore the Marketplace",
      description: "Browse quality prompts",
      gradient: "bg-gradient-to-br from-green-600 to-teal-600",
    },
  ];

  const cardsToRender = cards.length > 0 ? cards : defaultCards;

  return (
    <section className={`py-16 px-8 ${backgroundColor}`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {cardsToRender.map((card, index) => (
            <div
              key={index}
              className={`${card.gradient} rounded-2xl p-6 text-left hover:scale-105 transition-all duration-300 cursor-pointer`}
              onClick={card.onClick}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                  <span className="text-3xl">{card.icon}</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">
                    {card.title}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {card.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
