"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAnonymousWallet } from "../../../hooks/useAnonymousWallet";
import { getActor } from "../../../ic/agent";
import Link from "next/link";
import Image from "next/image";
import { Identity } from "@dfinity/agent";

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
}: {
  rating: number;
  totalRatings: number;
}) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(
        <svg
          key={i}
          className="w-4 h-4 text-yellow-400 fill-current"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>,
      );
    } else if (i === fullStars && hasHalfStar) {
      stars.push(
        <div key={i} className="relative">
          <svg
            className="w-4 h-4 text-gray-600 fill-current"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <svg
            className="w-4 h-4 text-yellow-400 fill-current absolute top-0 left-0"
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
          className="w-4 h-4 text-gray-600 fill-current"
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
        {rating > 0 ? rating.toFixed(1) : "5.0"}
      </span>
    </div>
  );
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

  useEffect(() => {
    fetchItemDetail();
  }, [itemId]);

  useEffect(() => {
    if (principal) {
      fetchUserLicenses();
    }
  }, [principal, itemId]);

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

  const handleBuy = async () => {
    if (!principal) {
      setMessage("Connect your wallet first before buying items");
      return;
    }

    if (!itemDetail) {
      setMessage("Item details not loaded.");
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

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation */}
      <nav className="w-full flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-gray-800">
        <Link href="/">
          <Link href="/">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">NeuroNet</span>
              <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full font-semibold">
                DAO
              </span>
            </div>
          </Link>
        </Link>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1 bg-gray-800 rounded-lg px-3 py-1">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <span className="text-white text-sm">Categories</span>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search prompts"
              className="bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
            />
            <svg
              className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <div className="flex items-center gap-4 text-white text-sm">
            <span className="hover:text-gray-300 cursor-pointer">Hire</span>
            <span className="hover:text-gray-300 cursor-pointer">Create</span>
            <span className="hover:text-gray-300 cursor-pointer">Sell</span>
            {principal ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">
                  {principal.substring(0, 8)}...
                </span>
                <button
                  onClick={disconnect}
                  className="text-xs px-2 py-1 bg-red-600 hover:bg-red-700 rounded transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={connect}
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg text-center border ${
              message.includes("successfully")
                ? "bg-green-900/50 text-green-300 border-green-700"
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

            {/* User Info */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">
                  {itemDetail.owner.substring(0, 1).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="text-white font-medium">@zevnik1</div>
                <div className="flex items-center gap-2">
                  <StarRating
                    rating={itemDetail.averageRating || 5.0}
                    totalRatings={itemDetail.totalRatings}
                  />
                  <span className="text-gray-400 text-sm">1 review</span>
                </div>
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
