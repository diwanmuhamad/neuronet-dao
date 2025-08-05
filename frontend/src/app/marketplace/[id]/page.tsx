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

const StarRating = ({ rating, totalRatings }: { rating: number; totalRatings: number }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(
        <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    } else if (i === fullStars && hasHalfStar) {
      stars.push(
        <div key={i} className="relative">
          <svg className="w-5 h-5 text-gray-300 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <svg className="w-5 h-5 text-yellow-400 fill-current absolute top-0 left-0" viewBox="0 0 20 20" style={{ clipPath: 'inset(0 50% 0 0)' }}>
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
      );
    } else {
      stars.push(
        <svg key={i} className="w-5 h-5 text-gray-300 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex">{stars}</div>
      <span className="text-sm text-gray-600 ml-2">
        {rating.toFixed(1)} ({totalRatings} {totalRatings === 1 ? 'review' : 'reviews'})
      </span>
    </div>
  );
};

const CommentForm = ({ 
  itemId, 
  onCommentAdded, 
  identity 
}: { 
  itemId: number; 
  onCommentAdded: () => void; 
  identity: Identity | null; 
}) => {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);
    try {
      const actor = await getActor(identity || undefined);
      const result = await actor.add_comment(itemId, comment.trim(), rating);
      if (result !== null && result !== undefined) {
        setMessage("Comment added successfully!");
        setComment("");
        setRating(5);
        onCommentAdded();
      } else {
        setMessage("Failed to add comment. Make sure you own this item.");
      }
    } catch (e) {
      console.error("Failed to add comment:", e);
      setMessage("Failed to add comment.");
    }
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/30 mb-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Add Your Review</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="focus:outline-none"
            >
              <svg 
                className={`w-6 h-6 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'} fill-current hover:text-yellow-400 transition-colors`}
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          rows={4}
          placeholder="Share your experience with this prompt..."
          required
        />
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${
          message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting || !comment.trim()}
        className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full font-semibold shadow hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "Adding..." : "Add Review"}
      </button>
    </form>
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

  // Hardcoded image URL as specified in requirements
  const placeholderImage = "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop&crop=center";

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
          console.log("Converted owner to Principal:", item.owner);
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
      
      // Check if user has license for this item
      const hasItemLicense = (licenses as License[]).some(
        (license: License) => license.itemId === BigInt(itemId)
      );
      setHasLicense(hasItemLicense);

      // If user has license, fetch full item data including content
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

    // Check if user has enough balance
    const priceInICP = Number(itemDetail.price) / 100_000_000;
    if (balance < priceInICP) {
      setMessage(
        `Insufficient balance. You have ${balance} ICP, item costs ${priceInICP} ICP.`
      );
      return;
    }

    try {
      const actor = await getActor(identity || undefined);
      const result = await actor.buy_item(itemId);
      if (result !== null && result !== undefined) {
        await refreshBalance();
        setMessage("Item purchased successfully!");
        // Refresh licenses and item data
        await fetchUserLicenses();
      } else {
        setMessage("Failed to purchase item.");
      }
    } catch (e) {
      console.error("Failed to purchase item:", e);
      setMessage("Failed to purchase item.");
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-blue-100 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading item details...</p>
        </div>
      </div>
    );
  }

  if (!itemDetail) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-blue-100 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Item Not Found</h2>
          <p className="text-gray-600 mb-6">The requested item could not be found.</p>
          <Link
            href="/marketplace"
            className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full font-semibold shadow hover:scale-105 transition-all duration-200"
          >
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-blue-100 to-pink-100">
      {/* Modern Navbar */}
      <nav className="w-full flex items-center justify-between px-8 py-4 bg-white/60 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-20 shadow-lg rounded-b-2xl mb-10">
        <Link href="/">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-extrabold text-indigo-700 tracking-tight drop-shadow">
              NeuroNet
            </span>
            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full ml-2 font-semibold">
              DAO
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/marketplace"
            className="px-6 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-full font-semibold shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-200"
          >
            Back to Marketplace
          </Link>
          <Link
            href="/my-licenses"
            className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full font-semibold shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-200"
          >
            My Licenses
          </Link>
          {loading ? (
            <span className="text-gray-500 text-sm">Connecting...</span>
          ) : principal ? (
            <div className="flex flex-col items-end">
              <span className="text-green-600 font-mono text-xs mb-1">
                {principal}
              </span>
              <span className="text-blue-600 font-semibold text-xs mb-1">
                Balance: {balance} ICP
              </span>
              <button
                onClick={disconnect}
                className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-pink-400 to-indigo-400 text-white font-semibold shadow hover:scale-105 transition-all duration-200"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={connect}
              className="px-6 py-2 bg-gradient-to-r from-pink-500 via-indigo-500 to-blue-500 text-white rounded-full font-semibold shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-200"
            >
              Connect
            </button>
          )}
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 pb-12">
        {message && (
          <div className={`mb-6 p-4 rounded-lg text-center ${
            message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
          }`}>
            {message}
          </div>
        )}

        {/* Main Item Details */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/30 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Section */}
            <div className="space-y-4">
              <Image
                src={placeholderImage}
                alt={itemDetail.title}
                width={400}
                height={320}
                className="w-full h-64 lg:h-80 object-cover rounded-xl shadow-lg"
              />
              <div className="flex items-center justify-between">
                <StarRating rating={itemDetail.averageRating} totalRatings={itemDetail.totalRatings} />
                <span className="text-xs px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full font-semibold">
                  {itemDetail.itemType}
                </span>
              </div>
            </div>

            {/* Details Section */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
                  {itemDetail.title}
                </h1>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {itemDetail.description}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">Price:</span>
                  <span className="text-3xl font-bold text-indigo-600">
                    {Number(itemDetail.price) / 100_000_000} ICP
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">Metadata:</span>
                  <span className="text-sm text-gray-600">{itemDetail.metadata}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">Owner:</span>
                  <span className="text-xs font-mono text-gray-500">
                    {itemDetail.owner.substring(0, 8)}...
                  </span>
                </div>
              </div>

              {/* Buy Button or Ownership Status */}
              <div className="pt-4 border-t border-gray-100">
                {hasLicense ? (
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold mb-4">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      You own this item
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleBuy}
                    className="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-pink-400 text-white rounded-full font-semibold shadow-lg hover:scale-105 transition-all duration-200 text-lg"
                  >
                    Buy for {Number(itemDetail.price) / 100_000_000} ICP
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Prompt Content (Only for License Holders) */}
        {hasLicense && fullItem && (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/30 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Prompt Content</h2>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <pre className="text-gray-800 whitespace-pre-wrap text-sm leading-relaxed">
                {fullItem.content}
              </pre>
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Reviews & Comments</h2>
          
          {/* Comment Form (Only for License Holders) */}
          {hasLicense && principal && (
            <CommentForm 
              itemId={itemId} 
              onCommentAdded={fetchItemDetail} 
              identity={identity} 
            />
          )}

          {/* Comments List */}
          {itemDetail.comments.length > 0 ? (
            <div className="space-y-4">
              {itemDetail.comments.map((comment) => (
                <div key={comment.id} className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/30">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {comment.author.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800 text-sm">
                          {comment.author.substring(0, 8)}...
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-4 h-4 ${
                                star <= comment.rating ? 'text-yellow-400' : 'text-gray-300'
                              } fill-current`}
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(Number(comment.timestamp) / 1000000).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/30">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Reviews Yet</h3>
              <p className="text-gray-600">
                {hasLicense 
                  ? "Be the first to review this item!" 
                  : "Purchase this item to see and add reviews."
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}