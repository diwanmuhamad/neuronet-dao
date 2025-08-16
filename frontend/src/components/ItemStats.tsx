import React from 'react';

interface ItemStatsProps {
  downloads?: number;
  favorites?: number;
  views?: number;
}

const ItemStats: React.FC<ItemStatsProps> = ({ 
  downloads = 31, 
  favorites = 4, 
  views = 103 
}) => {
  return (
    <div className="flex items-center gap-6 text-sm text-gray-300">
      <div className="flex items-center gap-1">
        <svg
          className="w-4 h-4"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
        <span>{downloads}</span>
        <span className="text-gray-400">Downloads</span>
      </div>
      <div className="flex items-center gap-1">
        <svg
          className="w-4 h-4"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
            clipRule="evenodd"
          />
        </svg>
        <span>{favorites}</span>
        <span className="text-gray-400">Favorites</span>
      </div>
      <div className="flex items-center gap-1">
        <svg
          className="w-4 h-4"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
          <path
            fillRule="evenodd"
            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
            clipRule="evenodd"
          />
        </svg>
        <span>{views}</span>
        <span className="text-gray-400">Views</span>
      </div>
    </div>
  );
};

export default ItemStats;
