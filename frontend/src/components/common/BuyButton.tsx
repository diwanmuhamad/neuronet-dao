import React, { useState } from "react";

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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBuyClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmBuy = async () => {
    setIsProcessing(true);
    try {
      await onBuy();
    } finally {
      setIsProcessing(false);
      setShowConfirmModal(false);
    }
  };

  const handleCancelBuy = () => {
    if (!isProcessing) {
      setShowConfirmModal(false);
    }
  };

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
    <>
      <div className="flex gap-3">
        <button
          onClick={handleBuyClick}
          className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
        >
          Get Item
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

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-white mb-4">
              Confirm Purchase
            </h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to proceed with this purchase?
            </p>

            {/* Fee breakdown */}
            <div className="bg-gray-800 rounded-lg p-4 mb-6">
              <h4 className="text-sm font-medium text-gray-300 mb-2">
                Fee Breakdown:
              </h4>
              <div className="space-y-1 text-xs text-gray-400">
                <div className="flex justify-between">
                  <span>Creator (95%)</span>
                  <span>To item creator</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform fee (5%)</span>
                  <span>To platform</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCancelBuy}
                disabled={isProcessing}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                  isProcessing
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-gray-700 hover:bg-gray-600 text-white"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBuy}
                disabled={isProcessing}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                  isProcessing
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white"
                }`}
              >
                {isProcessing ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Confirm Purchase"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BuyButton;
