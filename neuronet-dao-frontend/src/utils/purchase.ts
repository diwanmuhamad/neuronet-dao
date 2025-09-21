"use client";

import { getActor, getLedgerActor } from "@/src/ic/agent";

export interface PurchaseContext {
  identity: any | null;
  principal: string | null;
  icpBalance: number; // in ICP
  refreshICPBalance: () => Promise<void>;
}

export interface PurchaseResult {
  ok: boolean;
  message?: string;
}

export async function buyItemById(ctx: PurchaseContext, itemId: number): Promise<PurchaseResult> {
  try {
    const { identity, principal, icpBalance, refreshICPBalance } = ctx;

    if (!principal) {
      return { ok: false, message: "Connect your wallet first before buying items" };
    }

    const actor = await getActor(identity || undefined);

    // Load item detail for accurate data (owner, price)
    const result: any = await actor.get_item_detail(itemId);
    const itemDetail = result?.length > 0 ? result[0] : null;
    if (!itemDetail) {
      return { ok: false, message: "Item not found." };
    }

    const ownerText = itemDetail?.owner?.toText ? itemDetail.owner.toText() : itemDetail.owner;
    if (ownerText && ownerText === principal) {
      return { ok: false, message: "You cannot buy your own item." };
    }

    // Transfer fee in e8s and ICP
    const feeInE8s = (await actor.get_transfer_fee()) as bigint;
    const feeInICP = Number(feeInE8s) / 100_000_000;

    const rawPrice: unknown = itemDetail.price;
    const itemPriceE8s: bigint =
      typeof rawPrice === "bigint" ? rawPrice : BigInt((rawPrice as number).toString());
    const itemPriceICP = Number(itemPriceE8s) / 100_000_000;

    const totalCostICP = itemPriceICP + feeInICP;
    if (icpBalance < totalCostICP) {
      return {
        ok: false,
        message: `Insufficient ICP. Need ${totalCostICP.toFixed(4)} ICP, have ${icpBalance.toFixed(4)} ICP.`,
      };
    }

    const canisterPrincipal = await actor.get_canister_principal();
    const ledgerCanisterId =
      process.env.NEXT_PUBLIC_ICP_LEDGER_CANISTER_ID || "bkyz2-fmaaa-aaaaa-qaaaq-cai";
    const ledger = await getLedgerActor(ledgerCanisterId, identity || undefined);

    const totalAmountE8s = itemPriceE8s + feeInE8s;
    const transferArgs = {
      from_subaccount: [],
      to: { owner: canisterPrincipal, subaccount: [] },
      amount: totalAmountE8s,
      fee: [feeInE8s],
      memo: [],
      created_at_time: [],
    } as const;

    const transferResult = await (ledger as any).icrc1_transfer(transferArgs);
    if (!(transferResult && "Ok" in transferResult)) {
      return { ok: false, message: "Ledger transfer failed." };
    }

    const finalize = await actor.finalize_purchase(itemId);
    if (!(finalize && typeof finalize === "object" && "ok" in finalize)) {
      const error = finalize && typeof finalize === "object" && "err" in finalize ? finalize.err : "Unknown";
      return { ok: false, message: `Purchase finalize failed: ${error}` };
    }

    await refreshICPBalance();
    return { ok: true, message: "Item purchased successfully!" };
  } catch (e: any) {
    console.error("buyItemById error", e);
    return { ok: false, message: "Failed to purchase item." };
  }
}


