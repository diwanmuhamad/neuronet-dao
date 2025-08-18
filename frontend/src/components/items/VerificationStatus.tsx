"use client";
import React, { useState, useEffect } from "react";
import { getActor } from "../../ic/agent";
import { useAuth } from "@/contexts/AuthContext";

interface OnChainRecord {
  id: number;
  itemId: number;
  contentHash: string;
  ownerWallet: any; // Principal object
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
      let processedResult = result as VerificationResult;

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
        <svg
          className="w-5 h-5 text-green-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      );
    } else {
      return (
        <svg
          className="w-5 h-5 text-red-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      );
    }
  };

  const getStatusColor = () => {
    if (!verificationResult) return "text-gray-400";
    return verificationResult.isVerified && verificationResult.hashMatch
      ? "text-green-400"
      : "text-red-400";
  };

  const getStatusText = () => {
    if (!verificationResult) return "Not verified";
    return verificationResult.isVerified && verificationResult.hashMatch
      ? "Verified on-chain"
      : "Verification failed";
  };

  return (
    <div
      className={`bg-gray-800 rounded-lg p-4 border border-gray-700 ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <svg
            className="w-5 h-5 text-purple-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          On-Chain Verification
        </h3>
        <button
          onClick={handleVerifyContent}
          disabled={isVerifying}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          {isVerifying ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Verifying...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Verify
            </>
          )}
        </button>
      </div>

      {verificationResult && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            {getVerificationIcon()}
            <span className={`font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>

          <p className="text-gray-300 text-sm">{verificationResult.message}</p>

          {verificationResult.onChainRecord && (
            <div className="space-y-2">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors flex items-center gap-1"
              >
                {showDetails ? "Hide" : "Show"} verification details
                <svg
                  className={`w-4 h-4 transition-transform ${showDetails ? "rotate-180" : ""}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {showDetails && (
                <div className="bg-gray-750 rounded-lg p-3 space-y-2 border border-gray-600">
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Content Hash:</span>
                      <span className="text-gray-200 font-mono text-xs break-all">
                        {verificationResult.onChainRecord?.contentHash || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Owner:</span>
                      <span className="text-gray-200 font-mono text-xs">
                        {(() => {
                          const owner =
                            verificationResult.onChainRecord?.ownerWallet;
                          if (!owner) return "N/A";

                          try {
                            if (typeof owner === "object" && owner.toText) {
                              return owner.toText().slice(0, 8) + "...";
                            }
                            if (typeof owner === "string") {
                              return owner.slice(0, 8) + "...";
                            }
                            return String(owner).slice(0, 8) + "...";
                          } catch (e) {
                            return "Invalid...";
                          }
                        })()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Recorded:</span>
                      <span className="text-gray-200 text-xs">
                        {verificationResult.onChainRecord?.timestamp
                          ? formatTimestamp(
                              verificationResult.onChainRecord.timestamp,
                            )
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Royalty:</span>
                      <span className="text-gray-200 text-xs">
                        {verificationResult.onChainRecord?.royaltyPercent ?? 0}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">License Terms:</span>
                      <span className="text-gray-200 text-xs max-w-48 truncate">
                        {verificationResult.onChainRecord?.licenseTerms ||
                          "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {!verificationResult && (
        <div className="text-gray-400 text-sm">
          Click "Verify" to check if this item is recorded on-chain and verify
          its authenticity.
        </div>
      )}
    </div>
  );
}
