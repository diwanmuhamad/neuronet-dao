"use client";
import React, { useState, useEffect, useCallback } from "react";
import { getActor } from "../../../src/ic/agent";
import { useAuth } from "../../../src/contexts/AuthContext";
import { AnonymousIdentity } from "@dfinity/agent";

interface ItemStatsProps {
  itemId: number;
}

interface Stats {
  downloads: number;
  favorites: number;
  views: number;
}

const ItemStats: React.FC<ItemStatsProps> = ({ itemId }) => {
  const [stats, setStats] = useState<Stats>({
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
      const downloads = Number((licenses as any[]).length);

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
  }, [itemId, identity]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Refresh stats every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchStats();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchStats]);

  if (loading) {
    return (
      <div className="d-flex align-items-center gap-4 mb-4">
        <div className="d-flex align-items-center gap-2">
          <div className="spinner-border spinner-border-sm text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <span className="tertiary-text">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex align-items-center gap-4 mb-4">
        <span className="tertiary-text">Error loading stats</span>
      </div>
    );
  }

  return (
    <div className="d-flex align-items-center gap-4 mb-4" style={{ fontSize: '0.9rem' }}>
      <div className="d-flex align-items-center gap-2">
        <i className="bi bi-download" style={{ fontSize: '1rem', color: '#a0a0a0' }}></i>
        <span className="tertiary-text">{stats.downloads.toLocaleString()} downloads</span>
      </div>
      <div className="d-flex align-items-center gap-2">
        <i className="bi bi-heart" style={{ fontSize: '1rem', color: '#a0a0a0' }}></i>
        <span className="tertiary-text">{stats.favorites.toLocaleString()} favorites</span>
      </div>
      <div className="d-flex align-items-center gap-2">
        <i className="bi bi-eye" style={{ fontSize: '1rem', color: '#a0a0a0' }}></i>
        <span className="tertiary-text">{stats.views.toLocaleString()} views</span>
      </div>
    </div>
  );
};

export default ItemStats;
