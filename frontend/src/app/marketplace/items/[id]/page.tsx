"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getActor } from "../../../../ic/agent";
import Link from "next/link";
import Navbar from "../../../../components/common/Navbar";
import PlatformBadge from "../../../../components/common/PlatformBadge";
import ItemTypeBadge from "../../../../components/common/ItemTypeBadge";
import ItemImageGrid from "../../../../components/items/ItemImageGrid";
import ItemStats from "../../../../components/items/ItemStats";
import BuyButton from "../../../../components/common/BuyButton";
import CommentsSection from "../../../../components/comments/CommentsSection";
import CreatorProfile from "../../../../components/marketplace/CreatorProfile";
import PromptContent from "../../../../components/items/PromptContent";
import ExpandableDescription from "../../../../components/items/ExpandableDescription";
import VerificationStatus from "../../../../components/items/VerificationStatus";
import { useAuth } from "@/contexts/AuthContext";
import { formatTimeAgo } from "../../../../utils/dateUtils";
import { Item, ItemDetail } from "@/components/items/interfaces";
import { Comment } from "@/components/comments/interfaces";

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

  const { identity, principal, loading, balance, refreshBalance } = useAuth();

  const [itemDetail, setItemDetail] = useState<ItemDetail | null>(null);
  const [fullItem, setFullItem] = useState<Item | null>(null);
  const [fetching, setFetching] = useState(false);
  const [message, setMessage] = useState("");
  const [hasLicense, setHasLicense] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (loading) return;
    fetchItemDetail();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId, loading]);

  useEffect(() => {
    if (loading) return;
    fetchUserLicenses();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId, loading]);

  useEffect(() => {
    if (loading) return;
    fetchComments();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId, loading]);

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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId]);

  const fetchItemDetail = async () => {
    setFetching(true);
    try {
      const actor = await getActor(identity || undefined);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result: any = await actor.get_item_detail(itemId);
      const item = result?.length > 0 ? result[0] : null;
      if (item !== null && item !== undefined) {
        if (item?.owner) {
          item.owner = item.owner.toText();
        }
        if (item?.comments) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          item.comments = item.comments.map((comment: any) => ({
            ...comment,
            author: comment.author.toText(),
          }));
        }
        setIsOwner(item?.owner === principal);
        setItemDetail(item as ItemDetail);
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
        (license: License) => license.itemId === BigInt(itemId),
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    if (!principal) {
      setMessage("Connect your wallet first before buying items");
      return;
    }

    if (!itemDetail) {
      setMessage("Item details not loaded.");
      return;
    }

    // Check if user is trying to buy their own item
    if (itemDetail.owner === principal) {
      setMessage("You cannot buy your own item.");
      return;
    }

    const priceInICP = Number(itemDetail.price) / 100_000_000;
    if (balance < priceInICP) {
      setMessage(
        `Insufficient balance. You have ${balance.toFixed(2)} ICP, item costs ${priceInICP.toFixed(2)} ICP.`,
      );
      return;
    }

    try {
      const actor = await getActor(identity || undefined);
      const result = await actor.buy_item(itemId);
      if (result !== null && result !== undefined) {
        await refreshBalance();
        setMessage("Item purchased successfully!");
        await fetchUserLicenses();
      } else {
        setMessage("Failed to purchase item.");
      }
    } catch (e) {
      console.error("Failed to purchase item:", e);
      setMessage("Failed to purchase item.");
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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Loading item details...</p>
        </div>
      </div>
    );
  }

  if (!itemDetail) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Item Not Found</h2>
          <p className="text-gray-400 mb-6">
            The requested item could not be found.
          </p>
          <Link
            href="/marketplace"
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
          >
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg text-center border ${
              message.includes("successfully")
                ? "bg-green-900/50 text-green-300 border-green-700"
                : message.includes("cannot buy your own")
                  ? "bg-red-900/50 text-red-300 border-red-700"
                  : "bg-blue-900/50 text-blue-300 border-blue-700"
            }`}
          >
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Side - Image Grid */}
          <div className="lg:col-span-3">
            <ItemImageGrid 
              images={
                itemDetail.thumbnailImages && itemDetail.thumbnailImages.length > 0
                  ? itemDetail.thumbnailImages
                  : [DEFAULT_IMAGE]
              } 
            />
          </div>

          {/* Right Side - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Platform Badge and Item Type Badge */}
            <div className="flex items-start justify-between">
              <div className="flex gap-2">
                <PlatformBadge category={itemDetail.category} />
                <ItemTypeBadge itemType={itemDetail.itemType} />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-white leading-tight">
              {itemDetail.title}
            </h1>

            {/* Stats */}
            {itemDetail && <ItemStats itemId={itemDetail.id} />}

            {/* Description */}
            <div className="space-y-3">
              <ExpandableDescription description={itemDetail.description} />
            </div>

            {/* Price and Buy Button */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl font-bold text-white">
                  {(Number(itemDetail.price) / 100_000_000).toFixed(2)} ICP
                </span>
              </div>

              <BuyButton
                hasLicense={hasLicense}
                isOwner={isOwner}
                onBuy={handleBuy}
                onFavorite={handleFavorite}
                isFavorited={isFavorited}
              />

              <p className="text-xs text-gray-400 leading-relaxed">
                After downloading, you will gain access to the prompt file. By
                downloading this prompt, you agree to our terms of service.
              </p>

              <div className="text-xs text-gray-500">
                Added {formatTimeAgo(itemDetail.createdAt)}
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side - Comments */}
            <div className="lg:col-span-2">
              <CommentsSection
                comments={comments}
                itemTitle={itemDetail.title}
                averageRating={itemDetail.averageRating}
                principal={principal || undefined}
                isOwner={isOwner}
                onSubmitComment={handleAddComment}
                isSubmittingComment={submittingComment}
              />
            </div>

            {/* Right Side - Profile Section */}
            <div className="lg:col-span-1 space-y-6">
              <CreatorProfile
                owner={itemDetail.owner}
                averageRating={itemDetail.averageRating}
                commentsCount={comments.length}
              />

              {/* Verification Status */}
              <VerificationStatus itemId={itemDetail.id} />
            </div>
          </div>
        </div>

        {/* Prompt Content (Only for License Holders) */}
        {hasLicense && fullItem && <PromptContent content={fullItem.content} />}
      </div>
    </div>
  );
}
