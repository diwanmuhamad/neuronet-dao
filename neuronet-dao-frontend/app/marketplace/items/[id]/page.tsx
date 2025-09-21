"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getActor, getLedgerActor } from "../../../../src/ic/agent";
import Link from "next/link";
import Header from "../../../../components/layout/header/Header";
import CommonBanner from "../../../../components/layout/banner/CommonBanner";
import ProductDetailsNew from "../../../../components/containers/shop/ProductDetailsNew";
import FooterTwo from "../../../../components/layout/footer/FooterTwo";
import InitCustomCursor from "../../../../components/layout/InitCustomCursor";
import ScrollProgressButton from "../../../../components/layout/ScrollProgressButton";
import Animations from "../../../../components/layout/Animations";
import { useAuth } from "../../../../src/contexts/AuthContext";
import { Item, ItemDetail } from "../../../../src/components/Items/interfaces";
import { Comment } from "../../../../src/components/comments/interfaces";
import { generateRetrievalUrl } from '../../../../src/utils/imageUtils';

interface License {
  id: number;
  itemId: bigint;
  buyer: string;
  createdAt: number;
  updatedAt: number;
  expiration?: number | null;
  licenseTerms: string;
  isActive: boolean;
}

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

const DEFAULT_IMAGE = "/placeholder_default.svg";

export default function ItemDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const itemId = parseInt(params.id as string);

  const { identity, principal, loading, icpBalance, refreshICPBalance } =
    useAuth();

  const [itemDetail, setItemDetail] = useState<ItemDetail | null>(null);
  const [, setFullItem] = useState<Item | null>(null);
  const [fetching, setFetching] = useState(false);
  const [message, setMessage] = useState("");
  const [hasLicense, setHasLicense] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [transferFee, setTransferFee] = useState<number>(0.0001); // Default fallback

  useEffect(() => {
    if (loading) return;
    fetchItemDetail();
  }, [itemId, loading]);

  useEffect(() => {
    if (loading) return;
    fetchUserLicenses();
  }, [itemId, loading]);

  useEffect(() => {
    if (loading) return;
    fetchComments();
  }, [itemId, loading]);

  // Fetch transfer fee from backend
  const fetchTransferFee = async () => {
    try {
      const actor = await getActor(identity || undefined);
      const feeInE8s = (await actor.get_transfer_fee()) as bigint;
      const feeInICP = Number(feeInE8s) / 100_000_000;
      setTransferFee(feeInICP);
    } catch (error) {
      console.error("Failed to fetch transfer fee, using default:", error);
      // Keep default fallback
    }
  };

  useEffect(() => {
    if (!loading && identity) {
      fetchTransferFee();
    }
  }, [loading, identity]);

  // Track view when page loads
  useEffect(() => {
    const trackView = async () => {
      try {
        const actor = await getActor(identity || undefined);
        await actor.add_view(BigInt(itemId));
      } catch (error) {
        console.error("Error tracking view:", error);
      }
    };
    trackView();
  }, [itemId]);

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
        console.log(item)
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
        (license: License) => license.itemId === BigInt(itemId)
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
    const totalCost = priceInICP + transferFee; // transferFee is already in ICP

    if (icpBalance < totalCost) {
      setMessage(
        `Insufficient ICP balance. You have ${icpBalance.toFixed(
          2
        )} ICP, item costs ${priceInICP.toFixed(2)} ICP + ${transferFee.toFixed(
          4
        )} ICP fee = ${totalCost.toFixed(4)} ICP total.`
      );
      return;
    }

    try {
      const actor = await getActor(identity || undefined);

      // Resolve canister principal to receive funds
      const canisterPrincipal = await actor.get_canister_principal();

      // Resolve ledger canister ID
      const ledgerCanisterId =
        process.env.NEXT_PUBLIC_ICP_LEDGER_CANISTER_ID ||
        "bkyz2-fmaaa-aaaaa-qaaaq-cai";

      const ledger = await getLedgerActor(
        ledgerCanisterId,
        identity || undefined
      );

      // Fetch exact fee in e8s
      const feeInE8s = await actor.get_transfer_fee();

      // Prepare transfer args
      const rawPrice: unknown = (itemDetail as any).price;
      const itemPrice: bigint =
        typeof rawPrice === "bigint"
          ? rawPrice
          : BigInt((rawPrice as number).toString());

      // Add transfer fee to the amount being sent
      const totalAmount = itemPrice + (feeInE8s as bigint);

      const transferArgs = {
        from_subaccount: [],
        to: { owner: canisterPrincipal, subaccount: [] },
        amount: totalAmount, // Send item price + transfer fee
        fee: [feeInE8s],
        memo: [],
        created_at_time: [],
      } as const;

      // Client-initiated transfer to marketplace canister
      const transferResult = await (ledger as any).icrc1_transfer(transferArgs);

      if (transferResult && "Ok" in transferResult) {
        // Finalize purchase in marketplace canister
        const finalize = await actor.finalize_purchase(itemId);
        if (finalize && typeof finalize === "object" && "ok" in finalize) {
          await refreshICPBalance();
          setMessage("Item purchased successfully!");
          await fetchUserLicenses();
        } else {
          const error =
            finalize && typeof finalize === "object" && "err" in finalize
              ? finalize.err
              : "Unknown error";
          console.error("Finalize failed:", error);
          setMessage("Purchase failed to finalize.");
        }
      } else {
        console.error("Ledger transfer failed:", transferResult);
        setMessage("Ledger transfer failed.");
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
      <div className="my-app">
        <Header />
        <main>
          <CommonBanner title="Loading..." />
          <div className="section">
            <div className="container">
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading item details...</p>
              </div>
            </div>
          </div>
        </main>
        <FooterTwo />
        <InitCustomCursor />
        <ScrollProgressButton />
        {/* <Animations /> */}
      </div>
    );
  }

  if (!itemDetail) {
    return (
      <div className="my-app">
        <Header />
        <main>
          {/* <CommonBanner title="Item Not Found" /> */}
          <div className="section">
            <div className="container">
              <div className="text-center">
                <h2 className="title text-white mb-4">Item Not Found</h2>
                <p className="tertiary-text mb-6">
                  The requested item could not be found.
                </p>
                <Link href="/marketplace" className="btn btn--primary">
                  Back to Marketplace
                </Link>
              </div>
            </div>
          </div>
        </main>
        <FooterTwo />
        <InitCustomCursor />
        <ScrollProgressButton />
        {/* <Animations /> */}
      </div>
    );
  }

  return (
    <div className="my-app">
      <Header />
      <main>
        <CommonBanner title={'Item Details'} />
        
        {/* Success/Error Message */}
        {message && (
          <div style={{ width: "100%", display: "flex", justifyContent: "center", margin: "24px 0" }}>
            <div
              style={{
                background:
                  message.includes("successfully")
                    ? "#28a745"
                    : message.includes("cannot buy your own")
                    ? "#dc3545"
                    : "#1e2130",
                color: "#fff",
                borderRadius: "12px",
                padding: "18px 32px",
                minWidth: "280px",
                maxWidth: "480px",
                boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
                fontWeight: 500,
                fontSize: "1.08rem",
                textAlign: "center",
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
              role="alert"
            >
              <span style={{ flex: 1 }}>{message}</span>
              <button
                type="button"
                onClick={() => setMessage("")}
                aria-label="Close"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#fff",
                  fontSize: "1.3rem",
                  cursor: "pointer",
                  marginLeft: "8px",
                  lineHeight: 1,
                }}
              >
                &times;
              </button>
            </div>
          </div>
        )}

        {/* Product Details - Replaced old UI with new component system */}
        <ProductDetailsNew
          itemDetail={itemDetail}
          comments={comments}
          isOwner={isOwner}
          hasLicense={hasLicense}
          isFavorited={isFavorited}
          principal={principal || undefined}
          onBuy={handleBuy}
          onFavorite={handleFavorite}
          onSubmitComment={handleAddComment}
          isSubmittingComment={submittingComment}
        />

        {/* Prompt Content (Only for License Holders) - TODO: Implement prompt content display */}
        {hasLicense && itemDetail && (
          <div className="container" style={{marginTop: '20px'}}>
            <h4
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#ffffff",
                marginBottom: "12px",
              }}
            >
              Content
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
                contentRetrievalUrl={itemDetail.contentRetrievalUrl}
                itemType={itemDetail.itemType}
                fileName={itemDetail.contentFileName}
              />
            </div>
          </div>
        )}
      </main>
      <FooterTwo />
      {/* <InitCustomCursor />
      <ScrollProgressButton /> */}
      {/* <Animations /> */}
    </div>
  );
}
