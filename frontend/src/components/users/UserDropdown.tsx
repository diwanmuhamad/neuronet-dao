"use client";
import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Principal } from "@dfinity/principal";
import { useToast } from "../../contexts/ToastContext";

interface UserDropdownProps {
  onCreateClick?: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ onCreateClick }) => {
  const { addToast } = useToast();
  const {
    isAuthenticated,
    principal,
    icpBalance,
    // depositedBalance, // DISABLED - deposit/withdrawal system hidden for now
    balanceLoading,
    refreshICPBalance,
    // refreshDepositedBalance, // DISABLED - deposit/withdrawal system hidden for now
    // depositICP, // DISABLED - deposit/withdrawal system hidden for now
    // withdrawICP, // DISABLED - deposit/withdrawal system hidden for now
    logout,
    loading,
    actor,
    identity,
  } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  // const [showDepositModal, setShowDepositModal] = useState(false); // DISABLED - deposit/withdrawal system hidden for now
  // const [showWithdrawModal, setShowWithdrawModal] = useState(false); // DISABLED - deposit/withdrawal system hidden for now
  // const [depositAmount, setDepositAmount] = useState(""); // DISABLED - deposit/withdrawal system hidden for now
  // const [withdrawAmount, setWithdrawAmount] = useState(""); // DISABLED - deposit/withdrawal system hidden for now
  const [isRefreshingTopUp, SetIsRefreshingTopUp] = useState(false);
  const [hasReceivedTopUp, setHasReceivedTopUp] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const formatPrincipal = (principal: string) => {
    if (principal.length <= 20) return principal;
    return `${principal.slice(0, 10)}...${principal.slice(-10)}`;
  };

  // Check if user has already received top-up (from on-chain)
  const checkTopUpStatus = async () => {
    if (!principal || !actor) return;

    try {
      const hasReceived = await actor.has_received_topup(
        Principal.fromText(principal)
      );
      setHasReceivedTopUp(hasReceived);
    } catch (error) {
      console.error("Failed to check top-up status:", error);
    }
  };

  const topUpBalances = async () => {
    if (!principal || !actor) {
      addToast("error", "Please connect your wallet first");
      return;
    }

    if (hasReceivedTopUp) {
      addToast(
        "warning",
        "You have already received your one-time top-up of 5 ICP!"
      );
      return;
    }

    SetIsRefreshingTopUp(true);
    try {
      console.log("Requesting top-up of 5 ICP from canister...");

      const result = await actor.top_up_user();

      if ("ok" in result) {
        console.log("Top-up successful!");
        addToast("success", "Successfully topped up 5 ICP to your wallet!");
        // Refresh the balance to show the new amount
        await refreshICPBalance();
        await checkTopUpStatus();
      } else {
        console.error("Top-up failed:", result.err);
        if (result.err === "AlreadyLicensed") {
          addToast(
            "warning",
            "You have already received your one-time top-up of 5 ICP!"
          );
        } else {
          addToast("error", "Top-up failed. Please try again.");
        }
      }
    } catch (error) {
      console.error("Failed to top up balances:", error);
      addToast("error", "Top-up failed. Please try again.");
    } finally {
      SetIsRefreshingTopUp(false);
    }
  };

  const handleRefreshBalance = async () => {
    setIsRefreshing(true);
    try {
      await refreshICPBalance();
      // await refreshDepositedBalance(); // DISABLED - deposit/withdrawal system hidden for now
    } catch (error) {
      console.error("Failed to refresh balances:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // const handleDeposit = async () => {
  //   if (!depositAmount || isProcessing) return;

  //   setIsProcessing(true);
  //   try {
  //     const amount = parseFloat(depositAmount);
  //     if (isNaN(amount) || amount <= 0) {
  //       alert("Please enter a valid amount");
  //       return;
  //     }

  //     const success = await depositICP(amount);
  //     if (success) {
  //       alert(`Successfully deposited ${amount} ICP`);
  //       setDepositAmount("");
  //       setShowDepositModal(false);
  //     } else {
  //       alert("Deposit failed. Please try again.");
  //     }
  //   } catch (error) {
  //     console.error("Deposit error:", error);
  //     alert("Deposit failed. Please try again.");
  //   } finally {
  //     setIsProcessing(false);
  //   }
  // };

  // const handleWithdraw = async () => {
  //   if (!withdrawAmount || isProcessing) return;

  //   setIsProcessing(true);
  //   try {
  //     const amount = parseFloat(withdrawAmount);
  //     if (isNaN(amount) || amount <= 0) {
  //       alert("Please enter a valid amount");
  //       return;
  //     }

  //     if (amount > depositedBalance) {
  //       alert("Insufficient deposited balance");
  //       return;
  //     }

  //     const success = await withdrawICP(amount);
  //     if (success) {
  //       alert(`Successfully withdrew ${amount} ICP`);
  //       setWithdrawAmount("");
  //       setShowWithdrawModal(false);
  //       setShowWithdrawModal(false);
  //     } else {
  //       alert("Withdrawal failed. Please try again.");
  //     }
  //   } catch (error) {
  //     console.error("Withdrawal error:", error);
  //     alert("Withdrawal failed. Please try again.");
  //   } finally {
  //     setIsProcessing(false);
  //   }
  // };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      addToast("success", "Copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      addToast("error", "Failed to copy to clipboard");
    }
  };

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
  };

  // Check top-up status when principal changes
  useEffect(() => {
    if (principal && actor) {
      checkTopUpStatus();
    }
  }, [principal, actor]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!isAuthenticated || !principal) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-full bg-violet-600 hover:bg-violet-700 transition-colors"
        disabled={loading}
      >
        {loading ? (
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-violet-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        )}
        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-violet-600 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold">User Profile</h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-400 text-sm">Authenticated</span>
                </div>
              </div>
            </div>

            {/* Principal ID */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Principal ID
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2 bg-gray-700 text-gray-200 rounded border border-gray-600 text-sm font-mono">
                  {formatPrincipal(principal)}
                </div>
                <button
                  onClick={() => copyToClipboard(principal)}
                  className="p-2 bg-violet-600 hover:bg-violet-700 text-white rounded transition-colors"
                  title="Copy full principal ID"
                >
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
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* ICP Wallet Balance */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                ICP Wallet Balance
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2 bg-gray-700 text-gray-200 rounded border border-gray-600 text-sm flex items-center gap-2">
                  {balanceLoading ? (
                    <>
                      <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading...</span>
                    </>
                  ) : (
                    `${icpBalance.toFixed(2)} ICP`
                  )}
                </div>
                <div className="relative group inline-block">
                  <button
                    onClick={handleRefreshBalance}
                    disabled={isRefreshing}
                    className="p-2 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-600 text-white rounded transition-colors"
                    title="Refresh balances"
                  >
                    {isRefreshing ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
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
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                    )}
                    <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max max-w-xs rounded bg-gray-800 text-white text-sm px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Refresh balances
                    </span>
                  </button>
                </div>
                {!hasReceivedTopUp && (
                  <div className="relative group inline-block">
                    <button
                      onClick={topUpBalances}
                      disabled={isRefreshingTopUp}
                      className="p-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded transition-colors"
                      title="Top up 5 ICP (one-time only)"
                    >
                      {isRefreshingTopUp ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6v12m6-6H6m12 8a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2h12z"
                          />
                        </svg>
                      )}
                      <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max max-w-xs rounded bg-gray-800 text-white text-sm px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        Top up 5 ICP (one-time only)
                      </span>
                    </button>
                  </div>
                )}
                {hasReceivedTopUp && (
                  <div className="relative group inline-block">
                    <button
                      disabled={true}
                      className="p-2 bg-gray-500 text-gray-300 rounded cursor-not-allowed"
                      title="Already received top-up"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max max-w-xs rounded bg-gray-800 text-white text-sm px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        Already received top-up
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Deposited Balance - DISABLED FOR NOW */}
            {/* <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Deposited Balance (For Purchases)
              </label>
              <div className="px-3 py-2 bg-gray-700 text-gray-200 rounded border border-gray-600 text-sm">
                {`${depositedBalance.toFixed(2)} ICP`}
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setShowDepositModal(true)}
                  className="flex-1 py-1 px-3 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors"
                >
                  Deposit
                </button>
                <button
                  onClick={() => setShowWithdrawModal(true)}
                  disabled={depositedBalance <= 0}
                  className="flex-1 py-1 px-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded text-sm transition-colors"
                >
                  Withdraw
                </button>
              </div>
            </div> */}

            {/* Divider */}
            <hr className="border-gray-700 mb-4" />

            {/* Actions */}
            <div className="space-y-2">
              {onCreateClick && (
                <button
                  onClick={() => {
                    onCreateClick();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
                >
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
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Create New Item
                  </div>
                </button>
              )}

              <button
                onClick={() => {
                  router.push("/profile");
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
              >
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  My Profile
                </div>
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
              >
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
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Settings
                </div>
              </button>

              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors"
              >
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
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deposit Modal - DISABLED FOR NOW */}
      {/* {showDepositModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ top: '50%', transform: 'translateY(-50%)' }}>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 w-96 max-h-[90vh] overflow-y-auto shadow-2xl" style={{ top: '45px', position: 'absolute' }}>
            <h3 className="text-xl font-semibold text-white mb-4">Deposit ICP</h3>
            <p className="text-gray-300 mb-4">
              Deposit ICP into the marketplace to make purchases.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Amount (ICP)
              </label>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-violet-500 focus:outline-none"
                placeholder="Enter amount to deposit"
                min="0"
                step="0.01"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDepositModal(false)}
                className="flex-1 py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeposit}
                disabled={isProcessing || !depositAmount}
                className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded transition-colors"
              >
                {isProcessing ? "Processing..." : "Deposit"}
              </button>
            </div>
          </div>
        </div>
      )} */}

      {/* Withdraw Modal - DISABLED FOR NOW */}
      {/* {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 w-96">
            <h3 className="text-xl font-semibold text-white mb-4">Withdraw ICP</h3>
            <p className="text-gray-300 mb-4">
              Withdraw your deposited ICP back to your wallet.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Amount (ICP)
              </label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-violet-500 focus:outline-none"
                placeholder="Enter amount to withdraw"
                min="0"
                step="0.01"
                max={depositedBalance}
              />
              <p className="text-xs text-gray-400 mt-1">
                Available: {depositedBalance.toFixed(2)} ICP
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1 py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleWithdraw}
                disabled={isProcessing || !withdrawAmount}
                className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded transition-colors"
              >
                {isProcessing ? "Processing..." : "Withdraw"}
              </button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default UserDropdown;
