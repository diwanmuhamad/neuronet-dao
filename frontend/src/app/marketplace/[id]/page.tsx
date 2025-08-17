"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAnonymousWallet } from "../../../hooks/useAnonymousWallet";
import { getActor } from "../../../ic/agent";
import Link from "next/link";
import Navbar from "../../../components/common/Navbar";
import PlatformBadge from "../../../components/common/PlatformBadge";
import ItemImageGrid from "../../../components/items/ItemImageGrid";
import ItemStats from "../../../components/items/ItemStats";
import BuyButton from "../../../components/common/BuyButton";
import CommentsSection from "../../../components/comments/CommentsSection";
import CreatorProfile from "../../../components/marketplace/CreatorProfile";
import PromptContent from "../../../components/items/PromptContent";
import { useAuth } from "@/contexts/AuthContext";

interface Comment {
  id: number;
  itemId: number;
  author: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  rating: number;
}

interface ItemBase {
  id: number;
  owner: string;
  title: string;
  description: string;
  price: number;
  itemType: string;
  category: string; // Added category field
  metadata: string;
  comments: Comment[];
  averageRating: number;
  totalRatings: number;
  createdAt: number;
  updatedAt: number;
}

interface Item extends ItemBase {
  content: string;
}

type ItemDetail = ItemBase;

interface License {
  id: number;
  itemId: bigint;
  buyer: string;
  createdAt: number;
  updatedAt: number;
  expiration?: number | null;
}

const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1686191128892-34af9b70e99c?w=400&h=300&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1692607136002-3895c1f212e7?w=400&h=300&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1633174524827-db00a6b7bc74?w=400&h=300&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=300&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1675425825598-85b0b74b1c33?w=400&h=300&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1684406624648-9d7de8a90b74?w=400&h=300&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1696005021055-6e19c00b4c7b?w=400&h=300&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1690468228251-41c9c5c82f3d?w=400&h=300&fit=crop&crop=center",
];

export default function ItemDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const itemId = parseInt(params.id as string);

  const {
    identity,
    balance,
    refreshBalance,
  } = useAnonymousWallet();
  const { principal, loading } = useAuth();

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
  }, [itemId, loading]);

  useEffect(() => {
    if (principal) {
      fetchUserLicenses();
    }
  }, [principal, itemId]);

  useEffect(() => {
    if (itemDetail?.owner) {
      fetchComments();
    }
  }, [itemDetail]);

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
        `Insufficient balance. You have ${balance} ICP, item costs ${priceInICP} ICP.`,
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
            <ItemImageGrid images={PLACEHOLDER_IMAGES} />
          </div>

          {/* Right Side - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Platform Badge */}
            <div className="flex items-start justify-between">
              <PlatformBadge category={itemDetail.category} />
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-white leading-tight">
              {itemDetail.title}
            </h1>

            {/* Stats */}
            <ItemStats />

            {/* Description */}
            <div className="space-y-3">
              <p className="text-gray-300 leading-relaxed">
                {itemDetail.description}
              </p>
              <button className="text-purple-400 hover:text-purple-300 text-sm">
                ...more
              </button>
            </div>

            {/* Price and Buy Button */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl font-bold text-white">
                  ${((Number(itemDetail.price) / 100_000_000) * 10).toFixed(2)}</span>
              </div>

              <BuyButton
                hasLicense={hasLicense}
                isOwner={isOwner}
                onBuy={handleBuy}
                onFavorite={handleFavorite}
                isFavorited={isFavorited}
              />

              <p className="text-xs text-gray-400 leading-relaxed">
                After downloading, you will gain access to the prompt file. By downloading
                this prompt, you agree to our terms of service.
              </p>

              <div className="text-xs text-gray-500">Added 21 hours ago</div>
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
            <div className="lg:col-span-1">
              <CreatorProfile
                owner={itemDetail.owner}
                averageRating={itemDetail.averageRating}
                commentsCount={comments.length}
              />
            </div>
          </div>
        </div>

        {/* Prompt Content (Only for License Holders) */}
        {hasLicense && fullItem && (
          <PromptContent content={fullItem.content} />
        )}
      </div>
    </div>
  );
}
