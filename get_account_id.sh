#!/bin/bash

# Get Account ID for ICP Ledger
echo "🔍 ICP Account ID Helper"
echo "======================="

# Check if dfx is running
if ! dfx ping; then
    echo "❌ dfx is not running. Please start dfx first."
    exit 1
fi

echo ""
echo "📊 Your Account Information:"
echo "============================"

# Get current identity
echo "👤 Current Identity:"
CURRENT_IDENTITY=$(dfx identity whoami)
echo "   $CURRENT_IDENTITY"

# Get principal
echo ""
echo "🔑 Your Principal:"
PRINCIPAL=$(dfx identity get-principal)
echo "   $PRINCIPAL"

# Get account ID
echo ""
echo "💰 Your Account ID:"
ACCOUNT_ID=$(dfx ledger account-id)
echo "   $ACCOUNT_ID"

echo ""
echo "📝 For Production Use:"
echo "====================="
echo "• Use this account ID in your platform wallet configuration"
echo "• This is the proper ICP account identifier for mainnet"
echo ""
echo "💡 Commands:"
echo "• Get account ID: dfx ledger account-id"
echo "• Get account ID for specific principal: dfx ledger account-id --of-principal <principal>"
echo "• Get principal: dfx identity get-principal"
echo "• Switch identity: dfx identity use <identity_name>"
echo ""
echo "⚠️  Note: Account IDs are different for each identity!"
