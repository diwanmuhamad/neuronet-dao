"use client";
import { useEffect, useState } from "react";
import ProductImageSlider from "./ProductImageSlider";
import ProductInfo from "./ProductInfo";
import ProductTabs from "./ProductTabs";
import { ItemDetail } from "../../../src/components/Items/interfaces";
import { Comment } from "../../../src/components/comments/interfaces";
import { formatTimeAgo } from "@/src/utils/dateUtils";
import VerificationStatus from "./VerificationStatus";
import { getCartItems, onCartChange } from "@/src/utils/cart";

interface ProductDetailsNewProps {
  itemDetail: ItemDetail;
  comments: Comment[];
  isOwner: boolean;
  hasLicense: boolean;
  isFavorited: boolean;
  principal?: string;
  onBuy: () => void;
  onFavorite: () => void;
  onSubmitComment: (content: string, rating: number) => void;
  isSubmittingComment: boolean;
  forceInCart?: boolean;
}

const ProductDetailsNew = ({
  itemDetail,
  comments,
  isOwner,
  hasLicense,
  isFavorited,
  principal,
  onBuy,
  onFavorite,
  onSubmitComment,
  isSubmittingComment,
  forceInCart,
}: ProductDetailsNewProps) => {
  const priceInICP = Number(itemDetail.price) / 100_000_000;
  
  const formattedDate = formatTimeAgo(itemDetail.createdAt);
  const [isInCart, setIsInCart] = useState(!!forceInCart);
  useEffect(() => {
    const check = () => {
      if (forceInCart) {
        setIsInCart(true);
        return;
      }
      const items = getCartItems();
      setIsInCart(items.some((i: any) => i.id === itemDetail.id));
    };
    check();
    const off = onCartChange(() => check());
    return () => off();
  }, [itemDetail.id, forceInCart]);

  return (
    <section className="section pb-0 p-details">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="product-info">
              <div className="row align-items-start gaper">
                {/* Product Images */}
                <div className="col-12 col-lg-6">
                  <div className="product-image-container">
                    <ProductImageSlider
                      images={itemDetail.thumbnailImages || []}
                      title={itemDetail.title}
                    />
                  </div>
                </div>

                {/* Product Information */}
                <div className="col-12 col-lg-6">
                  <div className="product-content-container ps-lg-4">
                    <ProductInfo
                      title={itemDetail.title}
                      price={priceInICP}
                      category={itemDetail.category}
                      itemType={itemDetail.itemType}
                      description={itemDetail.description}
                      averageRating={itemDetail.averageRating}
                      commentsCount={comments.length}
                      createdAt={formattedDate}
                      isOwner={isOwner}
                      hasLicense={hasLicense}
                      itemId={itemDetail.id}
                      onBuy={onBuy}
                      onFavorite={onFavorite}
                      isFavorited={isFavorited}
                      isInCart={isInCart}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="row">
          <div className="col-12">
            <ProductTabs
              description={itemDetail.description}
              comments={comments}
              owner={itemDetail.owner}
              averageRating={itemDetail.averageRating}
              commentsCount={comments.length}
              principal={principal}
              isOwner={isOwner}
              onSubmitComment={onSubmitComment}
              isSubmittingComment={isSubmittingComment}
              itemId={itemDetail.id} // Pass itemId for Verify tab
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailsNew;
