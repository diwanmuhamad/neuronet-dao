"use client";
import React, { useEffect, useState, useCallback } from "react";
import { getActor } from "@/src/ic/agent";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/header/Header";
import { useAuth } from "@/src/contexts/AuthContext";
import { Item } from "@/src/components/Items/interfaces";
import { License } from "@/src/components/Items/interfaces";
import "./my-licenses.css";
import FooterTwo from "@/components/layout/footer/FooterTwo";
import SecureImage from "@/components/containers/SecureImage";
import { generateRetrievalUrl } from "@/src/utils/imageUtils";

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
        if (contentRetrievalUrl) {
          const newContentRetrievalUrl = await generateRetrievalUrl(contentRetrievalUrl);
          if (!newContentRetrievalUrl) {
            throw new Error("No retrieval URL generated");
          }
          const response = await fetch(newContentRetrievalUrl);
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
        }
        else {
          throw new Error("No content URL provided");
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
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ padding: "32px 0" }}
      >
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center" style={{ color: "#ff6b6b" }}>
        Error loading content: {error}
      </p>
    );
  }

  if (itemType === "ai_output") {
    return (
      <div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span style={{ fontSize: "12px", color: "#b1b0b6" }}>
            AI Output
          </span>
          <button
            onClick={() => {
              // Download the image file
              const a = document.createElement("a");
              a.href = content;
              a.download = fileName || "ai_output.png";
              a.target = "_blank";
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }}
            className="btn btn--primary"
            style={{ padding: "4px 8px", fontSize: "12px" }}
          >
            Download
          </button>
        </div>
        {/* <div className="d-flex justify-content-center">
          <Image
            src={content}
            width={200}
            height={100}
            alt="AI Output"
            className="w-100 h-auto"
            style={{ maxHeight: "300px", borderRadius: "10px" }}
          />
        </div> */}
      </div>
    );
  }

  if (itemType === "dataset") {
    return (
      <div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span style={{ fontSize: "12px", color: "#b1b0b6" }}>
            CSV Dataset
          </span>
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
            className="btn btn--primary"
            style={{ padding: "4px 8px", fontSize: "12px" }}
          >
            Download
          </button>
        </div>
      </div>
    );
  }

  return (
    <pre
      style={{
        color: "#e4e4e7", // slightly softer white
        whiteSpace: "pre-wrap",
        fontSize: "14px",
        maxHeight: "240px",
        overflow: "auto",
        padding: "12px",
      }}
    >
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
    <div
      className="modal-backdrop"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "768px",
          backgroundColor: "#120f23",
          borderRadius: "20px",
          border: "1px solid #414141",
          margin: "16px",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            color: "#b1b0b6",
            fontSize: "24px",
            fontWeight: "bold",
            zIndex: 10,
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#ffffff";
            e.currentTarget.style.backgroundColor = "#302e3f";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#b1b0b6";
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          ×
        </button>

        <div style={{ padding: "24px" }}>
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#ffffff",
              marginBottom: "24px",
            }}
          >
            License Details
          </h2>

          {/* License Info */}
          <div className="row gaper mb-4">
            <div className="col-6">
              <div
                style={{
                  backgroundColor: "#191b1a",
                  borderRadius: "10px",
                  padding: "16px",
                }}
              >
                <div
                  style={{
                    color: "#b1b0b6",
                    fontSize: "14px",
                    marginBottom: "20px",
                  }}
                >
                  License ID
                </div>
                <div style={{ color: "#ffffff", fontWeight: "600" }}>
                  #{Number(license.id)}
                </div>
              </div>
            </div>
            <div className="col-6">
              <div
                style={{
                  backgroundColor: "#191b1a",
                  borderRadius: "10px",
                  padding: "16px",
                }}
              >
                <div
                  style={{
                    color: "#b1b0b6",
                    fontSize: "14px",
                    marginBottom: "20px",
                  }}
                >
                  Item ID
                </div>
                <div style={{ color: "#ffffff", fontWeight: "600" }}>
                  #{Number(license.itemId)}
                </div>
              </div>
            </div>
          </div>

          {/* Item Details */}
          <div
            style={{
              backgroundColor: "#191b1a",
              borderRadius: "10px",
              padding: "24px",
              marginBottom: "24px",
            }}
          >
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#ffffff",
                marginBottom: "16px",
              }}
            >
              {item.title}
            </h3>
            <p style={{ color: "#b1b0b6", marginBottom: "16px" }}>
              {item.description}
            </p>

            <div className="row gaper">
              <div className="col-6">
                <div style={{ fontSize: "14px" }}>
                  <span style={{ color: "#b1b0b6" }}>Type:</span>
                  <span style={{ color: "#ffffff", marginLeft: "8px" }}>
                    {item.itemType}
                  </span>
                </div>
              </div>
              <div className="col-6">
                <div style={{ fontSize: "14px" }}>
                  <span style={{ color: "#b1b0b6" }}>Price:</span>
                  <span style={{ color: "#ffffff", marginLeft: "8px" }}>
                    {(Number(item.price) / 100_000_000).toFixed(2)} ICP
                  </span>
                </div>
              </div>
              <div className="col-6">
                <div style={{ fontSize: "14px" }}>
                  <span style={{ color: "#b1b0b6" }}>Metadata:</span>
                  <span style={{ color: "#ffffff", marginLeft: "8px" }}>
                    {item.metadata || "None"}
                  </span>
                </div>
              </div>
              <div className="col-6">
                <div style={{ fontSize: "14px" }}>
                  <span style={{ color: "#b1b0b6" }}>Purchased:</span>
                  <span style={{ color: "#ffffff", marginLeft: "8px" }}>
                    {new Date(
                      Number(license.createdAt) / 1000000
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="col-12">
                <div style={{ fontSize: "14px" }}>
                  <span style={{ color: "#b1b0b6" }}>License Terms:</span>
                  <span style={{ color: "#ffffff", marginLeft: "8px" }}>
                    {item.licenseTerms || "None"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div style={{ marginBottom: "24px" }}>
            {isFileType ? (
              <div>
                <h4
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#ffffff",
                    marginBottom: "12px",
                  }}
                >
                  {fileLabel}
                </h4>
                <button
                  onClick={handleDownload}
                  className="btn btn--primary d-flex align-items-center"
                  style={{ gap: "8px" }}
                >
                  <svg
                    style={{ width: "20px", height: "20px" }}
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
                <h4
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#ffffff",
                    marginBottom: "12px",
                  }}
                >
                  Prompt Content
                </h4>
                <div
                  className="content-scroll"
                  style={{
                    backgroundColor: "#191b1a",
                    borderRadius: "10px",
                    padding: "16px",
                    border: "1px solid #414141",
                  }}
                >
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
          <div className="d-flex justify-content-end">
            <button onClick={onClose} className="btn btn--secondary">
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
  const { principal, identity, isAuthenticated } = useAuth();
  const [licenses, setLicenses] = useState<License[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [fetching, setFetching] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const fetchLicensesAndItems = useCallback(async () => {
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
  }, [identity]);

  useEffect(() => {
    if (principal) fetchLicensesAndItems();
  }, [principal, fetchLicensesAndItems]);

  // Redirect to login if not authenticated
  //   useEffect(() => {
  //     if (!isAuthenticated) {
  //       window.location.href = "/sign-in";
  //     }
  //   }, [isAuthenticated]);

  const handleViewDetails = (license: License) => {
    const item = items.find((i) => i.id === license.itemId);
    setSelectedLicense(license);
    setSelectedItem(item || null);
    setModalOpen(true);
  };

  const getPlatformBadge = (itemType: string) => {
    const badges = {
      "AI Image": { label: "Midjourney", color: "#65ff4b" },
      Text: { label: "ChatGPT", color: "#40cc28" },
      Video: { label: "Midjourney Video", color: "#ff6b6b" },
      Dataset: { label: "Dataset", color: "#4dabf7" },
      AIOutput: { label: "AI Output", color: "#f783ac" },
      Prompt: { label: "Prompt", color: "#9775fa" },
    };

    return (
      badges[itemType as keyof typeof badges] || {
        label: "AI Tool",
        color: "#595765",
      }
    );
  };

  // Show loading or redirect if not authenticated
  // if (!isAuthenticated) {
  //   return (
  //     <div
  //       style={{
  //         minHeight: "100vh",
  //         backgroundColor: "#030015",
  //         display: "flex",
  //         alignItems: "center",
  //         justifyContent: "center",
  //       }}
  //     >
  //       <div className="text-center">
  //         <div
  //           className="loading-spinner"
  //           style={{
  //             width: "64px",
  //             height: "64px",
  //             margin: "0 auto 16px",
  //           }}
  //         ></div>
  //         <p style={{ color: "#b1b0b6" }}>Redirecting to login...</p>
  //       </div>
  //     </div>
  //   );
  // }

  const getItemImage = (item: Item | undefined) => {
    // First try to get from thumbnailImages array (from actual marketplace data)
    if (item?.thumbnailImages && item.thumbnailImages.length > 0) {
      return item.thumbnailImages[0];
    }
    // Final fallback to default image
    return DEFAULT_IMAGE;
  };

  return (
    <>
      <Header />
      <section className="cart-m">
        <div className="container">
          <div className="row"></div>
          <div className="col-12">
            <div className="cart-m-inner">
              {/* Header */}
              <div className="intro">
                <h2
                  className="light-title fw-7 text-white mt-12"
                  style={{ opacity: 1 }}
                >
                  My Licenses
                </h2>
                <p style={{ color: "#b1b0b6", marginTop: "12px" }}>
                  View and manage all your purchased AI prompts, datasets, and
                  outputs
                </p>
              </div>

              {/* Stats */}
              <div className="row gaper mt-5">
                <div className="col-lg-4 col-md-6">
                  <div className="category__single stats-card">
                    <div className="content">
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <h4 className="text-white fw-6 mb-1">
                            {licenses.length}
                          </h4>
                          <p style={{ color: "#b1b0b6", marginBottom: "0" }}>
                            Total Licenses
                          </p>
                        </div>
                        <div
                          style={{
                            width: "48px",
                            height: "48px",
                            backgroundColor: "#65ff4b",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <i className="bi bi-file-earmark-check text-white fs-4"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-4 col-md-6">
                  <div className="category__single stats-card">
                    <div className="content">
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <h4 className="text-white fw-6 mb-1">
                            {
                              licenses.filter(
                                (l) =>
                                  new Date(Number(l.createdAt) / 1000000) >
                                  new Date(
                                    Date.now() - 30 * 24 * 60 * 60 * 1000
                                  )
                              ).length
                            }
                          </h4>
                          <p style={{ color: "#b1b0b6", marginBottom: "0" }}>
                            This Month
                          </p>
                        </div>
                        <div
                          style={{
                            width: "48px",
                            height: "48px",
                            backgroundColor: "#40cc28",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <i className="bi bi-calendar3 text-white fs-4"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-4 col-md-6">
                  <div className="category__single stats-card">
                    <div className="content">
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <h4 className="text-white fw-6 mb-1">
                            {
                              licenses.filter(
                                (l) =>
                                  new Date(Number(l.createdAt) / 1000000) >
                                  new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                              ).length
                            }
                          </h4>
                          <p style={{ color: "#b1b0b6", marginBottom: "0" }}>
                            This Week
                          </p>
                        </div>
                        <div
                          style={{
                            width: "48px",
                            height: "48px",
                            backgroundColor: "#46e695",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <i className="bi bi-graph-up text-white fs-4"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Licenses Grid */}
              {!principal ? (
                <div className="text-center" style={{ padding: "80px 0" }}>
                  <div
                    style={{
                      width: "64px",
                      height: "64px",
                      backgroundColor: "#120f23",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 16px",
                    }}
                  >
                    <i
                      className="bi bi-person-circle"
                      style={{ color: "#b1b0b6", fontSize: "32px" }}
                    ></i>
                  </div>
                  <h3
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      color: "#ffffff",
                      marginBottom: "8px",
                    }}
                  >
                    Connect Your Wallet
                  </h3>
                  <p style={{ color: "#b1b0b6", marginBottom: "24px" }}>
                    Connect your wallet to view your purchased licenses
                  </p>
                  <p style={{ fontSize: "14px", color: "#595765" }}>
                    Please connect your wallet using the navbar to view your
                    licenses
                  </p>
                </div>
              ) : fetching ? (
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{ padding: "80px 0" }}
                >
                  <div className="text-center">
                    <div
                      className="loading-spinner"
                      style={{
                        width: "64px",
                        height: "64px",
                        margin: "0 auto 16px",
                      }}
                    ></div>
                    <p style={{ color: "#b1b0b6", fontSize: "18px" }}>
                      Loading your licenses...
                    </p>
                  </div>
                </div>
              ) : licenses.length === 0 ? (
                <div className="text-center" style={{ padding: "80px 0" }}>
                  <div
                    style={{
                      width: "64px",
                      height: "64px",
                      backgroundColor: "#120f23",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 16px",
                    }}
                  >
                    <i
                      className="bi bi-file-earmark-check"
                      style={{ color: "#b1b0b6", fontSize: "32px" }}
                    ></i>
                  </div>
                  <h3
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      color: "#ffffff",
                      marginBottom: "8px",
                    }}
                  >
                    No Licenses Yet
                  </h3>
                  <p style={{ color: "#b1b0b6", marginBottom: "24px" }}>
                    You haven&apos;t purchased any items yet. Start exploring
                    the marketplace!
                  </p>
                  <Link href="/marketplace" className="btn btn--primary">
                    Explore Marketplace
                  </Link>
                </div>
              ) : (
                <div className="row gaper mt-5">
                  {licenses.map((license) => {
                    const item = items.find((i) => i.id === license.itemId);
                    const badge = getPlatformBadge(item?.itemType || "Prompt");
                    const imageUrl = getItemImage(item);
                    return (
                      <div key={license.id} className="col-lg-4 col-md-6">
                        <div
                          style={{
                            padding: "20px",
                            backgroundColor: "#120f23",
                            borderRadius: "20px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleViewDetails(license)}
                        >
                          <div
                            style={{
                              marginBottom: "20px",
                              position: "relative",
                            }}
                          >
                            <div
                              style={{
                                width: "100%",
                                height: "230px",
                                overflow: "hidden",
                                borderRadius: "10px",
                              }}
                            >
                              <SecureImage
                                src={imageUrl}
                                alt={item?.title || "License item"}
                                width={266}
                                height={200}
                                className="w-100"
                              />
                            </div>

                            {/* Platform Badge */}
                            {/* <div className="tag">
                              <span
                                className="platform-badge"
                                style={{
                                  backgroundColor: badge.color,
                                  color: "#ffffff",
                                  fontSize: "12px",
                                  padding: "4px 8px",
                                  borderRadius: "6px",
                                  fontWeight: "500",
                                }}
                              >
                                {badge.label}
                              </span>
                            </div> */}
                          </div>

                          <div className="content">
                            <h4 className="text-white fw-6 mb-2">
                              {item?.title || `License #${Number(license.id)}`}
                            </h4>
                            <p
                              style={{
                                color: "#b1b0b6",
                                fontSize: "14px",
                                marginBottom: "12px",
                              }}
                            >
                              {item?.description || "Licensed item"}
                            </p>
                          </div>

                          <hr />

                          <div className="meta">
                            <div className="meta-info">
                              <p
                                style={{
                                  color: "#b1b0b6",
                                  marginBottom: "0",
                                }}
                              >
                                License #{Number(license.id)}
                              </p>
                            </div>
                            <div className="meta-review">
                              <span
                                style={{ color: "#b1b0b6", fontSize: "14px" }}
                              >
                                {new Date(
                                  Number(license.createdAt) / 1000000
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          <div className="cta mt-3">
                            <button className="btn btn--primary w-100">
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
          </div>
        </div>
      </section>
      <FooterTwo />

      <LicenseDetailsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        license={selectedLicense}
        item={selectedItem}
      />
    </>
  );
};

export default MyLicenses;
