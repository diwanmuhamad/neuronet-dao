#!/bin/bash

# Deploy Fake ICP Ledger on mainnet (IC)
# This script sets up a custom ledger + marketplace on mainnet

echo "🚀 Setting up Fake ICP Ledger on IC mainnet..."

# Ensure identity exists
IDENTITY_NAME="icp-mainnet"
if dfx identity list | grep -q "^${IDENTITY_NAME}\$"; then
  echo "Identity '${IDENTITY_NAME}' already exists."
else
  echo "Creating new identity '${IDENTITY_NAME}'..."
  dfx identity new "${IDENTITY_NAME}"
fi

# Switch to it
dfx identity use "${IDENTITY_NAME}"
echo "Now using identity: $(dfx identity whoami)"

# Get account IDs
export MINTER_ACCOUNT_ID=$(dfx ledger account-id --identity "${IDENTITY_NAME}" --network ic)
export DEFAULT_ACCOUNT_ID=$MINTER_ACCOUNT_ID

echo "Minter Account ID: $MINTER_ACCOUNT_ID"
echo "Default Account ID: $DEFAULT_ACCOUNT_ID"

# Deploy the fake ICP ledger canister to mainnet
echo "Deploying fake ICP ledger canister on mainnet..."
dfx deploy icp_ledger_canister --network ic --argument "
  (variant {
    Init = record {
      minting_account = \"$MINTER_ACCOUNT_ID\";
      initial_values = vec {
        record {
          \"$DEFAULT_ACCOUNT_ID\";
          record { e8s = 1_000_000_000_000 : nat64 };
        };
      };
      send_whitelist = vec {};
      transfer_fee = opt record { e8s = 10_000 : nat64 };
      token_symbol = opt \"NND\";
      token_name = opt \"Neuro Net DAO Token\";
    }
  })
"

echo "✅ Fake ICP Ledger deployed successfully on mainnet!"
FAKE_LEDGER_ID=$(dfx canister id icp_ledger_canister --network ic)
echo "Fake Ledger Canister ID: $FAKE_LEDGER_ID"

# Deploy the prompt marketplace linked to fake ledger
echo "Deploying prompt marketplace..."
dfx deploy prompt_marketplace --network ic --argument "
(principal \"${FAKE_LEDGER_ID}\")"

echo "🎉 All canisters deployed successfully on mainnet!"
echo ""
echo "👉 Fake Token Symbol: NND"
echo "👉 Fake Token Name: Neuro Net DAO Token"
echo "👉 Initial Balance: 10,000 NND"
echo "👉 Transfer Fee: 0.0001 NND"
echo ""
echo "To check your balance:"
echo "dfx canister --network ic call prompt_marketplace get_icp_balance"