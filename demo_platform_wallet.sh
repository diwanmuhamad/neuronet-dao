#!/bin/bash

# Demo: Platform Wallet Management
echo "🎯 Platform Wallet Demo"
echo "======================="

# Check if dfx is running
if ! dfx ping; then
    echo "❌ dfx is not running. Please start dfx first."
    exit 1
fi

echo ""
echo "1️⃣  Current Status:"
echo "-------------------"
./check_platform_wallet.sh

echo ""
echo "2️⃣  Your Identity Principal:"
echo "---------------------------"
MY_PRINCIPAL=$(dfx identity get-principal)
echo "   $MY_PRINCIPAL"

echo ""
echo "3️⃣  Set Platform Wallet to Your Identity:"
echo "----------------------------------------"
echo "   Running: dfx canister call prompt_marketplace set_platform_wallet '(principal \"$MY_PRINCIPAL\")'"
dfx canister call prompt_marketplace set_platform_wallet "(principal \"$MY_PRINCIPAL\")"

echo ""
echo "4️⃣  Verify the Change:"
echo "---------------------"
PLATFORM_WALLET=$(dfx canister call prompt_marketplace get_platform_wallet)
echo "   Platform Wallet: $PLATFORM_WALLET"

echo ""
echo "✅ Demo Complete!"
echo ""
echo "💡 Now all platform fees (5%) will go to your identity principal:"
echo "   $MY_PRINCIPAL"
