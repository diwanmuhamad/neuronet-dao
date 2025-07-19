import { useState, useEffect } from "react";
import { AnonymousIdentity } from "@dfinity/agent";
import { getActor } from "../ic/agent";
import canisterIds from "../ic/canisterIds.json";

export function useAnonymousWallet() {
  const [principal, setPrincipal] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [identity, setIdentity] = useState<AnonymousIdentity | null>(null);

  useEffect(() => {
    // Check if we have a stored connection
    const storedPrincipal = localStorage.getItem("neuronet_principal");
    if (storedPrincipal) {
      setPrincipal(storedPrincipal);
      // Recreate the identity for stored principal
      const storedIdentity = new AnonymousIdentity();
      setIdentity(storedIdentity);
    }
    setLoading(false);
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
    // Remove from localStorage
    localStorage.removeItem("neuronet_principal");
  };

  return { principal, connect, disconnect, loading, identity };
}
