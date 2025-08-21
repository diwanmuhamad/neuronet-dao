import { HttpAgent, Actor, Identity, AnonymousIdentity } from "@dfinity/agent";
import { idlFactory } from "./prompt_marketplace.did";
import canisterIds from "./canisterIds.json";

export const getActor = async (identity?: Identity) => {
  // Use provided identity or create anonymous identity
  const agentIdentity = identity || new AnonymousIdentity();

  // Determine host based on environment
  const network = process.env.NEXT_PUBLIC_DFX_NETWORK || "local";
  const host =
    network === "ic"
      ? "https://ic0.app"
      : process.env.NEXT_PUBLIC_DFX_HOST || "http://127.0.0.1:4943";

  const agent = new HttpAgent({
    host,
    identity: agentIdentity,
  });

  // Only fetch root key in development/local environment
  if (network !== "ic") {
    try {
      await agent.fetchRootKey();
    } catch (error) {
      console.warn("Failed to fetch root key:", error);
    }
  }

  const canisterId =
    process.env.NEXT_PUBLIC_PROMPT_MARKETPLACE_CANISTER_ID ||
    canisterIds.prompt_marketplace;

  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
  });
};
