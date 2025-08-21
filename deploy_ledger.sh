#!/bin/bash

# Deploy ICP Ledger locally
# This script sets up a local ICP ledger for development

echo "🚀 Setting up local ICP Ledger..."

# Start dfx if not running
if ! dfx ping; then
    echo "Starting dfx..."
    dfx start --clean --background
    sleep 5
fi

# Create minter identity
echo "Creating minter identity..."
dfx identity new minter --disable-encryption || true
dfx identity use minter
export MINTER_ACCOUNT_ID=$(dfx ledger account-id)

# Switch back to default identity
dfx identity use default
export DEFAULT_ACCOUNT_ID=$(dfx ledger account-id)

echo "Minter Account ID: $MINTER_ACCOUNT_ID"
echo "Default Account ID: $DEFAULT_ACCOUNT_ID"

# Deploy the ICP ledger canister
echo "Deploying ICP ledger canister..."
dfx deploy --specified-id ryjl3-tyaaa-aaaaa-aaaba-cai icp_ledger_canister --argument "
  (variant {
    Init = record {
      minting_account = \"$MINTER_ACCOUNT_ID\";
      initial_values = vec {
        record {
          \"$DEFAULT_ACCOUNT_ID\";
          record {
            e8s = 1_000_000_000_000 : nat64;
          };
        };
      };
      send_whitelist = vec {};
      transfer_fee = opt record {
        e8s = 10_000 : nat64;
      };
      token_symbol = opt \"LNND\";
      token_name = opt \"Local NND\";
    }
  })
"

echo "✅ ICP Ledger deployed successfully!"
echo "Token Symbol: LNND"
echo "Token Name: Local NND"
echo "Initial Balance: 10,000 LNND"
echo "Transfer Fee: 0.0001 LNND"

# Deploy the prompt marketplace
echo "Deploying prompt marketplace..."
dfx deploy prompt_marketplace

echo "🎉 All canisters deployed successfully!"
echo ""
echo "To check your balance:"
echo "dfx ledger balance"
echo ""
echo "To transfer tokens:"
echo "dfx ledger transfer --amount 1 --memo 0 <RECEIVER_ACCOUNT_ID>"
