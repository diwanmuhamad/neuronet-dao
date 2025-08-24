"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getActor } from "../../ic/agent";
import Navbar from "../../components/common/Navbar";
import ExpandableDescription from "../../components/items/ExpandableDescription";
import { formatDate } from "../../utils/dateUtils";
import { AnonymousIdentity } from "@dfinity/agent";
import useDebounce from "../../hooks/useDebounce";
import { Item } from "@/components/items/interfaces";
import { User } from "@/components/users/interfaces";
import Image from "next/image";
import StarRating from "@/components/common/StarRating";

export default function ProfilePage() {
  const { principal, isAuthenticated, identity } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [userItems, setUserItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    rate: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [updating, setUpdating] = useState(false);

  // Debounce the search query to prevent excessive API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    if (debouncedSearchQuery) {
      fetchUserItems(debouncedSearchQuery);
    } else {
      // If search is empty, fetch all items
      fetchUserItems();
    }
  }, [debouncedSearchQuery]);

  useEffect(() => {
    if (isAuthenticated && principal) {
      fetchUserProfile();
      fetchUserItems();
    }
  }, [isAuthenticated, principal]);

  const fetchUserProfile = async () => {
    try {
      const actor = await getActor(identity || new AnonymousIdentity());
      const result = await actor.get_my_profile();
      if (result && Array.isArray(result) && result.length > 0 && result[0]) {
        const userData = result[0];
        setUser({
          principal: userData.principal.toText(),
          balance: Number(userData.balance),
          firstName: userData.firstName?.[0] || undefined,
          lastName: userData.lastName?.[0] || undefined,
          bio: userData.bio?.[0] || undefined,
          rate: userData.rate?.[0] ? Number(userData.rate[0]) : undefined,
          createdAt: Number(userData.createdAt),
          updatedAt: Number(userData.updatedAt),
        });

        // Set form data for editing
        setFormData({
          firstName: userData.firstName?.[0] || "",
          lastName: userData.lastName?.[0] || "",
          bio: userData.bio?.[0] || "",
          rate: userData.rate?.[0]
            ? (Number(userData.rate[0]) / 100).toString()
            : "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserItems = async (searchQuery?: string) => {
    try {
      const actor = await getActor(identity || new AnonymousIdentity());
      const items = await actor.get_items_by_owner();

      let processedItems = (items as Item[]).map((item: any) => ({
        ...item,
        owner: item.owner.toText(),
      }));

      // Apply search filter if searchQuery is provided
      if (searchQuery && searchQuery.trim()) {
        processedItems = processedItems.filter((item: any) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase().trim())
        );
      }
      console.log("Fetched user items:", processedItems);
      setUserItems(processedItems);
    } catch (error) {
      console.error("Failed to fetch user items:", error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setUpdating(true);
      const actor = await getActor(identity || new AnonymousIdentity());
      const rateInCents = formData.rate
        ? Math.round(parseFloat(formData.rate) * 100)
        : undefined;

      const result = await actor.update_user_profile(
        formData.firstName?.trim() ? [formData.firstName.trim()] : [],
        formData.lastName?.trim() ? [formData.lastName.trim()] : [],
        formData.bio?.trim() ? [formData.bio.trim()] : [],
        rateInCents ? [BigInt(rateInCents)] : []
      );

      if (result) {
        setEditing(false);
        await fetchUserProfile();
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setUpdating(false);
    }
  };

  const getItemImage = (item: Item) => {
    if (item.thumbnailImages && item.thumbnailImages.length > 0) {
      return item.thumbnailImages[0]; // Use the first thumbnail image
    }
    return "/placeholder_default.svg";
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-400">
            Please connect your wallet to view your profile.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Profile Section */}
        <div className="bg-gray-800 rounded-xl overflow-hidden mb-8">
          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-red-500 via-white to-gray-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-red-400 to-white opacity-90"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-200 opacity-30"></div>
          </div>

          {/* Profile Info */}
          <div className="p-6 -mt-16 relative z-10 bg-gray-800 rounded-b-xl">
            <div className="flex items-end gap-4 mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-400 via-orange-500 to-purple-500 rounded-full flex items-center justify-center border-4 border-gray-800 shadow-lg">
                <span className="text-white font-bold text-xl">
                  {user?.firstName
                    ? user.firstName[0].toUpperCase()
                    : principal?.substring(0, 1).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg">
                  @
                  {user?.firstName
                    ? `${user.firstName}${
                        user.lastName ? ` ${user.lastName}` : ""
                      }`
                    : principal?.substring(0, 8)}
                  ...
                </h3>
                <div className="flex items-center gap-4 mt-2">
                  {/* <div className="flex text-yellow-400 text-sm">★★★★★</div>
                  <span className="text-gray-400 text-sm">(176)</span>
                  <span className="text-gray-400 text-sm">0 Following • 102 Followers</span> */}
                </div>
              </div>
              {/* <div className="flex gap-2">
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                  </svg>
                  Hire
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Message
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Follow +
                </button>
              </div> */}
            </div>

            {/* Bio Section */}
            <div className="mb-6">
              {editing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        disabled={updating}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstName: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-purple-500 focus:outline-none"
                        placeholder="Enter first name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        disabled={updating}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-purple-500 focus:outline-none"
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={formData.bio}
                      disabled={updating}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                      rows={4}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-purple-500 focus:outline-none"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Hourly Rate ($)
                    </label>
                    <input
                      type="number"
                      value={formData.rate}
                      disabled={updating}
                      onChange={(e) =>
                        setFormData({ ...formData, rate: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-purple-500 focus:outline-none"
                      placeholder="Enter hourly rate"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveProfile}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Save Profile
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-white font-semibold">Bio</h4>
                    <button
                      onClick={() => setEditing(true)}
                      className="text-purple-400 hover:text-purple-300 text-sm font-medium"
                    >
                      Edit Profile
                    </button>
                  </div>
                  {user?.bio ? (
                    <ExpandableDescription description={user.bio} />
                  ) : (
                    <p className="text-gray-400 text-sm">
                      No bio available. Click &quot;Edit Profile&quot; to add
                      one.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Stats */}
            {/* <div className="grid grid-cols-6 gap-4 mb-6">
              <div className="text-center">
                <div className="text-white font-bold">52.7k</div>
                <div className="text-gray-400 text-xs">Views</div>
              </div>
              <div className="text-center">
                <div className="text-white font-bold">6.9k</div>
                <div className="text-gray-400 text-xs">Favorites</div>
              </div>
              <div className="text-center">
                <div className="text-white font-bold">320</div>
                <div className="text-gray-400 text-xs">Comments</div>
              </div>
              <div className="text-center">
                <div className="text-white font-bold">122</div>
                <div className="text-gray-400 text-xs">Downloads</div>
              </div>
              <div className="text-center">
                <div className="text-white font-bold">1.2k</div>
                <div className="text-gray-400 text-xs">Sales</div>
              </div>
              <div className="text-center">
                <div className="text-white font-bold">351</div>
                <div className="text-gray-400 text-xs">Rank</div>
              </div>
            </div> */}

            {/* Platform Info */}
            <div className="space-y-2 text-sm text-gray-400">
              <div>
                Joined:{" "}
                {user?.createdAt
                  ? formatDate(user.createdAt)
                  : "Information unavailable"}
              </div>
              <div>
                @
                {user?.firstName
                  ? `${user.firstName}${
                      user.lastName ? ` ${user.lastName}` : ""
                    }`
                  : principal?.substring(0, 8)}
                ... charges $
                {user?.rate
                  ? (user.rate / 100).toFixed(0)
                  : "Information unavailable"}
                /hr for custom work
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search @${
                user?.firstName
                  ? `${user.firstName}${
                      user.lastName ? ` ${user.lastName}` : ""
                    }`
                  : principal?.substring(0, 8)
              }'s items`}
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none pr-12"
            />
            <svg
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
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
        </div>

        {/* Daily Update Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <svg
              className="w-6 h-6 text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-5 5v-5zM4 19h6v-2H4v2zM4 15h6v-2H4v2zM4 11h6V9H4v2zM4 7h6V5H4v2zM10 7h10V5H10v2zM10 11h10V9H10v2zM10 15h10v-2H10v2zM10 19h10v-2H10v2z"
              />
            </svg>
            My Items ({userItems.length})
          </h2>

          {userItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {userItems.map((item) => {
                const imageUrl = getItemImage(item);
                return (
                  <div
                    key={item.id}
                    className="bg-gray-800 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer"
                    onClick={() =>
                      (window.location.href = `/marketplace/items/${item.id}`)
                    }
                  >
                    <div className="relative">
                      <Image
                        src={imageUrl}
                        alt={item.title}
                        width={400}
                        height={200}
                        className="w-full object-cover h-48"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-white text-sm mb-2 line-clamp-2">
                        {item.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-white font-bold">
                          {(Number(item.price) / 100_000_000).toFixed(2)} ICP
                        </span>
                        {item.averageRating > 0 && (
                          <StarRating
                            rating={item.averageRating}
                            totalRatings={item.totalRatings}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-4">No items yet</div>
              <p className="text-gray-500">
                Start creating your first item to build your portfolio!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
