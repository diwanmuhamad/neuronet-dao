import { HttpAgent, Actor, Identity, AnonymousIdentity } from "@dfinity/agent";
import { idlFactory } from "./prompt_marketplace.did";
import canisterIds from "./canisterIds.json";

export const getActor = async (identity?: Identity) => {
  // Use provided identity or create anonymous identity
  const agentIdentity = identity || new AnonymousIdentity();

  const host = process.env.NEXT_PUBLIC_DFX_HOST || "http://127.0.0.1:4943";

  const agent = new HttpAgent({
    host,
    identity: agentIdentity,
  });

  // Only fetch root key in development
  if (
    process.env.NODE_ENV === "development" ||
    host.includes("127.0.0.1") ||
    host.includes("localhost")
  ) {
    try {
      await agent.fetchRootKey();
    } catch (error) {
      console.warn("Failed to fetch root key:", error);
    }
  }

  return Actor.createActor(idlFactory, {
    agent,
    canisterId: canisterIds.prompt_marketplace,
  });
};
