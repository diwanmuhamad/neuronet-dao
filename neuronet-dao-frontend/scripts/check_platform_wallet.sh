#!/bin/bash

# ===========================
# Platform Wallet Management
# ===========================

# Default network is local unless specified
NETWORK=${1:-local}

echo "🔍 Platform Wallet Management on [$NETWORK]"

# Check if dfx is running (only for local)
if [ "$NETWORK" = "local" ]; then
    if ! dfx ping &>/dev/null; then
        echo "❌ dfx is not running locally. Please run 'dfx start' first."
        exit 1
    fi
fi

echo ""
echo "📊 Current Platform Wallet Status:"
echo "=================================="

# Get canister principal
echo "🏗️  Canister Principal:"
CANISTER_PRINCIPAL=$(dfx canister call prompt_marketplace get_canister_principal --network "$NETWORK")
echo "   $CANISTER_PRINCIPAL"

# Get current platform wallet
echo ""
echo "💰 Current Platform Wallet:"
PLATFORM_WALLET=$(dfx canister call prompt_marketplace get_platform_wallet --network "$NETWORK")
echo "   $PLATFORM_WALLET"

# Check if platform wallet is set
if [[ "$PLATFORM_WALLET" == *"null"* ]]; then
    echo "   ⚠️  No platform wallet set - using canister principal as default"
    echo ""
    echo "💡 To set a platform wallet, use:"
    echo "   dfx canister call prompt_marketplace set_platform_wallet '(principal \"YOUR_PRINCIPAL_ID\")' --network $NETWORK"
    echo ""
    echo "📝 Example:"
    echo "   dfx canister call prompt_marketplace set_platform_wallet '(principal \"$(dfx identity get-principal)\")' --network $NETWORK"
else
    echo "   ✅ Platform wallet is set"
fi

echo ""
echo "🔧 Available Commands:"
echo "======================"
echo "• Check platform wallet:"
echo "  dfx canister call prompt_marketplace get_platform_wallet --network $NETWORK"
echo ""
echo "• Set platform wallet:"
echo "  dfx canister call prompt_marketplace set_platform_wallet '(principal \"YOUR_PRINCIPAL_ID\")' --network $NETWORK"
echo ""
echo "• Get canister principal:"
echo "  dfx canister call prompt_marketplace get_canister_principal --network $NETWORK"
echo ""
echo "• Check your identity principal:"
echo "  dfx identity get-principal"
echo ""
echo "• Check ledger balance of platform wallet:"
echo "  dfx canister call prompt_marketplace get_icp_balance --network $NETWORK"