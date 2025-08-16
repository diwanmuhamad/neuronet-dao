import React from 'react';
import StarRating from './StarRating';

interface Comment {
  id: number;
  itemId: number;
  author: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  rating: number;
}

interface CommentItemProps {
  comment: Comment;
  itemTitle: string;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, itemTitle }) => {
  const formatDate = (timestamp: number | bigint) => {
    const timestampNumber = typeof timestamp === 'bigint' ? Number(timestamp) : timestamp;
    const date = new Date(timestampNumber / 1000000); // Convert from nanoseconds
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-gray-700 rounded-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <StarRating rating={comment.rating} totalRatings={1} size="sm" />
          <span className="text-gray-400 text-sm">•</span>
          <span className="text-gray-400 text-sm">
            @{comment.author.substring(0, 8)}... - {formatDate(comment.createdAt)}
          </span>
        </div>
        <div className="flex items-center gap-1 text-green-400 text-xs">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Verified Purchase
        </div>
      </div>
      <p className="text-white text-sm leading-relaxed mb-2">{comment.content}</p>
      <div className="text-gray-400 text-xs">Review for: {itemTitle}</div>
    </div>
  );
};

export default CommentItem;
