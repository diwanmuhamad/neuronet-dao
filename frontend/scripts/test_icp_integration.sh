#!/bin/bash

# Test ICP Ledger Integration (Local or Mainnet)
echo "🧪 Testing ICP Ledger Integration..."

# Default network is local unless specified
NETWORK=${1:-local}

# Check if dfx is running for that network
if ! dfx ping "$NETWORK" >/dev/null 2>&1; then
    echo "❌ dfx is not reachable on network: $NETWORK"
    echo "👉 Try: dfx start (for local) or check your Internet connection (for ic)"
    exit 1
fi

# Test 1: Check ICP balance
echo "📊 Testing ICP balance retrieval..."
BALANCE=$(dfx canister call prompt_marketplace get_icp_balance --network "$NETWORK")
echo "ICP Balance: $BALANCE"

# Test 2: Check ledger canister
echo "🔗 Testing ledger canister..."
LEDGER_ID=$(dfx canister id icp_ledger_canister --network "$NETWORK")
LEDGER_NAME=$(dfx canister call "$LEDGER_ID" name --network "$NETWORK")
echo "Ledger Name: $LEDGER_NAME"

# Test 3: Check ledger symbol
echo "🏷️ Testing ledger symbol..."
LEDGER_SYMBOL=$(dfx canister call "$LEDGER_ID" symbol --network "$NETWORK")
echo "Ledger Symbol: $LEDGER_SYMBOL"

# Test 4: Check account balance
echo "💰 Testing account balance..."
ACCOUNT_BALANCE=$(dfx canister call prompt_marketplace get_icp_balance --network "$NETWORK")
echo "Account Balance: $ACCOUNT_BALANCE"

echo "✅ ICP Ledger Integration tests completed! (Network: $NETWORK)"
echo ""
echo "Next steps:"
echo "1. Start the frontend: cd frontend && npm run dev"
echo "2. Connect your wallet"
echo "3. Test purchasing items with ICP"