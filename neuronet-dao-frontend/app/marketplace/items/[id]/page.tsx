"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getActor, getLedgerActor } from "../../../../src/ic/agent";
import Link from "next/link";
import Header from "../../../../components/layout/header/Header";
import CommonBanner from "../../../../components/layout/banner/CommonBanner";
import ProductDetailsNew from "../../../../components/containers/shop/ProductDetailsNew";
import { addItemToCart, getCartItems } from "@/src/utils/cart";
import FooterTwo from "../../../../components/layout/footer/FooterTwo";
import InitCustomCursor from "../../../../components/layout/InitCustomCursor";
import ScrollProgressButton from "../../../../components/layout/ScrollProgressButton";
import Animations from "../../../../components/layout/Animations";
import { useAuth } from "../../../../src/contexts/AuthContext";
import { Item, ItemDetail } from "../../../../src/components/Items/interfaces";
import { Comment } from "../../../../src/components/comments/interfaces";
import ContentDisplay from "../../../../components/containers/shop/ContentDisplay";

interface License {
  id: number;
  itemId: bigint;
  buyer: string;
  createdAt: number;
  updatedAt: number;
  expiration?: number | null;
  licenseTerms: string;
  isActive: boolean;
}


const DEFAULT_IMAGE = "/placeholder_default.svg";

export default function ItemDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const itemId = parseInt(params.id as string);

  const { identity, principal, loading, icpBalance, refreshICPBalance } =
    useAuth();

  const [itemDetail, setItemDetail] = useState<ItemDetail | null>(null);
  const [, setFullItem] = useState<Item | null>(null);
  const [fetching, setFetching] = useState(false);
  const [message, setMessage] = useState("");
  const [hasLicense, setHasLicense] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [transferFee, setTransferFee] = useState<number>(0.0001); // Default fallback
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (loading) return;
    fetchItemDetail();
  }, [itemId, loading]);

  useEffect(() => {
    if (loading) return;
    fetchUserLicenses();
  }, [itemId, loading]);

  useEffect(() => {
    if (loading) return;
    fetchComments();
  }, [itemId, loading]);

  // Fetch transfer fee from backend
  const fetchTransferFee = async () => {
    try {
      const actor = await getActor(identity || undefined);
      const feeInE8s = (await actor.get_transfer_fee()) as bigint;
      const feeInICP = Number(feeInE8s) / 100_000_000;
      setTransferFee(feeInICP);
    } catch (error) {
      console.error("Failed to fetch transfer fee, using default:", error);
      // Keep default fallback
    }
  };

  useEffect(() => {
    if (!loading && identity) {
      fetchTransferFee();
    }
  }, [loading, identity]);

  // Track view when page loads
  useEffect(() => {
    const trackView = async () => {
      try {
        const actor = await getActor(identity || undefined);
        await actor.add_view(BigInt(itemId));
      } catch (error) {
        console.error("Error tracking view:", error);
      }
    };
    trackView();
  }, [itemId]);

  const fetchItemDetail = async () => {
    setFetching(true);
    try {
      const actor = await getActor(identity || undefined);

      const result: any = await actor.get_item_detail(itemId);
      const item = result?.length > 0 ? result[0] : null;
      if (item !== null && item !== undefined) {
        if (item?.owner) {
          item.owner = item.owner.toText();
        }
        if (item?.comments) {
          item.comments = item.comments.map((comment: any) => ({
            ...comment,
            author: comment.author.toText(),
          }));
        }
        console.log(item)
        setIsOwner(item?.owner === principal);
        setItemDetail(item as ItemDetail);
        // Also reflect cart state immediately on load
        try {
          const items = getCartItems();
          const inCart = items.some((i: any) => Number(i.id) === Number(itemId));
          setAddedToCart(inCart);
        } catch {}
      } else {
        setMessage("Item not found.");
        setTimeout(() => router.push("/marketplace"), 2000);
      }
    } catch (e) {
      console.error("Failed to fetch item details:", e);
      setMessage("Failed to fetch item details.");
    }
    setFetching(false);
  };

  const fetchUserLicenses = async () => {
    try {
      const actor = await getActor(identity || undefined);
      const licenses = await actor.get_my_licenses();

      const hasItemLicense = (licenses as License[]).some(
        (license: License) => license.itemId === BigInt(itemId)
      );
      setHasLicense(hasItemLicense);

      if (hasItemLicense) {
        const items = await actor.get_items();
        const item = (items as Item[]).find((i: Item) => i.id === itemId);
        if (item) {
          setFullItem(item);
        }
      }
    } catch (e) {
      console.error("Failed to fetch user licenses:", e);
    }
  };

  const fetchComments = async () => {
    try {
      const actor = await getActor(identity || undefined);
      const result = await actor.get_comments_by_item(itemId);

      const commentsWithAuthors = (result as Comment[]).map((comment: any) => ({
        ...comment,
        author: comment.author.toText(),
      }));
      setComments(commentsWithAuthors);
    } catch (e) {
      console.error("Failed to fetch comments:", e);
    }
  };

  const handleBuy = async () => {
    if (!itemDetail) {
      setMessage("Item details not loaded.");
      return;
    }
    const priceInICP = Number(itemDetail.price) / 100_000_000;
    const imageUrl = itemDetail.thumbnailImages?.[0] || DEFAULT_IMAGE;
    const result = addItemToCart({
      id: itemDetail.id,
      name: itemDetail.title,
      imageUrl,
      price: priceInICP,
    });
    if (result.ok) {
      setMessage("Added to cart.");
      setAddedToCart(true);
    } else {
      setMessage(result.reason || "Could not add to cart.");
    }
  };

  const handleAddComment = async (content: string, rating: number) => {
    if (!principal) {
      setMessage("Please connect your wallet to add a comment");
      return;
    }

    setSubmittingComment(true);
    try {
      const actor = await getActor(identity || undefined);
      const result = await actor.add_comment(itemId, content, rating);
      if (result !== null && result !== undefined) {
        setMessage("Comment added successfully!");
        await fetchComments();
      } else {
        setMessage("Failed to add comment.");
      }
    } catch (e) {
      console.error("Failed to add comment:", e);
      setMessage("Failed to add comment.");
    }
    setSubmittingComment(false);
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  if (fetching || loading) {
    return (
      <div className="my-app">
        <Header />
        <main>
          <CommonBanner title="Loading..." />
          <div className="section">
            <div className="container">
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading item details...</p>
              </div>
            </div>
          </div>
        </main>
        <FooterTwo />
        <InitCustomCursor />
        <ScrollProgressButton />
        {/* <Animations /> */}
      </div>
    );
  }

  if (!itemDetail) {
    return (
      <div className="my-app">
        <Header />
        <main>
          {/* <CommonBanner title="Item Not Found" /> */}
          <div className="section">
            <div className="container">
              <div className="text-center">
                <h2 className="title text-white mb-4">Item Not Found</h2>
                <p className="tertiary-text mb-6">
                  The requested item could not be found.
                </p>
                <Link href="/marketplace" className="btn btn--primary">
                  Back to Marketplace
                </Link>
              </div>
            </div>
          </div>
        </main>
        <FooterTwo />
        <InitCustomCursor />
        <ScrollProgressButton />
        {/* <Animations /> */}
      </div>
    );
  }

  return (
    <div className="my-app">
      <Header />
      <main>
        <CommonBanner title={'Item Details'} />
        
        {/* Success/Error Message */}
        {message && (
          <div style={{ width: "100%", display: "flex", justifyContent: "center", margin: "24px 0" }}>
            <div
              style={{
                background:
                  message.includes("successfully")
                    ? "#28a745"
                    : message.includes("cannot buy your own")
                    ? "#dc3545"
                    : "#1e2130",
                color: "#fff",
                borderRadius: "12px",
                padding: "18px 32px",
                minWidth: "280px",
                maxWidth: "480px",
                boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
                fontWeight: 500,
                fontSize: "1.08rem",
                textAlign: "center",
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
              role="alert"
            >
              <span style={{ flex: 1 }}>{message}</span>
              <button
                type="button"
                onClick={() => setMessage("")}
                aria-label="Close"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#fff",
                  fontSize: "1.3rem",
                  cursor: "pointer",
                  marginLeft: "8px",
                  lineHeight: 1,
                }}
              >
                &times;
              </button>
            </div>
          </div>
        )}

        {/* Product Details - Replaced old UI with new component system */}
        <ProductDetailsNew
          itemDetail={itemDetail}
          comments={comments}
          isOwner={isOwner}
          hasLicense={hasLicense}
          isFavorited={isFavorited}
          principal={principal || undefined}
          onBuy={handleBuy}
          onFavorite={handleFavorite}
          onSubmitComment={handleAddComment}
          isSubmittingComment={submittingComment}
          // Ensure immediate UI feedback after adding to cart
          // by passing a local flag that overrides detection if needed
          forceInCart={addedToCart}
        />

        {/* Content Access (Only for License Holders) */}
        {hasLicense && itemDetail && itemDetail.contentRetrievalUrl && (
          <div style={{ marginTop: '15px' }}>
            <div className="container">
              <div 
                style={{
                  background: '#120f23',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid #414141'
                }}
              >
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="text-white fw-6 mb-0">Content Access</h4>
                  <div className="d-flex align-items-center gap-3">
                    <span 
                      className="badge bg-primary text-dark px-3 py-2"
                      style={{ fontSize: '12px', fontWeight: '600' }}
                    >
                      {itemDetail.itemType?.toUpperCase() || 'CONTENT'}
                    </span>
                    <span 
                      className="text-quinary"
                      style={{ fontSize: '12px' }}
                    >
                      {itemDetail.contentFileName}
                    </span>
                  </div>
                </div>
                
                <div className="mb-3">
                  <p className="text-quinary mb-0">
                    <i className="bi bi-shield-check text-primary me-2"></i>
                    You have access to this item's content
                  </p>
                </div>
                
                <div 
                  style={{
                    backgroundColor: '#0a0815',
                    borderRadius: '12px',
                    padding: '16px 16px 16px 16px',
                    border: '1px solid #2a2a2a'
                  }}
                >
                  <ContentDisplay
                    contentRetrievalUrl={itemDetail.contentRetrievalUrl}
                    itemType={itemDetail.itemType || 'prompt'}
                    fileName={itemDetail.contentFileName || ''}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <FooterTwo />
      {/* <InitCustomCursor />
      <ScrollProgressButton /> */}
      {/* <Animations /> */}
    </div>
  );
}
