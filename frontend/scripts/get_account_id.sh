#!/bin/bash

# Get Account ID for ICP Ledger (Local or Mainnet)
echo "🔍 ICP Account ID Helper"
echo "======================="

# Default network is local unless specified
NETWORK=${1:-local}

# Check if dfx is running for that network
if ! dfx ping "$NETWORK" >/dev/null 2>&1; then
    echo "❌ dfx is not reachable on network: $NETWORK"
    echo "👉 Try: dfx start (for local) or check your Internet connection (for ic)"
    exit 1
fi

echo ""
echo "📊 Your Account Information (Network: $NETWORK):"
echo "==============================================="

# Get current identity
echo "👤 Current Identity:"
CURRENT_IDENTITY=$(dfx identity whoami --network "$NETWORK")
echo "   $CURRENT_IDENTITY"

# Get principal
echo ""
echo "🔑 Your Principal:"
PRINCIPAL=$(dfx identity get-principal --network "$NETWORK")
echo "   $PRINCIPAL"

# Get account ID
echo ""
echo "💰 Your Account ID:"
ACCOUNT_ID=$(dfx ledger account-id --network "$NETWORK")
echo "   $ACCOUNT_ID"

echo ""
echo "📝 For Production Use:"
echo "====================="
echo "• Use this account ID in your platform wallet configuration"
echo "• This is the proper ICP account identifier for the selected network ($NETWORK)"
echo ""
echo "💡 Commands:"
echo "• Get account ID: dfx ledger account-id --network $NETWORK"
echo "• Get account ID for specific principal: dfx ledger account-id --of-principal <principal> --network $NETWORK"
echo "• Get principal: dfx identity get-principal --network $NETWORK"
echo "• Switch identity: dfx identity use <identity_name>"
echo ""
echo "⚠️  Note: Account IDs are different for each identity!"