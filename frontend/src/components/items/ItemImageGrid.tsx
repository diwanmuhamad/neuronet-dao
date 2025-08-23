"use client";
import React, { useState, useEffect, useCallback } from "react";
import SecureImage from "../common/SecureImage";

interface ItemImageGridProps {
  images: string[];
}

const ItemImageGrid: React.FC<ItemImageGridProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>(
    {},
  );
  const [isPlaying, setIsPlaying] = useState(true);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  // Filter out errored images
  const validImages = images.filter((_, index) => !imageErrors[index]);
  const totalImages = validImages.length;

  const handleImageError = (originalIndex: number) => {
    setImageErrors((prev) => ({ ...prev, [originalIndex]: true }));
  };

  const nextImage = useCallback(() => {
    setDirection("next");
    setCurrentIndex((prev) => (prev + 1) % totalImages);
  }, [totalImages]);

  const prevImage = useCallback(() => {
    setDirection("prev");
    setCurrentIndex((prev) => (prev - 1 + totalImages) % totalImages);
  }, [totalImages]);

  const goToImage = (index: number) => {
    setDirection(index > currentIndex ? "next" : "prev");
    setCurrentIndex(index);
  };

  // Auto-scroll functionality
  useEffect(() => {
    if (!isPlaying || totalImages <= 1) return;

    const interval = setInterval(nextImage, 4000);
    return () => clearInterval(interval);
  }, [isPlaying, nextImage, totalImages]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if the user is typing in an input field
      const target = e.target as HTMLElement;
      const isInputField =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.contentEditable === "true";

      if (e.key === "ArrowLeft" && !isInputField) prevImage();
      if (e.key === "ArrowRight" && !isInputField) nextImage();
      if (e.key === " " && !isInputField) {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextImage, prevImage]);

  if (totalImages === 0) {
    return (
      <div className="relative w-full h-96 bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-2xl flex items-center justify-center overflow-hidden">
        <div className="text-gray-400 text-center">
          <div className="w-24 h-24 mx-auto mb-4 opacity-50">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <p className="text-lg">No images available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-2xl overflow-hidden group shadow-2xl">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,119,198,0.2),transparent_50%)]"></div>
      </div>

      {/* Main Image Container */}
      <div className="relative w-full h-full">
        {validImages.map((image, index) => {
          const originalIndex = images.indexOf(image);
          const isActive = index === currentIndex;
          const isPrev =
            index === (currentIndex - 1 + totalImages) % totalImages;
          const isNext = index === (currentIndex + 1) % totalImages;

          return (
            <div
              key={originalIndex}
              className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${
                isActive
                  ? "opacity-100 scale-100 translate-x-0 z-20"
                  : isPrev
                    ? `opacity-0 scale-95 z-10 ${
                        direction === "next"
                          ? "-translate-x-full"
                          : "translate-x-full"
                      }`
                    : isNext
                      ? `opacity-0 scale-95 z-10 ${
                          direction === "next"
                            ? "translate-x-full"
                            : "-translate-x-full"
                        }`
                      : "opacity-0 scale-90 translate-y-4 z-0"
              }`}
            >
              <SecureImage
                src={image}
                alt={`Preview ${index + 1}`}
                width={800}
                height={600}
                className="w-full h-full object-cover"
                onError={() => handleImageError(originalIndex)}
              />

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20"></div>

              {/* Image Counter */}
              {isActive && (
                <div className="absolute top-4 right-4 z-30">
                  <div className="bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                    {index + 1} / {totalImages}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      {totalImages > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
          >
            <svg
              className="w-6 h-6"
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
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {totalImages > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
          {validImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-white scale-125 shadow-lg shadow-white/50"
                  : "bg-white/50 hover:bg-white/75 hover:scale-110"
              }`}
            />
          ))}
        </div>
      )}

      {/* Play/Pause Button */}
      {totalImages > 1 && (
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="absolute top-4 left-4 z-30 w-10 h-10 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
        >
          {isPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg
              className="w-5 h-5 ml-0.5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7L8 5z" />
            </svg>
          )}
        </button>
      )}

      {/* Progress Bar */}
      {isPlaying && totalImages > 1 && (
        <div className="absolute bottom-0 left-0 right-0 z-30">
          <div className="w-full h-1 bg-black/30">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-100 ease-linear"
              style={{
                width: `${((Date.now() % 4000) / 4000) * 100}%`,
                animation: isPlaying ? "progress 4s linear infinite" : "none",
              }}
            />
          </div>
        </div>
      )}

      {/* Floating Particles Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationName: "float",
              animationDuration: `${3 + Math.random() * 4}s`,
              animationTimingFunction: "ease-in-out",
              animationIterationCount: "infinite",
              animationDelay: `${i * 0.8}s`,
            }}
          />
        ))}
        {[...Array(4)].map((_, i) => (
          <div
            key={`glow-${i}`}
            className="absolute w-3 h-3 bg-blue-400/30 rounded-full blur-sm"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationName: "pulse",
              animationDuration: `${2 + Math.random() * 3}s`,
              animationTimingFunction: "ease-in-out",
              animationIterationCount: "infinite",
              animationDelay: `${i * 1.2}s`,
            }}
          />
        ))}
      </div>

      {/* Ambient Light Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 right-1/4 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl"
          style={{
            animationName: "pulse",
            animationDuration: "2s",
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
            animationDelay: "1s",
          }}
        ></div>
        <div
          className="absolute top-1/2 left-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"
          style={{
            animationName: "pulse",
            animationDuration: "2s",
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
            animationDelay: "2s",
          }}
        ></div>
      </div>

      <style jsx>{`
        @keyframes progress {
          0% {
            width: 0%;
            background: linear-gradient(90deg, #8b5cf6, #ec4899);
          }
          50% {
            background: linear-gradient(90deg, #ec4899, #06b6d4);
          }
          100% {
            width: 100%;
            background: linear-gradient(90deg, #06b6d4, #8b5cf6);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) translateX(0px) rotate(0deg) scale(1);
            opacity: 0;
          }
          25% {
            transform: translateY(-15px) translateX(5px) rotate(90deg)
              scale(1.2);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-30px) translateX(-5px) rotate(180deg)
              scale(0.8);
            opacity: 1;
          }
          75% {
            transform: translateY(-20px) translateX(8px) rotate(270deg)
              scale(1.1);
            opacity: 0.6;
          }
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
};

export default ItemImageGrid;
