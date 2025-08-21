#!/bin/bash

# Test ICP Ledger Integration
echo "🧪 Testing ICP Ledger Integration..."

# Check if dfx is running
if ! dfx ping; then
    echo "❌ dfx is not running. Please start dfx first."
    exit 1
fi

# Test 1: Check ICP balance
echo "📊 Testing ICP balance retrieval..."
BALANCE=$(dfx canister call prompt_marketplace get_icp_balance)
echo "ICP Balance: $BALANCE"

# Test 2: Check ledger canister
echo "🔗 Testing ledger canister..."
LEDGER_NAME=$(dfx canister call ryjl3-tyaaa-aaaaa-aaaba-cai name)
echo "Ledger Name: $LEDGER_NAME"

# Test 3: Check ledger symbol
echo "🏷️ Testing ledger symbol..."
LEDGER_SYMBOL=$(dfx canister call ryjl3-tyaaa-aaaaa-aaaba-cai symbol)
echo "Ledger Symbol: $LEDGER_SYMBOL"

# Test 4: Check account balance
echo "💰 Testing account balance..."
ACCOUNT_BALANCE=$(dfx ledger balance)
echo "Account Balance: $ACCOUNT_BALANCE"

echo "✅ ICP Ledger Integration tests completed!"
echo ""
echo "Next steps:"
echo "1. Start the frontend: cd frontend && npm run dev"
echo "2. Connect your wallet"
echo "3. Test purchasing items with ICP"
