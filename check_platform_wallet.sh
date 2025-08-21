#!/bin/bash

# Check and manage platform wallet
echo "🔍 Platform Wallet Management"

# Check if dfx is running
if ! dfx ping; then
    echo "❌ dfx is not running. Please start dfx first."
    exit 1
fi

echo ""
echo "📊 Current Platform Wallet Status:"
echo "=================================="

# Get canister principal
echo "🏗️  Canister Principal:"
CANISTER_PRINCIPAL=$(dfx canister call prompt_marketplace get_canister_principal)
echo "   $CANISTER_PRINCIPAL"

# Get current platform wallet
echo ""
echo "💰 Current Platform Wallet:"
PLATFORM_WALLET=$(dfx canister call prompt_marketplace get_platform_wallet)
echo "   $PLATFORM_WALLET"

# Check if platform wallet is set
if [[ "$PLATFORM_WALLET" == *"null"* ]]; then
    echo "   ⚠️  No platform wallet set - using canister principal as default"
    echo ""
    echo "💡 To set a platform wallet, use:"
    echo "   dfx canister call prompt_marketplace set_platform_wallet '(principal \"YOUR_PRINCIPAL_ID\")'"
    echo ""
    echo "📝 Example:"
    echo "   dfx canister call prompt_marketplace set_platform_wallet '(principal \"$(dfx identity get-principal)\")'"
else
    echo "   ✅ Platform wallet is set"
fi

echo ""
echo "🔧 Available Commands:"
echo "======================"
echo "• Check platform wallet:"
echo "  dfx canister call prompt_marketplace get_platform_wallet"
echo ""
echo "• Set platform wallet:"
echo "  dfx canister call prompt_marketplace set_platform_wallet '(principal \"YOUR_PRINCIPAL_ID\")'"
echo ""
echo "• Get canister principal:"
echo "  dfx canister call prompt_marketplace get_canister_principal"
echo ""
echo "• Check your identity principal:"
echo "  dfx identity get-principal"
echo ""
echo "• Check ledger balance of platform wallet:"
echo "  # First check if platform wallet is set, then check balance"
echo "  dfx canister call prompt_marketplace get_icp_balance"
