import { HttpAgent, Actor } from "@dfinity/agent";
import { idlFactory } from "./prompt_marketplace.did";
import canisterIds from "./canisterIds.json";

export const getActor = (principalId?: string) => {
  const agent = new HttpAgent({
    host: "http://localhost:4943", // Change to mainnet if needed
    identity: undefined, // For Plug, identity is managed by the wallet
  });
  // Optionally fetch root key for local
  if (process.env.NODE_ENV !== "production") {
    agent.fetchRootKey?.();
  }
  return Actor.createActor(idlFactory, {
    agent,
    canisterId: canisterIds.prompt_marketplace,
  });
};
