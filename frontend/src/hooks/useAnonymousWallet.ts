import { useState, useEffect } from "react";
import { AnonymousIdentity } from "@dfinity/agent";
import { getActor } from "../ic/agent";
import canisterIds from "../ic/canisterIds.json";

export function useAnonymousWallet() {
  const [principal, setPrincipal] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [identity, setIdentity] = useState<AnonymousIdentity | null>(null);
  const [balance, setBalance] = useState<number>(0);

  const fetchBalance = async (identityToUse?: AnonymousIdentity) => {
    const identityToFetch = identityToUse || identity;
    if (!identityToFetch) {
      console.log("No identity available for balance fetch");
      return;
    }
    try {
      console.log("Creating actor for balance fetch...");
      const actor = await getActor(identityToFetch);
      console.log("Actor created, calling get_balance...");
      const balanceResult = await actor.get_balance();
      console.log("Raw balance result:", balanceResult);
      console.log("Balance result type:", typeof balanceResult);
      console.log("Balance result keys:", Object.keys(balanceResult || {}));

      // Handle optional Nat return type (?Nat)
      if (
        balanceResult &&
        typeof balanceResult === "object" &&
        "0" in balanceResult
      ) {
        const balanceInE8s = Number(balanceResult[0]);
        const balanceInICP = balanceInE8s / 100_000_000;
        console.log(
          "Balance in e8s:",
          balanceInE8s,
          "Balance in ICP:",
          balanceInICP
        );
        setBalance(balanceInICP);
      } else {
        console.log("No balance returned or balance is null");
        console.log("Balance result:", balanceResult);
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
  }, []);

  const connect = async () => {
    setLoading(true);
    try {
      console.log("Starting connection process...");

      // Use anonymous identity
      const newIdentity = new AnonymousIdentity();
      const actor = await getActor(newIdentity);

      // Get the principal from the anonymous identity
      const principalId = newIdentity.getPrincipal().toText();
      console.log("Principal ID:", principalId);
      setPrincipal(principalId);
      setIdentity(newIdentity);

      // Register user and get initial balance
      try {
        console.log("Attempting to register user...");
        const registerResult = await actor.register_user();
        console.log("Register result:", registerResult);
      } catch (error) {
        console.log("User already registered or registration failed:", error);
      }

      // Fetch balance after identity is set
      console.log("Fetching balance after setting identity...");
      await fetchBalance(newIdentity);

      // Store in localStorage for persistence
      localStorage.setItem("neuronet_principal", principalId);

      console.log("Connected with anonymous identity:", principalId);
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
