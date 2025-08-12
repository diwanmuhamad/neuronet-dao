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
  actor: any;
  balance: number;
  refreshBalance: () => Promise<void>;
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
  const [actor, setActor] = useState<any>(null);
  const [balance, setBalance] = useState<number>(0);

  // Determine the correct Identity Provider URL based on environment
  const getIdentityProvider = () => {
    const network = process.env.NEXT_PUBLIC_DFX_NETWORK || "local";
    if (network === "ic") {
      return "https://identity.ic0.app";
    } else {
      // Local development
      return `http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943`;
    }
  };

  const fetchBalance = async (actorToUse?: any) => {
    const currentActor = actorToUse || actor;
    if (!currentActor || !isAuthenticated) {
      return;
    }

    try {
      console.log("Fetching balance...");
      const balanceResult = await currentActor.get_balance();
      console.log("Balance result:", balanceResult);

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
      console.log("Starting actor update...");
      const currentIdentity = client.getIdentity();
      const newActor = await getActor(currentIdentity);
      const authenticated = await client.isAuthenticated();

      console.log("Authentication check result:", authenticated);
      console.log(
        "Identity principal:",
        currentIdentity.getPrincipal().toText(),
      );

      setIdentity(currentIdentity);
      setActor(newActor);
      setIsAuthenticated(authenticated);

      if (authenticated) {
        const principalText = currentIdentity.getPrincipal().toText();
        setPrincipal(principalText);
        console.log("User authenticated with principal:", principalText);

        // Try to register user (will fail silently if already registered)
        try {
          console.log("Attempting to register user...");
          await newActor.register_user();
          console.log("User registered successfully");
        } catch (error) {
          console.log("User already registered or registration failed:", error);
        }

        // Fetch balance
        console.log("Fetching user balance...");
        await fetchBalance(newActor);
      } else {
        setPrincipal(null);
        setBalance(0);
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
      } catch (error) {
        console.error("Failed to initialize auth client:", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
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
          console.log("Login successful, updating actor...");
          try {
            await updateActor();
            console.log("Actor updated successfully after login");
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
      await authClient.logout();
      setIsAuthenticated(false);
      setPrincipal(null);
      setIdentity(null);
      setBalance(0);
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

  const value: AuthContextType = {
    isAuthenticated,
    principal,
    identity,
    login,
    logout,
    loading,
    actor,
    balance,
    refreshBalance,
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
