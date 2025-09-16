"use client";
import React, { useState } from "react";
import { getActor } from "../../../src/ic/agent";
import { useAuth } from "@/src/contexts/AuthContext";
import styles from "./VerificationStatus.module.css";

interface OnChainRecord {
  id: number;
  itemId: number;
  contentHash: string;
  ownerWallet: unknown; // Principal object
  timestamp: number | bigint;
  licenseTerms: string;
  royaltyPercent: number;
  isVerified: boolean;
}

interface VerificationResult {
  isVerified: boolean;
  onChainRecord?: OnChainRecord | null;
  hashMatch: boolean;
  message: string;
}

interface VerificationStatusProps {
  itemId: number;
  className?: string;
}

export default function VerificationStatus({
  itemId,
  className = "",
}: VerificationStatusProps) {
  const { identity } = useAuth();
  const [verificationResult, setVerificationResult] =
    useState<VerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleVerifyContent = async () => {
    setIsVerifying(true);
    try {
      const actor = await getActor(identity || undefined);
      const result = await actor.verify_item_content(itemId);
      console.log("Verification result:", result);

      // Handle the Motoko optional type which comes as an array in JavaScript
      const processedResult = result as VerificationResult;

      // If onChainRecord is an array (Motoko optional), extract the first element
      if (
        processedResult.onChainRecord &&
        Array.isArray(processedResult.onChainRecord)
      ) {
        if (processedResult.onChainRecord.length > 0) {
          processedResult.onChainRecord = processedResult.onChainRecord[0];
        } else {
          processedResult.onChainRecord = null;
        }
      }

      setVerificationResult(processedResult);
    } catch (error) {
      console.error("Failed to verify content:", error);
      setVerificationResult({
        isVerified: false,
        onChainRecord: null,
        hashMatch: false,
        message: "Failed to verify content. Please try again.",
      });
    }
    setIsVerifying(false);
  };

  const formatTimestamp = (timestamp: number | bigint) => {
    const timestampNum =
      typeof timestamp === "bigint" ? Number(timestamp) : timestamp;
    return new Date(timestampNum / 1000000).toLocaleString();
  };

  const getVerificationIcon = () => {
    if (!verificationResult) return null;

    if (verificationResult.isVerified && verificationResult.hashMatch) {
      return (
        <i className="material-symbols-outlined verification-clean__icon--success">
          check_circle
        </i>
      );
    } else {
      return (
        <i className="material-symbols-outlined verification-clean__icon--error">
          cancel
        </i>
      );
    }
  };

  const getStatusColor = () => {
    if (!verificationResult) return "verification-clean__status-text--neutral";
    return verificationResult.isVerified && verificationResult.hashMatch
      ? "verification-clean__status-text--success"
      : "verification-clean__status-text--error";
  };

  const getStatusText = () => {
    if (!verificationResult) return "Not verified";
    return verificationResult.isVerified && verificationResult.hashMatch
      ? "Verified on-chain"
      : "Verification failed";
  };

  return (
    <div className={styles["verification-clean-wrapper"]}>
      <div className={`${styles["verification-clean"]} ${className}`}>
        {/* Clean Header */}
        <div className={styles["verification-clean__header"]}>
          <div className={styles["verification-clean__title-section"]}>
            <h3 className={styles["verification-clean__title"]}>
              On-Chain Verification
            </h3>
            <p className={styles["verification-clean__subtitle"]}>
              Verify item authenticity on blockchain
            </p>
          </div>
          <button
            onClick={handleVerifyContent}
            disabled={isVerifying}
            className={styles["verification-clean__verify-btn"]}
          >
            {isVerifying ? (
              <>
                <div className={styles["verification-clean__spinner"]} />
                Verifying...
              </>
            ) : (
              <>
                <i className="material-symbols-outlined">check_circle</i>
                Verify
              </>
            )}
          </button>
        </div>

        {/* Clean Verification Result */}
        {verificationResult && (
          <div className={styles["verification-clean__result"]}>
            <div className={styles["verification-clean__status"]}>
              <div className={styles["verification-clean__status-icon"]}>
                {getVerificationIcon()}
              </div>
              <div className={styles["verification-clean__status-content"]}>
                <span className={`${styles["verification-clean__status-text"]} ${getStatusColor()}`}>
                  {getStatusText()}
                </span>
                <p className={styles["verification-clean__status-message"]}>
                  {verificationResult.message}
                </p>
              </div>
            </div>

            {/* Clean Verification Details */}
            {verificationResult.onChainRecord && (
              <div className={styles["verification-clean__details"]}>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className={styles["verification-clean__toggle-btn"]}
                >
                  <span className={styles["verification-clean__toggle-text"]}>
                    {showDetails ? "Hide" : "Show"} verification details
                  </span>
                  <i className={`material-symbols-outlined ${styles["verification-clean__toggle-icon"]} ${showDetails ? "rotated" : ""}`}>
                    expand_more
                  </i>
                </button>

                {showDetails && (
                  <div className={styles["verification-clean__details-content"]}>
                    <div className={styles["verification-clean__details-grid"]}>
                      <div className={styles["verification-clean__detail-item"]}>
                        <div className={styles["verification-clean__detail-icon"]}>
                          <i className="material-symbols-outlined">fingerprint</i>
                        </div>
                        <div className={styles["verification-clean__detail-content"]}>
                          <span className={styles["verification-clean__detail-label"]}>Content Hash:</span>
                          <span className={`${styles["verification-clean__detail-value"]} ${styles["verification-clean__detail-value--hash"]}`}>
                            {verificationResult.onChainRecord?.contentHash || "N/A"}
                          </span>
                        </div>
                      </div>
                      <div className={styles["verification-clean__detail-item"]}>
                        <div className={styles["verification-clean__detail-icon"]}>
                          <i className="material-symbols-outlined">person</i>
                        </div>
                        <div className={styles["verification-clean__detail-content"]}>
                          <span className={styles["verification-clean__detail-label"]}>Owner:</span>
                          <span className={styles["verification-clean__detail-value"]}>&nbsp;
                            {(() => {
                              const owner = verificationResult.onChainRecord?.ownerWallet;
                              if (!owner) return "N/A";

                              try {
                                if (typeof owner === "object" && owner !== null && "toText" in owner && typeof owner.toText === "function") {
                                  return (owner.toText as () => string)().slice(0, 8) + "...";
                                }
                                if (typeof owner === "string") {
                                  return owner.slice(0, 8) + "...";
                                }
                                return String(owner).slice(0, 8) + "...";
                              } catch (e) {
                                console.error("verificationResult error: ", e);
                                return "Invalid...";
                              }
                            })()}
                          </span>
                        </div>
                      </div>
                      <div className={styles["verification-clean__detail-item"]}>
                        <div className={styles["verification-clean__detail-icon"]}>
                          <i className="material-symbols-outlined">schedule</i>
                        </div>
                        <div className={styles["verification-clean__detail-content"]}>
                          <span className={styles["verification-clean__detail-label"]}>Recorded:</span>
                          <span className={styles["verification-clean__detail-value"]}>
                            &nbsp;{verificationResult.onChainRecord?.timestamp
                              ? formatTimestamp(verificationResult.onChainRecord.timestamp)
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                      <div className={styles["verification-clean__detail-item"]}>
                        <div className={styles["verification-clean__detail-icon"]}>
                          <i className="material-symbols-outlined">percent</i>
                        </div>
                        <div className={styles["verification-clean__detail-content"]}>
                          <span className={styles["verification-clean__detail-label"]}>Royalty:</span>
                          <span className={styles["verification-clean__detail-value"]}>
                            &nbsp;{verificationResult.onChainRecord?.royaltyPercent ?? 0}%
                          </span>
                        </div>
                      </div>
                      <div className={styles["verification-clean__detail-item"]}>
                        <div className={styles["verification-clean__detail-icon"]}>
                          <i className="material-symbols-outlined">gavel</i>
                        </div>
                        <div className={styles["verification-clean__detail-content"]}>
                          <span className={styles["verification-clean__detail-label"]}>License Terms:</span>
                          <span className={`${styles["verification-clean__detail-value"]}`}>
                            &nbsp;{verificationResult.onChainRecord?.licenseTerms || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Clean Initial State */}
        {!verificationResult && (
          <div className={styles["verification-clean__initial"]}>
            <div className={styles["verification-clean__initial-content"]}>
              <i className="material-symbols-outlined verification-clean__initial-icon">
                info
              </i>
              <p className={styles["verification-clean__initial-text"]}>
                Click &quot;Verify&quot; to check if this item is recorded on-chain
                and verify its authenticity.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
