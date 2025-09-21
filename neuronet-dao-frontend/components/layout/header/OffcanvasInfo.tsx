"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import logo from "@/public/images/offcanvas-logo.png";
import { useAuth } from "@/src/contexts/AuthContext";
import { useToast } from "@/src/contexts/ToastContext";
import { Principal } from "@dfinity/principal";

const OffcanvasInfo = ({ isOpen, setIsOpen }: any) => {
  const router = useRouter();
  const { addToast } = useToast();
  const {
    isAuthenticated,
    principal,
    icpBalance,
    balanceLoading,
    refreshICPBalance,
    logout,
    loading,
    actor,
  } = useAuth();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isRefreshingTopUp, setIsRefreshingTopUp] = useState(false);
  const [hasReceivedTopUp, setHasReceivedTopUp] = useState(false);

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

    setIsRefreshingTopUp(true);
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
      setIsRefreshingTopUp(false);
    }
  };

  const handleRefreshBalance = async () => {
    setIsRefreshing(true);
    try {
      await refreshICPBalance();
    } catch (error) {
      console.error("Failed to refresh balances:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

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

  if (!isAuthenticated || !principal) {
    return (
      <>
        <div
          className={
            "offcanvas-info" + (isOpen ? " offcanvas-info-active" : " ")
          }
        >
          <div className="offcanvas-info__inner">
            <div className="offcanvas-info__intro">
              <div className="offcanvas-info__logo">
                <Link href="/">
                  <Image src={logo} alt="Image" priority />
                </Link>
              </div>
              <h4>Intelligent Conversations Made Simple</h4>
            </div>
            <div className="offcanvas-info__content">
              <h5>Contact Us</h5>
              <ul>
                <li>
                  <Link href="mailto:Aikeu@example.com">Aikeu@example.com</Link>
                </li>
                <li>
                  <Link href="tel:1880-480-555-0103">
                    +1 880 (480) 555-0103
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://www.google.com/maps/place/Kentucky,+USA/@37.8172108,-87.087054,8z/data=!3m1!4b1!4m6!3m5!1s0x8842734c8b1953c9:0x771f6f4ec5ccdffc!8m2!3d37.8393332!4d-84.2700179!16zL20vMDQ5OHk?entry=ttu"
                    target="_blank"
                  >
                    4517 Washington Ave. Manchester, Kentucky 39495
                  </Link>
                </li>
              </ul>
            </div>
            <div className="offcanvas-info__form">
              <h5>Subscribe to newsletter</h5>
              <form action="#" method="post" autoComplete="off">
                <div className="subscribe-form">
                  <input
                    type="email"
                    name="subscribe-newsletter"
                    id="subscribeNewsletter"
                    placeholder="Email"
                    required
                  />
                  <button
                    type="submit"
                    aria-label="subscribe newsletter"
                    title="subscribe newsletter"
                  >
                    <i className="material-symbols-outlined">send</i>
                  </button>
                </div>
              </form>
            </div>
            <div className="offcanvas-info__footer">
              <p className="tertiary-text">Follow Us :</p>
              <div className="social">
                <Link
                  href="https://www.facebook.com/"
                  target="_blank"
                  aria-label="share us on facebook"
                  title="facebook"
                >
                  <i className="bi bi-facebook"></i>
                </Link>
                <Link
                  href="https://www.twitter.com/"
                  target="_blank"
                  aria-label="share us on twitter"
                  title="twitter"
                >
                  <i className="bi bi-twitter"></i>
                </Link>
                <Link
                  href="https://www.linkedin.com/"
                  target="_blank"
                  aria-label="share us on pinterest"
                  title="linkedin"
                >
                  <i className="bi bi-linkedin"></i>
                </Link>
                <Link
                  href="https://www.instagram.com/"
                  target="_blank"
                  aria-label="share us on instagram"
                  title="instagram"
                >
                  <i className="bi bi-instagram"></i>
                </Link>
              </div>
            </div>
          </div>
          <button
            className="close-offcanvas-info"
            aria-label="close offcanvas info"
            onClick={() => setIsOpen(false)}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        <div
          className={
            "offcanvas-info-backdrop " +
            (isOpen ? " offcanvas-info-backdrop-active" : " ")
          }
          onClick={() => setIsOpen(false)}
        ></div>
      </>
    );
  }

  return (
    <>
      <div
        className={"offcanvas-info" + (isOpen ? " offcanvas-info-active" : " ")}
      >
        <div className="offcanvas-info__inner">
          {/* User Profile Header */}
          <div className="offcanvas-info__intro">
            <div className="offcanvas-info__logo">
              <Link href="/">
                <Image src={logo} alt="Image" priority />
              </Link>
            </div>
          </div>

          {/* User Data Content */}
          <div className="offcanvas-info__content">
            {/* Principal ID */}
            <div className="user-data-section">
              <h5>Principal ID</h5>
              <div className="input-group">
                <div className="principal-display">
                  {formatPrincipal(principal)}
                </div>
                <button
                  onClick={() => copyToClipboard(principal)}
                  className="offcanvas-btn offcanvas-btn--copy"
                  title="Copy full principal ID"
                >
                  <i className="bi bi-clipboard"></i>
                </button>
              </div>
            </div>

            {/* ICP Wallet Balance */}
            <div className="user-data-section">
              <h5>ICP Wallet Balance</h5>
              <div className="input-group">
                <div className="balance-display">
                  {balanceLoading ? (
                    <>Loading...</>
                  ) : (
                    `${icpBalance.toFixed(2)} ICP`
                  )}
                </div>
                <button
                  onClick={handleRefreshBalance}
                  disabled={isRefreshing}
                  className="offcanvas-btn offcanvas-btn--refresh"
                  title="Refresh balance"
                >
                  {isRefreshing ? (
                    <div className="spinner"></div>
                  ) : (
                    <i className="bi bi-arrow-clockwise"></i>
                  )}
                </button>
                {!hasReceivedTopUp && (
                  <button
                    onClick={topUpBalances}
                    disabled={isRefreshingTopUp}
                    className="offcanvas-btn offcanvas-btn--topup"
                    title="Top up 5 ICP (one-time only)"
                  >
                    {isRefreshingTopUp ? (
                      <div className="spinner"></div>
                    ) : (
                      <i className="bi bi-plus-circle"></i>
                    )}
                  </button>
                )}
                {hasReceivedTopUp && (
                  <button
                    disabled={true}
                    className="offcanvas-btn offcanvas-btn--disabled"
                    title="Already received top-up"
                  >
                    <i className="bi bi-check-circle"></i>
                  </button>
                )}
              </div>
            </div>

            {/* User Actions */}
            <div className="user-actions">
              <h5>Quick Actions</h5>

              {/* Only show Create New Item button if user is authenticated */}
              {isAuthenticated && (
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    router.push('/create-item');
                  }} 
                  className="action-btn"
                >
                  <i className="bi bi-plus-circle"></i>
                  <span>Create New Item</span>
                </button>
              )}

              <button
                onClick={() => {
                  setIsOpen(false);
                  router.push('/profile');
                }}
                className="action-btn"
              >
                <i className="bi bi-person"></i>
                <span>My Profile</span>
              </button>

              <button 
                 onClick={() => {
                  setIsOpen(false);
                  router.push('/my-licenses');
                }}
                className="action-btn">
                <i className="bi bi-file-lock"></i>
                <span>My License</span>
              </button>{" "}


              <button onClick={handleLogout} className="action-btn logout-btn">
                <i className="bi bi-box-arrow-right"></i>
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Footer */}
          {/*<div className="offcanvas-info__footer">
            <p className="tertiary-text">Follow Us :</p>
            <div className="social">
              <Link
                href="https://www.facebook.com/"
                target="_blank"
                aria-label="share us on facebook"
                title="facebook"
              >
                <i className="bi bi-facebook"></i>
              </Link>
              <Link
                href="https://www.twitter.com/"
                target="_blank"
                aria-label="share us on twitter"
                title="twitter"
              >
                <i className="bi bi-twitter"></i>
              </Link>
              <Link
                href="https://www.linkedin.com/"
                target="_blank"
                aria-label="share us on pinterest"
                title="linkedin"
              >
                <i className="bi bi-linkedin"></i>
              </Link>
              <Link
                href="https://www.instagram.com/"
                target="_blank"
                aria-label="share us on instagram"
                title="instagram"
              >
                <i className="bi bi-instagram"></i>
              </Link>
            </div>
          </div>*/}
        </div>
        <button
          className="close-offcanvas-info"
          aria-label="close offcanvas info"
          onClick={() => setIsOpen(false)}
        >
          <i className="bi bi-x-lg"></i>
        </button>
      </div>
      <div
        className={
          "offcanvas-info-backdrop " +
          (isOpen ? " offcanvas-info-backdrop-active" : " ")
        }
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Custom Styles for User Profile */}
      <style jsx global>{`
        /* User Profile Header Styles */
        .user-profile-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-top: 1rem;
          padding: 1rem;
          background: linear-gradient(
            135deg,
            rgba(99, 102, 241, 0.1) 0%,
            rgba(168, 85, 247, 0.1) 100%
          );
          border-radius: 0.75rem;
          border: 1px solid rgba(99, 102, 241, 0.2);
        }

        .user-avatar i {
          font-size: 3rem;
          color: #6366f1;
        }

        .user-info h4 {
          color: #ffffff;
          margin: 0 0 0.5rem 0;
          font-size: 1.125rem;
          font-weight: 600;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .status-dot {
          width: 0.5rem;
          height: 0.5rem;
          background-color: #10b981;
          border-radius: 50%;
        }

        .status-text {
          color: #10b981;
          font-size: 0.875rem;
          font-weight: 500;
        }

        /* User Data Sections */
        .user-data-section {
          margin-bottom: 1.5rem;
        }

        .user-data-section h5 {
          color: #ffffff;
          margin-bottom: 0.75rem;
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .input-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .principal-display,
        .balance-display {
          flex: 1;
          padding: 20px 20px;
          background-color: rgba(31, 41, 55, 0.8);
          color: #e5e7eb;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-family: "Courier New", monospace;
          border: 1px solid rgba(75, 85, 99, 0.5);
        }

        .loading-indicator {
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .spinner {
          width: 1rem;
          height: 1rem;
          border: 2px solid rgba(156, 163, 175, 0.3);
          border-top: 2px solid #6366f1;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .spinner-balance {
          margin: 0;
          width: 0.75rem;
          height: 0.75rem;
          border: 2px solid rgba(156, 163, 175, 0.3);
          border-top: 2px solid #6366f1;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        /* Offcanvas Button Styles */
        .offcanvas-btn {
          padding: 0.75rem;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .offcanvas-btn--copy {
          background-color: #6366f1;
          color: #ffffff;
        }

        .offcanvas-btn--copy:hover {
          background-color: #4f46e5;
        }

        .offcanvas-btn--refresh {
          background-color: #6366f1;
          color: #ffffff;
        }

        .offcanvas-btn--refresh:hover:not(:disabled) {
          background-color: #4f46e5;
        }

        .offcanvas-btn--refresh:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .offcanvas-btn--topup {
          background-color: #10b981;
          color: #ffffff;
        }

        .offcanvas-btn--topup:hover:not(:disabled) {
          background-color: #059669;
        }

        .offcanvas-btn--topup:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .offcanvas-btn--disabled {
          background-color: #6b7280;
          color: #9ca3af;
          cursor: not-allowed;
        }

        .btn--disabled:disabled {
          cursor: not-allowed;
          background-color: red;
          color: #9ca3af;
        }

        /* User Actions */
        .user-actions {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(75, 85, 99, 0.3);
        }

        .user-actions h5 {
          color: #ffffff;
          margin-bottom: 1rem;
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .action-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          background-color: transparent;
          color: black;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-bottom: 0.5rem;
          text-align: left;
        }

        .action-btn span {
          color: black;
        }

        .action-btn:hover {
          background-color: rgba(99, 102, 241, 0.1);
          color: black;
        }

        .action-btn i {
          font-size: 1.125rem;
          width: 1.25rem;
          text-align: center;
        }

        .action-btn span {
          font-size: 0.875rem;
          font-weight: 500;
        }

        .logout-btn {
          color: #ef4444;
        }

        .logout-btn span {
          color: #ef4444;
        }

        .logout-btn:hover {
          background-color: rgba(239, 68, 68, 0.1);
          color: #dc2626;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
};

export default OffcanvasInfo;
