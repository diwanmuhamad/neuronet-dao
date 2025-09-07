"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { AuthClient } from "@dfinity/auth-client";
import { Identity } from "@dfinity/agent";
import { getActor } from "../ic/agent";

interface AuthContextType {
  isAuthenticated: boolean;
  principal: string | null;
  identity: Identity | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actor: any;
  balance: number;
  icpBalance: number;
  balanceLoading: boolean;
  refreshBalance: () => Promise<void>;
  refreshICPBalance: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [principal, setPrincipal] = useState<string | null>(null);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [actor, setActor] = useState<any>(null);
  const [balance, setBalance] = useState<number>(() => {
    // Initialize balance from localStorage if available
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("user_balance");
      return saved ? parseFloat(saved) : 0;
    }
    return 0;
  });
  const [icpBalance, setICPBalance] = useState<number>(0);
  const [balanceRefreshInterval, setBalanceRefreshInterval] =
    useState<NodeJS.Timeout | null>(null);
  const [balanceLoading, setBalanceLoading] = useState<boolean>(false);

  // Determine the correct Identity Provider URL based on environment
  const getIdentityProvider = () => {
    const network = process.env.NEXT_PUBLIC_DFX_NETWORK || "local";
    const canisterId = process.env.NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID || "rdmx6-jaaaa-aaaaa-aaadq-cai";

    if (network === "ic") {
      return "https://identity.ic0.app";
    } else {
      // Local development
      return `http://${canisterId}.localhost:4943`;
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fetchBalance = async (actorToUse?: any) => {
    const currentActor = actorToUse || actor;
    if (!currentActor) {
      return;
    }

    setBalanceLoading(true);
    try {
      const balanceResult = await currentActor.get_balance();

      // Handle optional Nat return type (?Nat)
      if (
        balanceResult &&
        typeof balanceResult === "object" &&
        "0" in balanceResult
      ) {
        const balanceInE8s = Number(balanceResult[0]);
        const balanceInICP = balanceInE8s / 100_000_000;
        setBalance(balanceInICP);
        // Persist balance to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("user_balance", balanceInICP.toString());
        }
      } else {
        setBalance(0);
        if (typeof window !== "undefined") {
          localStorage.setItem("user_balance", "0");
        }
      }
    } catch (error) {
      console.error("Failed to fetch balance:", error);
      // Don't reset balance to 0 on error, keep the previous value
    } finally {
      setBalanceLoading(false);
    }
  };

  // Fetch ICP balance from ledger
  const fetchICPBalance = async (principalToUse?: string, actorToUse?: any) => {
    const currentActor = actorToUse || actor;
    const currentPrincipal = principalToUse || principal;

    if (!currentActor || !isAuthenticated || !currentPrincipal) {
      console.log("Cannot fetch ICP balance:", {
        hasActor: !!currentActor,
        isAuthenticated,
        hasPrincipal: !!currentPrincipal
      });
      return;
    }

    try {
      console.log("Fetching ICP balance for principal:", currentPrincipal);
      const icpBalanceResult = await currentActor.get_user_icp_balance(currentPrincipal);
      const balanceInE8s = Number(icpBalanceResult);
      const balanceInICP = balanceInE8s / 100_000_000;
      console.log("ICP balance fetched:", balanceInICP);
      setICPBalance(balanceInICP);
    } catch (error) {
      console.error("Failed to fetch ICP balance:", error);
      // Don't reset balance on error, keep the previous value
    }
  };

  const refreshICPBalance = async () => {
    await fetchICPBalance();
  };

  const updateActor = async (authClientInstance?: AuthClient) => {
    const client = authClientInstance || authClient;
    if (!client) return;

    try {
      const currentIdentity = client.getIdentity();
      const newActor = await getActor(currentIdentity);
      const authenticated = await client.isAuthenticated();

      setIdentity(currentIdentity);
      setActor(newActor);
      setIsAuthenticated(authenticated);

      if (authenticated) {
        const principalText = currentIdentity.getPrincipal().toText();
        setPrincipal(principalText);

        // Try to register user (will fail silently if already registered)
        try {
          await newActor.register_user();
        } catch (error) {
          console.log("User already registered or registration failed:", error);
        }

        // Fetch balance with a small delay to ensure actor is ready
        setTimeout(async () => {
          await fetchBalance(newActor);
          await fetchICPBalance(principalText, newActor);
        }, 500);

        // Start automatic balance refresh when authenticated
        startBalanceRefresh();
      } else {
        setPrincipal(null);
        // Don't reset balance immediately, only when explicitly logging out

        // Stop automatic balance refresh when not authenticated
        stopBalanceRefresh();
        console.log("User not authenticated, clearing state");
      }
    } catch (error) {
      console.error("Error updating actor:", error);
    }
  };

  // Initialize auth client on component mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const client = await AuthClient.create({
          idleOptions: {
            idleTimeout: 1000 * 60 * 30, // 30 minutes
            disableDefaultIdleCallback: true,
          },
        });

        setAuthClient(client);
        await updateActor(client);

        // If user is authenticated after init, fetch balance with a small delay
        if (await client.isAuthenticated()) {
          setTimeout(async () => {
            const identity = client.getIdentity();
            const actor = await getActor(identity);
            const principalText = identity.getPrincipal().toText();
            await fetchBalance(actor);
            await fetchICPBalance(principalText, actor);
          }, 1000); // 1 second delay to ensure everything is ready
        }
      } catch (error) {
        console.error("Failed to initialize auth client:", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Cleanup interval on unmount
    return () => {
      stopBalanceRefresh();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Add effect to monitor authentication state changes
  useEffect(() => {
    console.log("Auth state changed:", {
      isAuthenticated,
      principal,
      loading,
      hasActor: !!actor,
    });
  }, [isAuthenticated, principal, loading, actor]);

  // Add effect to fetch balances when principal and actor are ready
  useEffect(() => {
    if (isAuthenticated && principal && actor && !loading) {
      console.log("Fetching balances on state change");
      fetchICPBalance(principal, actor);
    }
  }, [isAuthenticated, principal, actor, loading]);

  const login = async () => {
    if (!authClient) {
      console.error("Auth client not initialized");
      return;
    }

    setLoading(true);
    try {
      await authClient.login({
        identityProvider: getIdentityProvider(),
        onSuccess: async () => {
          try {
            await updateActor();
          } catch (error) {
            console.error("Error updating actor after login:", error);
          } finally {
            setLoading(false);
          }
        },
        onError: (error) => {
          console.error("Login failed:", error);
          setLoading(false);
        },
        // Request delegation for 7 days
        maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000),
      });
    } catch (error) {
      console.error("Login error:", error);
      setLoading(false);
    }
  };

  const logout = async () => {
    if (!authClient) {
      console.error("Auth client not initialized");
      return;
    }

    setLoading(true);
    try {
      // Stop automatic balance refresh
      stopBalanceRefresh();

      await authClient.logout();
      setIsAuthenticated(false);
      setPrincipal(null);
      setIdentity(null);
      setBalance(0); // Only reset balance on explicit logout
      setICPBalance(0); // Reset ICP balance on logout
      // Clear balance from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("user_balance");
      }
      await updateActor();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshBalance = async () => {
    await fetchBalance();
  };

  // Start automatic balance refresh every 10 seconds
  const startBalanceRefresh = () => {
    // Clear existing interval if any
    stopBalanceRefresh();

    if (isAuthenticated && actor) {
      // Fetch balance immediately when starting auto-refresh
      if (!balanceLoading) {
        fetchBalance();
        if (isAuthenticated && principal) {
          fetchICPBalance(principal, actor);
        }
      }

      const interval = setInterval(async () => {
        if (isAuthenticated && actor && !balanceLoading && principal) {
          await fetchBalance();
          await fetchICPBalance(principal, actor);
        }
      }, 10000); // Refresh every 10 seconds

      setBalanceRefreshInterval(interval);
    }
  };

  // Stop automatic balance refresh
  const stopBalanceRefresh = () => {
    if (balanceRefreshInterval) {
      clearInterval(balanceRefreshInterval);
      setBalanceRefreshInterval(null);
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    principal,
    identity,
    login,
    logout,
    loading,
    actor,
    balance,
    icpBalance,
    balanceLoading,
    refreshBalance,
    refreshICPBalance,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
