import React from 'react';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';
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

interface CommentsSectionProps {
  comments: Comment[];
  itemTitle: string;
  averageRating: number;
  principal?: string;
  isOwner: boolean;
  onSubmitComment: (content: string, rating: number) => void;
  isSubmittingComment: boolean;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({
  comments,
  itemTitle,
  averageRating,
  principal,
  isOwner,
  onSubmitComment,
  isSubmittingComment,
}) => {
  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">
          {comments.length} creator reviews {averageRating?.toFixed(1) || "5.0"}
        </h2>
        <button className="text-purple-400 hover:text-purple-300 text-sm">
          Reviews for this creator ({comments.length})
        </button>
      </div>

      {/* Add Comment Form (Only for authenticated users) */}
      {principal && (
        <CommentForm 
          onSubmit={onSubmitComment}
          isSubmitting={isSubmittingComment}
        />
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            No reviews yet. Be the first to review this item!
          </p>
        ) : (
          comments.map((comment) => (
            <CommentItem 
              key={comment.id} 
              comment={comment} 
              itemTitle={itemTitle}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentsSection;
