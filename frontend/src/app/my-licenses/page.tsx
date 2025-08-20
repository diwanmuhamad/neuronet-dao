"use client";
import React, { useEffect, useState } from "react";
import { getActor } from "../../ic/agent";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../../components/common/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { Item } from "@/components/items/interfaces";
import { License } from "@/components/common/interfaces";

const ContentDisplay = ({
  contentRetrievalUrl,
  itemType,
  fileName,
}: {
  contentRetrievalUrl: string;
  itemType: string;
  fileName: string;
}) => {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await fetch(contentRetrievalUrl);

        if (!response.ok) {
          throw new Error("Failed to fetch content");
        }

        if (itemType === "ai_output") {
          // For AI outputs, the URL is already an image URL
          setContent(contentRetrievalUrl);
        } else {
          // Fallback for any other content types
          const textContent = await response.text();
          setContent(textContent);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load content");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [contentRetrievalUrl, itemType]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-red-400 text-center">Error loading content: {error}</p>
    );
  }

  if (itemType === "ai_output") {
    return (
      <div className="flex justify-center">
        <img
          src={content}
          alt="AI Output"
          className="max-w-full h-auto rounded-lg"
          style={{ maxHeight: "300px" }}
        />
      </div>
    );
  }

  if (itemType === "dataset") {
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">CSV Dataset</span>
          <button
            onClick={() => {
              const blob = new Blob([content], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = fileName || "dataset.csv";
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}
            className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
          >
            Download
          </button>
        </div>
        <pre className="text-gray-300 whitespace-pre-wrap text-sm max-h-60 overflow-auto bg-gray-800 p-3 rounded border border-gray-700">
          {content}
        </pre>
      </div>
    );
  }

  return (
    <pre className="text-gray-300 whitespace-pre-wrap text-sm max-h-60 overflow-auto">
      {content}
    </pre>
  );
};

const LicenseDetailsModal = ({
  open,
  onClose,
  license,
  item,
}: {
  open: boolean;
  onClose: () => void;
  license: License | null;
  item: Item | null;
}) => {
  if (!open || !license || !item) return null;

  // Determine type and download label/extension
  let fileLabel = "";
  const fileExt = "txt";
  if (item.itemType === "Dataset") {
    fileLabel = "Dataset File";
  } else if (item.itemType === "AIOutput") {
    fileLabel = "AI Output File";
  }
  const isFileType =
    item.itemType === "Dataset" || item.itemType === "AIOutput";

  // Download handler
  const handleDownload = () => {
    // Create a link to download from S3 URL
    const a = document.createElement("a");
    a.href = item.contentRetrievalUrl;
    a.download =
      item.contentFileName ||
      `${item.title.replace(/[^a-zA-Z0-9_-]/g, "_") || "file"}.${fileExt}`;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-gray-800 rounded-xl shadow-2xl border border-gray-700 m-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold z-10 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-700 transition-colors"
        >
          ×
        </button>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-6">
            License Details
          </h2>

          {/* License Info */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-1">License ID</div>
              <div className="text-white font-semibold">#{license.id}</div>
            </div>
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-1">Item ID</div>
              <div className="text-white font-semibold">#{license.itemId}</div>
            </div>
          </div>

          {/* Item Details */}
          <div className="bg-gray-900 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
            <p className="text-gray-300 mb-4">{item.description}</p>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Type:</span>
                <span className="text-white ml-2">{item.itemType}</span>
              </div>
              <div>
                <span className="text-gray-400">Price:</span>
                <span className="text-white ml-2">
                  {(Number(item.price) / 100_000_000).toFixed(2)} ICP
                </span>
              </div>

              <div>
                <span className="text-gray-400">Metadata:</span>
                <span className="text-white ml-2">
                  {item.metadata || "None"}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Purchased:</span>
                <span className="text-white ml-2">
                  {new Date(
                    Number(license.createdAt) / 1000000,
                  ).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-gray-400">License Terms:</span>
                <span className="text-white ml-2">
                  {item.licenseTerms || "None"}
                </span>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="mb-6">
            {isFileType ? (
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">
                  {fileLabel}
                </h4>
                <button
                  onClick={handleDownload}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2"
                >
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
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Download {fileLabel}
                </button>
              </div>
            ) : (
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">
                  Prompt Content
                </h4>
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                  <ContentDisplay
                    contentRetrievalUrl={item.contentRetrievalUrl}
                    itemType={item.itemType}
                    fileName={item.contentFileName}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DEFAULT_IMAGE = "/placeholder_default.svg";

const MyLicenses = () => {
  const { principal, identity } = useAuth();
  const [licenses, setLicenses] = useState<License[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [fetching, setFetching] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  useEffect(() => {
    if (principal) fetchLicensesAndItems();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [principal]);

  const fetchLicensesAndItems = async () => {
    setFetching(true);
    try {
      const actor = await getActor(identity || undefined);

      const resLicenses = await actor.get_my_licenses();

      setLicenses(resLicenses as License[]);
      const resItems = await actor.get_items();
      setItems(resItems as Item[]);
    } catch (e) {
      console.error("Failed to fetch licenses or items:", e);
    }
    setFetching(false);
  };

  const handleViewDetails = (license: License) => {
    const item = items.find((i) => i.id === license.itemId);
    setSelectedLicense(license);
    setSelectedItem(item || null);
    setModalOpen(true);
  };

  const getItemPreviewImage = (itemId: number | bigint) => {
    const images = [
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1686191128892-34af9b70e99c?w=400&h=300&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1692607136002-3895c1f212e7?w=400&h=300&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1633174524827-db00a6b7bc74?w=400&h=300&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=300&fit=crop&crop=center",
    ];
    return images[Number(itemId) % images.length];
  };

  const getPlatformBadge = (itemType: string) => {
    const badges = {
      "AI Image": { label: "Midjourney", color: "bg-purple-600" },
      Text: { label: "ChatGPT", color: "bg-green-600" },
      Video: { label: "Midjourney Video", color: "bg-red-600" },
      Dataset: { label: "Dataset", color: "bg-blue-600" },
      AIOutput: { label: "AI Output", color: "bg-pink-600" },
      Prompt: { label: "Prompt", color: "bg-indigo-600" },
    };

    return (
      badges[itemType as keyof typeof badges] || {
        label: "AI Tool",
        color: "bg-gray-600",
      }
    );
  };

  const getItemImage = (item: Item | undefined) => {
    // First try to get from thumbnailImages array (from actual marketplace data)
    if (item?.thumbnailImages && item.thumbnailImages.length > 0) {
      return item.thumbnailImages[0];
    }
    // Final fallback to default image
    return DEFAULT_IMAGE;
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Licenses</h1>
          <p className="text-gray-400">
            View and manage all your purchased AI prompts, datasets, and outputs
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white mb-1">
                  {licenses.length}
                </div>
                <div className="text-gray-400 text-sm">Total Licenses</div>
              </div>
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white mb-1">
                  {
                    licenses.filter(
                      (l) =>
                        new Date(Number(l.createdAt) / 1000000) >
                        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                    ).length
                  }
                </div>
                <div className="text-gray-400 text-sm">This Month</div>
              </div>
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white mb-1">
                  {
                    licenses.filter(
                      (l) =>
                        new Date(Number(l.createdAt) / 1000000) >
                        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                    ).length
                  }
                </div>
                <div className="text-gray-400 text-sm">This Week</div>
              </div>
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Licenses Grid */}
        {!principal ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
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
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Connect Your Wallet
            </h3>
            <p className="text-gray-400 mb-6">
              Connect your wallet to view your purchased licenses
            </p>
            <p className="text-sm text-gray-500">
              Please connect your wallet using the navbar to view your licenses
            </p>
          </div>
        ) : fetching ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400 text-lg">Loading your licenses...</p>
            </div>
          </div>
        ) : licenses.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              No Licenses Yet
            </h3>
            <p className="text-gray-400 mb-6">
              You haven&lsquo;t purchased any items yet. Start exploring the
              marketplace!
            </p>
            <Link
              href="/marketplace"
              className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold text-white transition-colors inline-block"
            >
              Explore Marketplace
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {licenses.map((license) => {
              const item = items.find((i) => i.id === license.itemId);
              const badge = getPlatformBadge(item?.itemType || "Prompt");
              const imageUrl = getItemImage(item);
              return (
                <div
                  key={license.id}
                  className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-gray-600 transition-all duration-200 group cursor-pointer"
                  onClick={() => handleViewDetails(license)}
                >
                  <div className="relative">
                    <Image
                      src={imageUrl}
                      alt={item?.title || "License item"}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                    />

                    {/* Platform Badge */}
                    <div className="absolute top-3 left-3">
                      <span
                        className={`${badge.color} text-white text-xs px-2 py-1 rounded-md font-medium`}
                      >
                        {badge.label}
                      </span>
                    </div>

                    {/* License Status */}
                    <div className="absolute top-3 right-3">
                      <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-md font-medium">
                        ✓ Licensed
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-white font-semibold mb-2 line-clamp-2">
                      {item?.title || `License #${license.id}`}
                    </h3>

                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {item?.description || "Licensed item"}
                    </p>

                    <div className="flex items-center justify-between text-sm">
                      <div className="text-gray-400">License #{license.id}</div>
                      <div className="text-gray-400">
                        {new Date(
                          Number(license.createdAt) / 1000000,
                        ).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <LicenseDetailsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        license={selectedLicense}
        item={selectedItem}
      />
    </div>
  );
};

export default MyLicenses;
