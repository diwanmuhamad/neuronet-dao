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

IDENTITY_NAME="icp-local"

# Check if identity exists
if dfx identity list | grep -q "^${IDENTITY_NAME}\$"; then
  echo "Identity '${IDENTITY_NAME}' already exists."
else
  echo "Creating new identity '${IDENTITY_NAME}'..."
  dfx identity new "${IDENTITY_NAME}"
fi

# Switch to it
dfx identity use "${IDENTITY_NAME}"
echo "Now using identity: $(dfx identity whoami)"

export DEFAULT_ACCOUNT_ID=$(dfx ledger account-id)

echo "Minter Account ID: $MINTER_ACCOUNT_ID"
echo "Default Account ID: $DEFAULT_ACCOUNT_ID"

# Deploy the ICP ledger canister
echo "Deploying ICP ledger canister..."
dfx deploy icp_ledger_canister --argument "
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
dfx deploy prompt_marketplace --argument "
(principal \"$(dfx canister id icp_ledger_canister)\")"

echo "🎉 All canisters deployed successfully!"
echo ""
echo "To check your balance:"
echo "dfx canister call prompt_marketplace get_icp_balance"
echo ""
echo "To transfer tokens:"
echo "dfx canister call icp_ledger_canister icrc1_transfer '(
  record {
    to = record { owner = principal "<principal>"; subaccount = null };
    amount = <amount> : nat;
    fee = null;
    memo = null;
    from_subaccount = null;
    created_at_time = null;
  }
)'"
