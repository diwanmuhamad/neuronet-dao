import React from 'react';

interface BuyButtonProps {
  hasLicense: boolean;
  isOwner: boolean;
  onBuy: () => void;
  onFavorite: () => void;
  isFavorited: boolean;
}

const BuyButton: React.FC<BuyButtonProps> = ({
  hasLicense,
  isOwner,
  onBuy,
  onFavorite,
  isFavorited,
}) => {
  if (hasLicense) {
    return (
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-900/50 text-green-300 rounded-lg font-semibold mb-4 border border-green-700">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          You own this item
        </div>
      </div>
    );
  }

  if (isOwner) {
    return (
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900/50 text-blue-300 rounded-lg font-semibold mb-4 border border-blue-700">
          <svg
            className="w-5 h-5"
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
          Your item
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <button
        onClick={onBuy}
        className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
      >
        Get prompt
      </button>
      <button 
        onClick={onFavorite}
        className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-lg transition-colors"
      >
        <svg
          className={`w-5 h-5 ${
            isFavorited ? "text-red-500 fill-current" : "text-gray-400"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>
    </div>
  );
};

export default BuyButton;
