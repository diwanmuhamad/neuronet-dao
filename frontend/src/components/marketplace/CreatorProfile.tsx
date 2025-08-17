import React from 'react';
import StarRating from '../common/StarRating';

interface CreatorProfileProps {
  owner: string;
  averageRating: number;
  commentsCount: number;
}

const CreatorProfile: React.FC<CreatorProfileProps> = ({
  owner,
  averageRating,
  commentsCount,
}) => {
  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden">
      {/* Banner */}
      <div className="h-32 bg-gradient-to-r from-red-500 via-white to-gray-300 relative overflow-hidden z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-red-400 to-white opacity-90"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-200 opacity-30"></div>
      </div>

      {/* Profile Info */}
      <div className="p-6 -mt-16 relative z-10 bg-gray-800 rounded-b-xl">
        <div className="flex items-end gap-4 mb-4">
          <div className="w-20 h-20 bg-gradient-to-r from-orange-400 via-orange-500 to-purple-500 rounded-full flex items-center justify-center border-4 border-gray-800 shadow-lg">
            <span className="text-white font-bold text-xl">
              {owner.substring(0, 1).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold text-lg">@{owner.substring(0, 8)}...</h3>
            <div className="flex items-center gap-2 mt-1">
              <StarRating rating={averageRating || 5.0} totalRatings={commentsCount} size="sm" />
              <span className="text-gray-400 text-sm">({commentsCount})</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mb-4">
          <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
            Hire
          </button>
          <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Message
          </button>
          <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Follow +
          </button>
        </div>

        {/* Bio */}
        <p className="text-gray-300 text-sm mb-4">
          Looking for a custom bundle or a specific theme? Just message me - I'm happy to help! Thanks for visiting my store and follow me now! ❤️ ...more
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-white font-bold">7.1k</div>
            <div className="text-gray-400 text-xs">Views</div>
          </div>
          <div className="text-center">
            <div className="text-white font-bold">1.4k</div>
            <div className="text-gray-400 text-xs">Likes</div>
          </div>
          <div className="text-center">
            <div className="text-white font-bold">65</div>
            <div className="text-gray-400 text-xs">Downloads</div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-white font-bold">345</div>
            <div className="text-gray-400 text-xs">Uses</div>
          </div>
          <div className="text-center">
            <div className="text-white font-bold">135</div>
            <div className="text-gray-400 text-xs">Saves</div>
          </div>
          <div className="text-center">
            <div className="text-white font-bold">6</div>
            <div className="text-gray-400 text-xs">Visitors</div>
          </div>
        </div>

        {/* Rating and Followers */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <StarRating rating={averageRating || 5.0} totalRatings={commentsCount} size="sm" />
            <span className="text-gray-400 text-sm">({commentsCount})</span>
          </div>
          <div className="text-gray-400 text-sm">11 Following • 27 Followers</div>
        </div>

        {/* Platform Info */}
        <div className="space-y-2 text-sm text-gray-400">
          <div>PromptBase Rank: #171</div>
          <div>Joined: October 2023</div>
          <div>@{owner.substring(0, 8)}... charges $35/hr for custom work</div>
        </div>
      </div>
    </div>
  );
};

export default CreatorProfile;
