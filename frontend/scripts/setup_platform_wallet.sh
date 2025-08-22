#!/bin/bash

# Setup: Platform Wallet Management with Network Option
echo "🎯 Platform Wallet Setup"
echo "======================="

# Default network is local unless specified
NETWORK=${1:-local}

# Check if dfx is running for that network
if ! dfx ping --network "$NETWORK" >/dev/null 2>&1; then
    echo "❌ dfx is not reachable on network: $NETWORK"
    echo "👉 Try: dfx start (for local) or check your Internet connection (for ic)"
    exit 1
fi

echo ""
echo "1️⃣  Current Status:"
echo "-------------------"
./check_platform_wallet.sh "$NETWORK"

echo ""
echo "2️⃣  Your Identity Principal:"
echo "---------------------------"
MY_PRINCIPAL=$(dfx identity get-principal --network "$NETWORK")
echo "   $MY_PRINCIPAL"

echo ""
echo "3️⃣  Set Platform Wallet to Your Identity:"
echo "----------------------------------------"
echo "   Running: dfx canister call --network $NETWORK prompt_marketplace set_platform_wallet '(principal \"$MY_PRINCIPAL\")'"
dfx canister call --network "$NETWORK" prompt_marketplace set_platform_wallet "(principal \"$MY_PRINCIPAL\")"

echo ""
echo "4️⃣  Verify the Change:"
echo "---------------------"
PLATFORM_WALLET=$(dfx canister call --network "$NETWORK" prompt_marketplace get_platform_wallet)
echo "   Platform Wallet: $PLATFORM_WALLET"

echo ""
echo "✅ Setup Complete!"
echo ""
echo "💡 Now all platform fees (5%) will go to your identity principal:"
echo "   $MY_PRINCIPAL"