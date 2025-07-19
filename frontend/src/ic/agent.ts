import { HttpAgent, Actor, Identity, AnonymousIdentity } from "@dfinity/agent";
import { idlFactory } from "./prompt_marketplace.did";
import canisterIds from "./canisterIds.json";

export const getActor = async (identity?: Identity) => {
  // Use provided identity or create anonymous identity
  const agentIdentity = identity || new AnonymousIdentity();

  const agent = await HttpAgent.create({
    host: "http://localhost:4943", // Local DFINITY replica
    identity: agentIdentity,
  });

  // Fetch root key for local development
  agent.fetchRootKey?.();

  return Actor.createActor(idlFactory, {
    agent,
    canisterId: canisterIds.prompt_marketplace,
  });
};
