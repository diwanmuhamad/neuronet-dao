import { useState, useEffect } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { Identity } from "@dfinity/agent";
import { getActor } from "../ic/agent";

interface UseInternetIdentityReturn {
  isAuthenticated: boolean;
  principal: string | null;
  identity: Identity | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actor: any;
  balance: number;
  refreshBalance: () => Promise<void>;
  whoami: () => Promise<string>;
}

export const useInternetIdentity = (): UseInternetIdentityReturn => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [principal, setPrincipal] = useState<string | null>(null);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [actor, setActor] = useState<any>(null);
  const [balance, setBalance] = useState<number>(0);

  // Determine the correct Identity Provider URL based on environment
  const getIdentityProvider = () => {
    const network = process.env.NEXT_PUBLIC_DFX_NETWORK || "local";
    const host = process.env.NEXT_PUBLIC_DFX_HOST || "http://127.0.0.1:4943";
    const canisterId = process.env.NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID || "rdmx6-jaaaa-aaaaa-aaadq-cai";

    if (network === "ic") {
      return "https://identity.ic0.app";
    } else {
      // For local development, check if using localhost or .localhost
      if (host.includes("localhost:4943")) {
        return `http://${canisterId}.localhost:4943`;
      } else {
        return `http://localhost:4943?canisterId=${canisterId}`;
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fetchBalance = async (actorToUse?: any) => {
    const currentActor = actorToUse || actor;
    if (!currentActor || !isAuthenticated) {
      return;
    }

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
      } else {
        setBalance(0);
      }
    } catch (error) {
      console.error("Failed to fetch balance:", error);
      setBalance(0);
    }
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
          console.error(
            "User already registered or registration failed:",
            error,
          );
        }

        // Fetch balance
        await fetchBalance(newActor);
      } else {
        setPrincipal(null);
        setBalance(0);
      }
    } catch (error) {
      console.error("Error updating actor:", error);
    }
  };

  // Initialize auth client on hook mount
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
      } catch (error) {
        console.error("Failed to initialize auth client:", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async () => {
    if (!authClient) {
      console.error("Auth client not initialized");
      return;
    }

    setLoading(true);
    try {
      const identityProvider = getIdentityProvider();

      await authClient.login({
        identityProvider,
        onSuccess: async () => {
          await updateActor();
          setLoading(false);
        },
        onError: (error) => {
          console.error("Login failed:", error);
          setLoading(false);
        },
        // Request delegation for 7 days
        maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000),
        // Allow the identity provider to be opened in a new window
        windowOpenerFeatures:
          "toolbar=0,location=0,menubar=0,width=500,height=500,left=100,top=100",
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
      await authClient.logout();
      setIsAuthenticated(false);
      setPrincipal(null);
      setIdentity(null);
      setBalance(0);

      // Update actor with anonymous identity
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

  const whoami = async (): Promise<string> => {
    if (!actor) {
      throw new Error("Actor not initialized");
    }

    try {
      // Assuming your backend has a whoami method
      const result = await actor.whoami();
      return result.toString();
    } catch (error) {
      console.error("Whoami error:", error);
      throw error;
    }
  };

  return {
    isAuthenticated,
    principal,
    identity,
    login,
    logout,
    loading,
    actor,
    balance,
    refreshBalance,
    whoami,
  };
};
