import React, { useState } from 'react';

interface CommentFormProps {
  onSubmit: (content: string, rating: number) => void;
  isSubmitting: boolean;
}

const CommentForm: React.FC<CommentFormProps> = ({ onSubmit, isSubmitting }) => {
  const [commentContent, setCommentContent] = useState("");
  const [commentRating, setCommentRating] = useState(5);

  const handleSubmit = () => {
    if (commentContent.trim()) {
      onSubmit(commentContent, commentRating);
      setCommentContent("");
      setCommentRating(5);
    }
  };

  return (
    <div className="bg-gray-700 rounded-lg p-4 mb-6">
      <h3 className="text-white font-medium mb-3">Add a Review</h3>
      <div className="space-y-3">
        <div>
          <label className="block text-gray-300 text-sm mb-1">Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setCommentRating(star)}
                className={`text-2xl ${
                  star <= commentRating ? "text-yellow-400" : "text-gray-600"
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-gray-300 text-sm mb-1">Comment</label>
          <textarea
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="Share your experience with this item..."
            className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={3}
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !commentContent.trim()}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          {isSubmitting ? "Adding..." : "Add Review"}
        </button>
      </div>
    </div>
  );
};

export default CommentForm;
