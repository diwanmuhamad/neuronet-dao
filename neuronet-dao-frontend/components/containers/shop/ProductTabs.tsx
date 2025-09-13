"use client";
import { useState } from "react";
import Image from "next/image";
import { Comment } from "../../../src/components/comments/interfaces";
import styles from "./ProductTabs.module.css";
import { formatDate } from "@/src/utils/dateUtils";

interface ProductTabsProps {
  description: string;
  comments: Comment[];
  owner: string;
  averageRating: number;
  commentsCount: number;
  principal?: string;
  isOwner: boolean;
  onSubmitComment: (content: string, rating: number) => void;
  isSubmittingComment: boolean;
}

const ProductTabs = ({
  description,
  comments,
  owner,
  averageRating,
  commentsCount,
  principal,
  isOwner,
  onSubmitComment,
  isSubmittingComment,
}: ProductTabsProps) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [commentContent, setCommentContent] = useState("");
  const [commentRating, setCommentRating] = useState(5);
  const [replyStates, setReplyStates] = useState<{ [key: string]: boolean }>({});

  const handleTabClick = (index: number) => {
    setActiveTabIndex(index);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentContent.trim()) {
      onSubmitComment(commentContent, commentRating);
      setCommentContent("");
      setCommentRating(5);
    }
  };

  const toggleReply = (commentId: string) => {
    setReplyStates(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  // Render star rating for comments
  const renderStars = (rating: number | bigint) => {
    const stars = [];
    const numericRating = Number(rating);
    const fullStars = Math.floor(numericRating);
    const hasHalfStar = numericRating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <i key={i} className="bi bi-star-fill text-warning"></i>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <i key="half" className="bi bi-star-half text-warning"></i>
      );
    }

    const emptyStars = 5 - Math.ceil(numericRating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <i key={`empty-${i}`} className="bi bi-star text-warning"></i>
      );
    }

    return stars;
  };

  return (
    <div className="p-details__tab">
      {/* Tab Navigation */}
      <div className="p-details__tab-btn">
        <button
          className={`p-d-t-btn ${
            activeTabIndex === 0 ? "p-d-t-btn-active" : ""
          }`}
          onClick={() => handleTabClick(0)}
        >
          Description
        </button>
        <button
          className={`p-d-t-btn ${
            activeTabIndex === 1 ? "p-d-t-btn-active" : ""
          }`}
          onClick={() => handleTabClick(1)}
        >
          Review ({commentsCount})
        </button>
        <button
          className={`p-d-t-btn ${
            activeTabIndex === 2 ? "p-d-t-btn-active" : ""
          }`}
          onClick={() => handleTabClick(2)}
        >
          Author
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-d-t-wrapper">
        {/* Description Tab */}
        <div
          className={`p-details__tab-single ${
            activeTabIndex === 0 ? "active-tab" : ""
          }`}
        >
          <div className="description-content">
            <p>{description}</p>
          </div>
        </div>

        {/* Review Tab */}
        <div
          className={`p-details__tab-single ${
            activeTabIndex === 1 ? "active-tab" : ""
          }`}
        >
          <div className="review-content">
            <div className="row">
              <div className="col-12 col-xl-9">
                {/* Comments List - Following ProductDetails style */}
                <div className="b-comment__wrapper">
                  {comments.map((comment) => (
                    <div key={comment.id} className="b-comment-single">
                      <div className="thumb">
                        <div 
                          className="rounded-circle d-flex align-items-center justify-content-center"
                          style={{ 
                            width: '60px', 
                            height: '60px', 
                            backgroundColor: 'var(--tertiary-color)',
                            fontSize: '1.2rem'
                          }}
                        >
                          <i className="bi bi-person text-primary"></i>
                        </div>
                      </div>
                      <div className="content">
                        <div className="intro">
                          <h4 className="text-white">{comment.author}</h4>
                          <span className="tertiary-text">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        <div className="mb-2">
                          {renderStars(comment.rating)}
                        </div>
                        <p>{comment.content}</p>
                        <div className="content-meta">
                          <button 
                            className="open-reply" 
                            onClick={() => toggleReply(comment.id.toString())}
                          >
                            Reply
                          </button>
                          <a href="/profile" className="d-flex align-items-center gap-1">
                            Share
                            <span className="material-symbols-outlined">send</span>
                          </a>
                        </div>
                        
                        {/* Reply Box - Following ProductDetails style */}
                        {replyStates[comment.id] && (
                          <div className="reply-box-wrapper">
                            <div className="reply-box">
                              <div 
                                className="rounded-circle d-flex align-items-center justify-content-center"
                                style={{ 
                                  width: '40px', 
                                  height: '40px', 
                                  backgroundColor: 'var(--tertiary-color)',
                                  fontSize: '1rem'
                                }}
                              >
                                <i className="bi bi-person text-primary"></i>
                              </div>
                              <input
                                type="text"
                                name="reply-me"
                                id={`reply-${comment.id}`}
                                placeholder="Join the discussion"
                                required
                              />
                              <button>
                                <span className="material-symbols-outlined">send</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Comment Form - Simple design with star rating */}
                {principal && !isOwner && (
                  <div className="w-comment">
                    <h3 className="fw-7 title-animation text-white">
                      Write a comment
                    </h3>
                    <form onSubmit={handleCommentSubmit}>
                      <div className="input-single">
                        <textarea
                          name="a-comment"
                          id="aComment"
                          cols={30}
                          rows={10}
                          placeholder="Write Your Comment"
                          value={commentContent}
                          onChange={(e) => setCommentContent(e.target.value)}
                          required
                        ></textarea>
                      </div>
                      <div className="input-single mb-3">
                        <label className="text-white mb-2">Rating:</label>
                        <div className="d-flex align-items-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              className="btn p-0 border-0 bg-transparent"
                              onClick={() => setCommentRating(star)}
                              style={{ fontSize: '1.5rem' }}
                            >
                              <i 
                                className={`bi ${
                                  star <= commentRating ? 'bi-star-fill' : 'bi-star'
                                } ${
                                  star <= commentRating ? 'text-warning' : 'text-quinary'
                                }`}
                              ></i>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="section__content-cta">
                        <button
                          type="submit"
                          className="btn btn--primary"
                          disabled={isSubmittingComment}
                        >
                          {isSubmittingComment ? "Submitting..." : "Submit Now"}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                
                {/* Not Logged In Message */}
                {!principal && (
                  <div className="mt-5">
                    <div className="bg-quaternary rounded-3 p-4 text-center">
                      <div className="mb-3">
                        <i className="bi bi-chat-dots text-primary" style={{ fontSize: '2rem' }}></i>
                      </div>
                      <h4 className="text-white fw-6 mb-3">Join the Discussion</h4>
                      <p className="text-quinary mb-4">
                        Please log in to leave a comment and share your thoughts about this item.
                      </p>
                      <a href="/sign-in" className="btn btn--primary">
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Sign In to Comment
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Author Tab */}
        <div
          className={`p-details__tab-single author-content ${
            activeTabIndex === 2 ? "active-tab" : ""
          }`}
        >
          <div className="thumb">
            <div className={`${styles.avatarPlaceholder} ${styles.large}`}>
              <i className="bi bi-person-circle"></i>
            </div>
          </div>
          <div className="content">
            <h4>@{owner.slice(0, 8)}...</h4>
            <p className="tertiary-text">Average Rating: {averageRating.toFixed(1)}/5</p>
            <p className="tertiary-text">Reviews: {commentsCount}</p>
            {/* Profile Navigation - Added link to profile page */}
            <div className="mt-3">
              <a 
                href="/profile" 
                className="btn btn--primary btn-sm"
                style={{ textDecoration: 'none' }}
              >
                <i className="bi bi-person"></i>
                View Profile
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductTabs;
