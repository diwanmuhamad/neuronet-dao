"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useAnonymousWallet } from "../../hooks/useAnonymousWallet";
import { getActor } from "../../ic/agent";
import ListNewModal from "./ListNewModal";
import Link from "next/link";
import Image from "next/image";

interface MarketplaceItem {
  id: number;
  owner: string;
  title: string;
  description: string;
  price: bigint;
  itemType: string;
  metadata: string;
  comments: Comment[];
  averageRating: number;
  totalRatings: number;
  timestamp?: number;
}

interface Comment {
  id: number;
  itemId: number;
  author: string;
  content: string;
  timestamp: number;
  rating: number;
}

const ITEMS_PER_PAGE = 9;
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop&crop=center";

const StarRating = ({ rating, totalRatings }: { rating: number; totalRatings: number }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(
        <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    } else if (i === fullStars && hasHalfStar) {
      stars.push(
        <div key={i} className="relative">
          <svg className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <svg className="w-4 h-4 text-yellow-400 fill-current absolute top-0 left-0" viewBox="0 0 20 20" style={{ clipPath: 'inset(0 50% 0 0)' }}>
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
      );
    } else {
      stars.push(
        <svg key={i} className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex">{stars}</div>
      <span className="text-xs text-gray-600 ml-1">
        {rating > 0 ? rating.toFixed(1) : '0.0'} ({totalRatings})
      </span>
    </div>
  );
};

const ProfileDropdown = ({ 
  principal, 
  balance, 
  disconnect, 
  onListNew, 
  loading 
}: {
  principal: string | null;
  balance: number;
  disconnect: () => void;
  onListNew: () => void;
  loading: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (loading) {
    return <span className="text-gray-500 text-sm">Connecting...</span>;
  }

  if (!principal) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full font-semibold shadow-lg hover:scale-105 transition-all duration-200"
      >
        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <span className="hidden sm:inline">Profile</span>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 z-50">
          <div className="p-4 border-b border-gray-100">
            <div className="text-sm font-semibold text-gray-700 mb-1">Wallet Address</div>
            <div className="text-xs font-mono text-gray-500 break-all">{principal}</div>
            <div className="text-sm font-semibold text-blue-600 mt-2">
              Balance: {balance} ICP
            </div>
          </div>
          
          <div className="p-2">
            <button
              onClick={() => {
                onListNew();
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              List New Item
            </button>
            
            <Link
              href="/my-licenses"
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-2"
              onClick={() => setIsOpen(false)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              My Licenses
            </Link>
            
            <button
              onClick={() => {
                disconnect();
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const ItemCard = ({ item }: { item: MarketplaceItem }) => {
  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 border border-white/30 group">
      <div className="relative mb-4 overflow-hidden rounded-xl">
        <Image
          src={PLACEHOLDER_IMAGE}
          alt={item.title}
          width={400}
          height={240}
          className="w-full h-48 object-cover transition-transform duration-200 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3">
          <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-semibold">
            {item.itemType}
          </span>
        </div>
      </div>
      
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-gray-800 line-clamp-2">
          {item.title}
        </h3>
        
        <p className="text-gray-600 text-sm line-clamp-3">
          {item.description}
        </p>
        
        <StarRating rating={item.averageRating} totalRatings={item.totalRatings} />
        
        <div className="flex justify-between items-center pt-2">
          <span className="text-2xl font-bold text-indigo-600">
            {Number(item.price) / 100_000_000} ICP
          </span>
          <Link
            href={`/marketplace/${item.id}`}
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-pink-400 text-white rounded-full font-semibold shadow hover:scale-105 transition-all duration-200"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

const SearchBar = ({ 
  searchTerm, 
  onSearchChange 
}: { 
  searchTerm: string; 
  onSearchChange: (term: string) => void; 
}) => {
  return (
    <div className="relative max-w-md mx-auto mb-8">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        placeholder="Search items by name..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-lg border border-white/40 rounded-full outline-none focus:ring-2 focus:ring-indigo-300 transition-all text-gray-800 placeholder-gray-500 shadow-lg"
      />
    </div>
  );
};

const StatisticsSection = ({ 
  items, 
  title, 
  emptyMessage 
}: { 
  items: MarketplaceItem[]; 
  title: string; 
  emptyMessage: string; 
}) => {
  if (items.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-pink-400 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">{title}</h3>
        </div>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  const getIcon = (title: string) => {
    if (title.includes('Newest')) {
      return (
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    } else if (title.includes('Commented')) {
      return (
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      );
    } else {
      return (
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      );
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/30 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-pink-400 rounded-lg flex items-center justify-center">
          {getIcon(title)}
        </div>
        <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">{title}</h3>
      </div>
      
      <div className="space-y-4">
        {items.slice(0, 3).map((item, index) => (
          <Link key={item.id} href={`/marketplace/${item.id}`}>
            <div className="group bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl p-4 hover:from-indigo-50 hover:to-pink-50 transition-all duration-200 cursor-pointer border border-gray-100 hover:border-indigo-200 hover:shadow-md">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-pink-100 rounded-lg flex items-center justify-center text-lg font-bold text-indigo-600 group-hover:from-indigo-200 group-hover:to-pink-200 transition-all duration-200">
                    #{index + 1}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-semibold text-gray-800 group-hover:text-indigo-700 transition-colors line-clamp-1 text-sm">
                      {item.title}
                    </h4>
                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-medium whitespace-nowrap">
                      {item.itemType}
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <StarRating rating={item.averageRating} totalRatings={item.totalRatings} />
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-indigo-600">
                        {Number(item.price) / 100_000_000} ICP
                      </span>
                      <svg className="w-3 h-3 text-gray-400 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <Link href="/marketplace" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1 group">
          View all items
          <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default function MarketplacePage() {
  const {
    principal,
    connect,
    disconnect,
    loading,
    identity,
    balance,
  } = useAnonymousWallet();
  
  const [allItems, setAllItems] = useState<MarketplaceItem[]>([]);
  const [displayedItems, setDisplayedItems] = useState<MarketplaceItem[]>([]);
  const [fetching, setFetching] = useState(false);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreItems, setHasMoreItems] = useState(true);

  const fetchItems = useCallback(async () => {
    setFetching(true);
    try {
      const actor = await getActor(identity || undefined);
      console.log("Testing canister connection...");
      const items = await actor.get_items() as MarketplaceItem[];
      console.log("Successfully fetched items:", items);
      
      // Add timestamp for sorting (using id as proxy for creation order)
      const itemsWithTimestamp = items.map(item => ({
        ...item,
        timestamp: item.id
      }));
      
      setAllItems(itemsWithTimestamp);
      setDisplayedItems(itemsWithTimestamp.slice(0, ITEMS_PER_PAGE));
      setCurrentPage(1);
      setHasMoreItems(itemsWithTimestamp.length > ITEMS_PER_PAGE);
    } catch (e) {
      console.error("Failed to fetch items:", e);
      setMessage("Failed to fetch items.");
    }
    setFetching(false);
  }, [identity]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Filter items based on search term
  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return allItems;
    return allItems.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allItems, searchTerm]);

  // Update displayed items when search changes
  useEffect(() => {
    const itemsToShow = filteredItems.slice(0, currentPage * ITEMS_PER_PAGE);
    setDisplayedItems(itemsToShow);
    setHasMoreItems(itemsToShow.length < filteredItems.length);
  }, [filteredItems, currentPage]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 1000 &&
        hasMoreItems &&
        !fetching
      ) {
        setCurrentPage(prev => prev + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMoreItems, fetching]);

  // Statistics calculations
  const newestItems = useMemo(() => {
    return [...allItems]
      .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
      .slice(0, 3);
  }, [allItems]);

  const mostCommentedItems = useMemo(() => {
    return [...allItems]
      .sort((a, b) => b.comments.length - a.comments.length)
      .slice(0, 3);
  }, [allItems]);

  const topRatedItems = useMemo(() => {
    return [...allItems]
      .filter(item => item.totalRatings > 0)
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, 3);
  }, [allItems]);

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
          {principal ? (
            <ProfileDropdown
              principal={principal}
              balance={balance}
              disconnect={disconnect}
              onListNew={() => setShowModal(true)}
              loading={loading}
            />
          ) : (
            <button
              onClick={connect}
              className="px-6 py-2 bg-gradient-to-r from-pink-500 via-indigo-500 to-blue-500 text-white rounded-full font-semibold shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-200"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 pb-12">
        <h1 className="text-2xl text-center sm:text-3xl font-extrabold bg-gradient-to-r from-indigo-600 via-blue-500 to-pink-400 bg-clip-text text-transparent drop-shadow mb-10">
          Marketplace
        </h1>

        {message && (
          <div className="mb-4 p-4 bg-blue-100 text-blue-700 rounded-lg text-center">
            {message}
          </div>
        )}

        {/* Search Bar */}
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        {/* Statistics Sections */}
        {!searchTerm && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            <StatisticsSection
              items={newestItems}
              title="Newest Items"
              emptyMessage="No new items available."
            />
            <StatisticsSection
              items={mostCommentedItems}
              title="Most Commented"
              emptyMessage="No commented items yet."
            />
            <StatisticsSection
              items={topRatedItems}
              title="Top Rated"
              emptyMessage="No rated items yet."
            />
          </div>
        )}

        {/* Main Items Grid */}
        {fetching && displayedItems.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading items...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            {searchTerm ? `No items found matching "${searchTerm}".` : "No items available."}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
            
            {/* Loading indicator for infinite scroll */}
            {hasMoreItems && (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-gray-600 text-sm">Loading more items...</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* List New Modal - Only show if user is authenticated */}
      {principal && (
        <ListNewModal
          open={showModal}
          onClose={() => setShowModal(false)}
          onListed={fetchItems}
          principal={principal}
          identity={identity}
        />
      )}
    </div>
  );
}