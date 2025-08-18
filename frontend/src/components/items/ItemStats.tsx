import React, { useState, useEffect, useCallback } from "react";
import { getActor } from "../../ic/agent";
import { useAuth } from "@/contexts/AuthContext";
import { AnonymousIdentity } from "@dfinity/agent";
import { License } from "../common/interfaces";

interface ItemStatsProps {
  itemId: number;
}

const ItemStats: React.FC<ItemStatsProps> = ({ itemId }) => {
  const [stats, setStats] = useState({
    downloads: 0,
    favorites: 0,
    views: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { identity } = useAuth();

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const actor = await getActor(identity || new AnonymousIdentity());
      // Fetch downloads (licenses count)
      const licenses = await actor.get_licenses_by_item(BigInt(itemId));
      const downloads = Number((licenses as License[]).length);

      // Fetch favorites count
      const favorites = await actor.get_favorite_count(BigInt(itemId));

      // Fetch views count
      const views = await actor.get_view_count(BigInt(itemId));

      const newStats = {
        downloads,
        favorites: Number(favorites),
        views: Number(views),
      };

      setStats(newStats);
    } catch (error) {
      console.error("ItemStats: Error fetching stats:", error);
      setError(error instanceof Error ? error.message : "Unknown error");
      // Set default values if fetch fails
      setStats({
        downloads: 0,
        favorites: 0,
        views: 0,
      });
    } finally {
      setLoading(false);
    }

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Refresh stats every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchStats();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchStats, itemId]);

  if (loading) {
    return (
      <div className="flex items-center gap-6 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-600 rounded animate-pulse"></div>
          <span>Loading...</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-600 rounded animate-pulse"></div>
          <span>Loading...</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-600 rounded animate-pulse"></div>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-6 text-sm text-red-400">
        <span>Error loading stats: {error}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-6 text-sm text-gray-400">
      <div className="flex items-center gap-2">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <span>{stats.downloads.toLocaleString()} downloads</span>
      </div>
      <div className="flex items-center gap-2">
        <svg
          className="w-4 h-4"
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
        <span>{stats.favorites.toLocaleString()} favorites</span>
      </div>
      <div className="flex items-center gap-2">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
        <span>{stats.views.toLocaleString()} views</span>
      </div>
    </div>
  );
};

export default ItemStats;
