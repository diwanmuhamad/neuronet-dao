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

  console.log(`Creating agent with host: ${host}, network: ${network}`);

  const agent = new HttpAgent({
    host,
    identity: agentIdentity,
  });

  // Only fetch root key in development/local environment
  if (network !== "ic") {
    try {
      console.log("Fetching root key for local development...");
      await agent.fetchRootKey();
      console.log("Root key fetched successfully");
    } catch (error) {
      console.warn("Failed to fetch root key:", error);
    }
  }

  const canisterId =
    network === "ic"
      ? process.env.NEXT_PUBLIC_PROMPT_MARKETPLACE_CANISTER_ID ||
        canisterIds.prompt_marketplace
      : canisterIds.prompt_marketplace;

  console.log(`Using canister ID: ${canisterId}`);

  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
  });
};
