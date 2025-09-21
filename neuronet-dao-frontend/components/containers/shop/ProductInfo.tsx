"use client";
import { useState } from "react";
import Link from "next/link";
import ItemStats from "./ItemStats";
import styles from "./ProductInfo.module.css";

interface ProductInfoProps {
  title: string;
  price: number; // Price in ICP
  category: string;
  itemType: string;
  description: string;
  averageRating: number;
  commentsCount: number;
  createdAt: string;
  isOwner: boolean;
  hasLicense: boolean;
  itemId: number;
  onBuy: () => void;
  onFavorite: () => void;
  isFavorited: boolean;
  isInCart?: boolean;
}

const ProductInfo = ({
  title,
  price,
  category,
  itemType,
  description,
  averageRating,
  commentsCount,
  createdAt,
  isOwner,
  hasLicense,
  itemId,
  onBuy,
  onFavorite,
  isFavorited,
  isInCart,
}: ProductInfoProps) => {
  const [isBuying, setIsBuying] = useState(false);
  // Render star rating
  const renderStars = (rating: number | bigint) => {
    const stars = [];
    const numericRating = Number(rating);
    const fullStars = Math.floor(numericRating);
    const hasHalfStar = numericRating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <i key={i} className="bi bi-star-fill"></i>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <i key="half" className="bi bi-star-half"></i>
      );
    }

    const emptyStars = 5 - Math.ceil(numericRating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <i key={`empty-${i}`} className="bi bi-star"></i>
      );
    }

    return stars;
  };

  const handleBuy = async () => {
    setIsBuying(true);
    try {
      await onBuy();
    } finally {
      setIsBuying(false);
    }
  };

  return (
    <div className="product__content">
      {/* Title - Made more prominent */}
      <h1 className="text-white mb-4" style={{ 
        fontSize: '2.5rem', 
        fontWeight: '700', 
        lineHeight: '1.2',
        marginBottom: '1.5rem'
      }}>
        {title}
      </h1>

      {/* Item Stats - Downloads, Favorites, Views */}
      <ItemStats itemId={itemId} />

      {/* Price and Rating */}
      <div className="product-meta mb-4">
        <div className="product-price">
          <div className="product-m-price d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <p className="primary-text mb-0">
                <span className="current-price" style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '600',
                  color: '#28a745'
                }}>
                  {price.toFixed(2)} ICP
                </span>
              </p>
            </div>
            <div className="product-review d-flex align-items-center">
              {renderStars(averageRating)}
              <span className="ms-2 tertiary-text" style={{ fontSize: '0.9rem' }}>
                ({commentsCount})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="paragraph mb-4">
        <p className="tertiary-text" style={{ 
          fontSize: '1rem', 
          lineHeight: '1.6',
          color: '#a0a0a0'
        }}>
          {description}
        </p>
      </div>

      {/* Tags */}
      <div className="tags mb-4">
        <p className="text-white mb-2" style={{ 
          fontSize: '0.9rem', 
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          Tag
        </p>
        <div className="tags-wrapper d-flex flex-wrap gap-2">
          <Link href={`/marketplace?category=${category}`} className={styles.tagLink}>{category}</Link>
          <Link href={`/marketplace?type=${itemType}`} className={styles.tagLink}>{itemType}</Link>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="product-cta d-flex align-items-center gap-3 mb-4">
        {isOwner ? (
          // Owner indicator with app's styling
          <div className="owner-indicator">
            <i className="material-symbols-outlined">
              person
            </i>
            <span>
              Your Item
            </span>
          </div>
        ) : (
          <button 
            className="btn btn--primary"
            onClick={onBuy}
            disabled={hasLicense || isInCart}
            style={{ 
              backgroundColor: '#28a745', 
              border: 'none', 
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              padding: '12px 32px',
              minWidth: '200px',
              height: '48px'
            }}
          >
            {hasLicense ? "Already Purchased" : isInCart ? "Added to Cart" : "Get Items"}
          </button>
        )}
        <button 
          onClick={onFavorite}
          className="btn btn-outline-light"
          style={{ 
            borderRadius: '8px',
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#28a745',
            border: 'none'
          }}
        >
          <span className={`material-symbols-outlined ${isFavorited ? 'text-danger' : 'text-white'}`}>
            {isFavorited ? 'favorite' : 'favorite_border'}
          </span>
        </button>
      </div>

      {/* Additional Info */}
      <div className="mt-3">
        {/* <p className="text-gray-400 leading-relaxed mb-2" style={{ 
          fontSize: '0.85rem',
          lineHeight: '1.5',
          color: '#888'
        }}>
          After downloading, you will gain access to the prompt file. By
          downloading this prompt, you agree to our terms of service.
        </p> */}
        <div className="text-gray-500" style={{ 
          fontSize: '0.8rem',
          color: '#666'
        }}>
          Added {createdAt}
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
