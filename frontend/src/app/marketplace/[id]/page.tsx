"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAnonymousWallet } from "../../../hooks/useAnonymousWallet";
import { getActor } from "../../../ic/agent";
import Link from "next/link";
import Image from "next/image";
import { Identity } from "@dfinity/agent";
import Navbar from "../../../components/Navbar";

interface Comment {
  id: number;
  itemId: number;
  author: string;
  content: string;
  timestamp: number;
  rating: number;
}

interface ItemBase {
  id: number;
  owner: string;
  title: string;
  description: string;
  price: number;
  itemType: string;
  metadata: string;
  comments: Comment[];
  averageRating: number;
  totalRatings: number;
}

interface Item extends ItemBase {
  content: string;
}

type ItemDetail = ItemBase;

interface License {
  id: number;
  itemId: bigint;
  buyer: string;
  timestamp: number;
  expiration?: number | null;
}

interface UserProfile {
  principal: string;
  balance: number;
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

const getPlatformBadge = (itemType: string) => {
  const badges = {
    "AI Image": { icon: "🖼️", label: "ChatGPT Image", color: "bg-green-600" },
    Text: { icon: "💬", label: "ChatGPT", color: "bg-green-600" },
    Video: { icon: "🎥", label: "Midjourney Video", color: "bg-purple-600" },
    Audio: { icon: "🎵", label: "Audio AI", color: "bg-blue-600" },
    Code: { icon: "💻", label: "Code AI", color: "bg-yellow-600" },
    Data: { icon: "📊", label: "Data AI", color: "bg-indigo-600" },
  };

  return (
    badges[itemType as keyof typeof badges] || {
      icon: "⚡",
      label: "AI Tool",
      color: "bg-gray-600",
    }
  );
};

const StarRating = ({
  rating,
  totalRatings,
  size = "md",
}: {
  rating: number | bigint;
  totalRatings: number | bigint;
  size?: "sm" | "md" | "lg";
}) => {
  const stars = [];
  const ratingNumber = typeof rating === 'bigint' ? Number(rating) : rating;
  const fullStars = Math.floor(ratingNumber);
  const hasHalfStar = ratingNumber % 1 !== 0;

  const starSize = size === "sm" ? "w-3 h-3" : size === "lg" ? "w-5 h-5" : "w-4 h-4";

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(
        <svg
          key={i}
          className={`${starSize} text-yellow-400 fill-current`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>,
      );
    } else if (i === fullStars && hasHalfStar) {
      stars.push(
        <div key={i} className="relative">
          <svg
            className={`${starSize} text-gray-600 fill-current`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <svg
            className={`${starSize} text-yellow-400 fill-current absolute top-0 left-0`}
            viewBox="0 0 20 20"
            style={{ clipPath: "inset(0 50% 0 0)" }}
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>,
      );
    } else {
      stars.push(
        <svg
          key={i}
          className={`${starSize} text-gray-600 fill-current`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>,
      );
    }
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex">{stars}</div>
      <span className="text-sm text-white ml-1 font-medium">
        {ratingNumber > 0 ? ratingNumber.toFixed(1) : "5.0"}
      </span>
    </div>
  );
};

const formatDate = (timestamp: number | bigint) => {
  const timestampNumber = typeof timestamp === 'bigint' ? Number(timestamp) : timestamp;
  const date = new Date(timestampNumber / 1000000); // Convert from nanoseconds
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

export default function ItemDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const itemId = parseInt(params.id as string);

  const {
    principal,
    connect,
    disconnect,
    loading,
    identity,
    balance,
    refreshBalance,
  } = useAnonymousWallet();

  const [itemDetail, setItemDetail] = useState<ItemDetail | null>(null);
  const [fullItem, setFullItem] = useState<Item | null>(null);
  const [fetching, setFetching] = useState(false);
  const [message, setMessage] = useState("");
  const [hasLicense, setHasLicense] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentContent, setCommentContent] = useState("");
  const [commentRating, setCommentRating] = useState(5);
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    fetchItemDetail();
  }, [itemId]);

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

  const handleAddComment = async () => {
    if (!principal) {
      setMessage("Please connect your wallet to add a comment");
      return;
    }

    if (!commentContent.trim()) {
      setMessage("Please enter a comment");
      return;
    }

    setSubmittingComment(true);
    try {
      const actor = await getActor(identity || undefined);
      const result = await actor.add_comment(itemId, commentContent, commentRating);
      if (result !== null && result !== undefined) {
        setCommentContent("");
        setCommentRating(5);
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

  if (fetching) {
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

  const badge = getPlatformBadge(itemDetail.itemType);
  const isOwner = principal === itemDetail.owner;

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
            <div className="grid grid-cols-3 gap-2 bg-gray-800 rounded-xl p-4">
              {PLACEHOLDER_IMAGES.slice(0, 9).map((image, index) => (
                <div
                  key={index}
                  className="aspect-square rounded-lg overflow-hidden"
                >
                  <Image
                    src={image}
                    alt={`Preview ${index + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Platform Badge */}
            <div className="flex items-start justify-between">
              <div
                className={`${badge.color} text-white px-3 py-1 rounded-lg font-medium flex items-center gap-2 text-sm`}
              >
                <span>{badge.icon}</span>
                <span>{badge.label}</span>
              </div>
              <button
                onClick={handleFavorite}
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
              >
                <svg
                  className={`w-5 h-5 ${
                    isFavorited ? "text-red-500 fill-current" : "text-gray-400"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-white leading-tight">
              {itemDetail.title}
            </h1>

            {/* Stats */}
            <div className="flex items-center gap-6 text-sm text-gray-300">
              <div className="flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>31</span>
                <span className="text-gray-400">Downloads</span>
              </div>
              <div className="flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>4</span>
                <span className="text-gray-400">Favorites</span>
              </div>
              <div className="flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>103</span>
                <span className="text-gray-400">Views</span>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
                  55 words
                </span>
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  GPT-4O
                </span>
                <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
                  Tested ✓
                </span>
                <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
                  Instructions ✓
                </span>
                <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
                  9 examples ✓
                </span>
                <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
                  HD images ✓
                </span>
                <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
                  No artists ✗
                </span>
              </div>
            </div>

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
                <span className="text-4xl font-bold text-white">Free</span>
                <span className="text-gray-400 text-sm">
                  What do I get when I download a prompt?
                </span>
              </div>

              {hasLicense ? (
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-900/50 text-green-300 rounded-lg font-semibold mb-4 border border-green-700">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    You own this item
                  </div>
                </div>
              ) : isOwner ? (
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900/50 text-blue-300 rounded-lg font-semibold mb-4 border border-blue-700">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Your item
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handleBuy}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    Get prompt
                  </button>
                  <button className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-lg transition-colors">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 3H3m4 10v6a1 1 0 001 1h10a1 1 0 001-1v-6m-9 6h8"
                      />
                    </svg>
                  </button>
                </div>
              )}

              <p className="text-xs text-gray-400 leading-relaxed">
                After downloading, you will gain access to the prompt file which
                you can use with ChatGPT Image or on PromptBase. By downloading
                this prompt, you agree to our terms of service.
              </p>

              <div className="text-xs text-gray-500">Added 21 hours ago</div>
            </div>

            {/* Related App */}
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="grid grid-cols-3 gap-1 w-12 h-12">
                  {PLACEHOLDER_IMAGES.slice(0, 3).map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded overflow-hidden"
                    >
                      <Image
                        src={image}
                        alt={`Related ${index + 1}`}
                        width={50}
                        height={50}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex-1">
                  <div className="text-white font-medium text-sm">
                    Adorable 3d Character In Costume Generator
                  </div>
                  <div className="text-gray-400 text-xs">Related app</div>
                </div>
                <div className="text-white text-sm">2 ►</div>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section - NEW FEATURE */}
        <div className="mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side - Comments */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">
                    {comments.length} creator reviews {itemDetail.averageRating?.toFixed(1) || "5.0"}
                  </h2>
                  <button className="text-purple-400 hover:text-purple-300 text-sm">
                    Reviews for this creator ({comments.length})
                  </button>
                </div>

                {/* Add Comment Form (Only for authenticated users) */}
                {principal && !isOwner && (
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
                        onClick={handleAddComment}
                        disabled={submittingComment || !commentContent.trim()}
                        className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        {submittingComment ? "Adding..." : "Add Review"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Comments List */}
                <div className="space-y-4">
                  {comments.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No reviews yet. Be the first to review this item!</p>
                  ) : (
                    comments.map((comment) => (
                      <div key={comment.id} className="bg-gray-700 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <StarRating rating={comment.rating} totalRatings={1} size="sm" />
                            <span className="text-gray-400 text-sm">•</span>
                            <span className="text-gray-400 text-sm">
                              @{comment.author.substring(0, 8)}... - {formatDate(comment.timestamp)}
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
                        <div className="text-gray-400 text-xs">Review for: {itemDetail.title}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right Side - Profile Section - NEW FEATURE */}
            <div className="lg:col-span-1">
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
                        {itemDetail.owner.substring(0, 1).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-bold text-lg">@{itemDetail.owner.substring(0, 8)}...</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <StarRating rating={itemDetail.averageRating || 5.0} totalRatings={comments.length} size="sm" />
                        <span className="text-gray-400 text-sm">({comments.length})</span>
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
                      <StarRating rating={itemDetail.averageRating || 5.0} totalRatings={comments.length} size="sm" />
                      <span className="text-gray-400 text-sm">({comments.length})</span>
                    </div>
                    <div className="text-gray-400 text-sm">11 Following • 27 Followers</div>
                  </div>

                  {/* Platform Info */}
                  <div className="space-y-2 text-sm text-gray-400">
                    <div>PromptBase Rank: #171</div>
                    <div>Joined: October 2023</div>
                    <div>@{itemDetail.owner.substring(0, 8)}... charges $35/hr for custom work</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Prompt Content (Only for License Holders) */}
        {hasLicense && fullItem && (
          <div className="mt-8 bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              Prompt Content
            </h2>
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <pre className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
                {fullItem.content}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
