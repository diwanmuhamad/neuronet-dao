import { useState, useEffect } from "react";
import { AnonymousIdentity } from "@dfinity/agent";
import { getActor } from "../ic/agent";

export function useAnonymousWallet() {
  const [principal, setPrincipal] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [identity, setIdentity] = useState<AnonymousIdentity | null>(null);
  const [balance, setBalance] = useState<number>(0);

  const fetchBalance = async (identityToUse?: AnonymousIdentity) => {
    const identityToFetch = identityToUse || identity;
    if (!identityToFetch) {
      return;
    }
    try {
      const actor = await getActor(identityToFetch);
      const balanceResult = await actor.get_balance();

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

  useEffect(() => {
    // Check if we have a stored connection
    const storedPrincipal = localStorage.getItem("neuronet_principal");
    if (storedPrincipal) {
      setPrincipal(storedPrincipal);
      // Recreate the identity for stored principal
      const storedIdentity = new AnonymousIdentity();
      setIdentity(storedIdentity);
      // Fetch balance from backend
      fetchBalance(storedIdentity);
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connect = async () => {
    setLoading(true);
    try {
      // Use anonymous identity
      const newIdentity = new AnonymousIdentity();
      const actor = await getActor(newIdentity);

      // Get the principal from the anonymous identity
      const principalId = newIdentity.getPrincipal().toText();
      setPrincipal(principalId);
      setIdentity(newIdentity);

      // Register user and get initial balance
      try {
        await actor.register_user();
      } catch (error) {
        console.log("User already registered or registration failed:", error);
      }

      // Fetch balance after identity is set
      await fetchBalance(newIdentity);

      // Store in localStorage for persistence
      localStorage.setItem("neuronet_principal", principalId);
    } catch (error) {
      console.error("Failed to connect:", error);
      alert("Failed to connect to the network.");
    }
    setLoading(false);
  };

  const disconnect = () => {
    setPrincipal(null);
    setIdentity(null);
    setBalance(0);
    // Remove from localStorage
    localStorage.removeItem("neuronet_principal");
  };

  const refreshBalance = async () => {
    const storedPrincipal = localStorage.getItem("neuronet_principal");
    if (storedPrincipal) {
      // Recreate the identity for stored principal
      const storedIdentity = new AnonymousIdentity();
      // Fetch balance from backend
      await fetchBalance(storedIdentity);
    }
  };

  return {
    principal,
    connect,
    disconnect,
    loading,
    identity,
    balance,
    refreshBalance,
  };
}
