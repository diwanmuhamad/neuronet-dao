# NeuroNet DAO - AI Marketplace

A decentralized AI marketplace built on the Internet Computer for buying and selling prompts, datasets, and AI outputs.

## Features

- **ICP Ledger Integration**: Real ICP payments for all transactions with automatic creator payments
- **Decentralized Marketplace**: Built on Internet Computer blockchain
- **Content Verification**: On-chain content verification and licensing
- **User Profiles**: Creator profiles and ratings
- **Categories & Filtering**: Organized content by type and category
- **Favorites & Comments**: Social features for community engagement
- **Automatic Revenue Distribution**: 95% to creators, 5% platform fee

### Live dApp 

You can access it through: https://neuronet-dao.vercel.app/ (Live Front-end & Mainnet)

### Prerequisites

- [DFINITY SDK (dfx)](https://internetcomputer.org/docs/current/developer-docs/setup/install/) installed (`brew install dfinity/tap/dfx` or see official docs)
- [Node.js](https://nodejs.org/) (for frontend)

### Environment Configuration

1. **Set up environment variables**:
```bash
cd frontend
cp .env.local.example .env.local
```

2. **Configure environment variables**:
   - `NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID`: Internet Identity canister ID
   - `NEXT_PUBLIC_DFX_NETWORK`: Network type (`local` or `ic`)
   - `NEXT_PUBLIC_DFX_HOST`: DFX host URL
   - `NEXT_PUBLIC_PROMPT_MARKETPLACE_CANISTER_ID`: Prompt marketplace canister ID
   - `NEXT_PUBLIC_ICP_LEDGER_CANISTER_ID`: Ledger canister ID

### 1. Clone and Local Development Setup

```bash
git clone <your-repo-url>
cd neuronet-dao
```

### 2. Deploy Backend

```bash
# Deploy ICP ledger and marketplace
./deploy_ledger.sh

# Deploy canister
dfx deploy internet_identity 

# Setup Platform Wallet
dfx identity use <new-identity>
frontend/scripts/.setup_platform_wallet.sh
```

### 3. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

### 4. Access the Marketplace

1. Open your browser to `http://localhost:3000`
2. Connect your wallet using Internet Identity
3. **Set up your account for purchases**:
   - Click on your user dropdown (top right)
   - Check your "ICP Wallet Balance" (this is what you'll use for purchases)
   - **No deposit required** - you can purchase directly with your wallet balance
4. **Purchase items**:
   - Browse items and click "Get Item" on any item
   - System will transfer ICP directly from your wallet to the canister, then to the seller
   - Platform fee (5%) is automatically deducted and kept by the canister
   - License is created immediately after successful transfer
5. **For sellers**:
   - Payments are received directly to your ICP wallet
   - No withdrawal process needed - funds are already in your wallet

### 5. Fund Your Local Account (For Testing)

To test purchases, you'll need ICP in your local account:

```bash
# (Manual) Transfer ICP to your account (from the default account with 10,000 ICP)
dfx canister call icp_ledger_canister icrc1_transfer '(
  record {
    to = record { owner = principal "<principal>"; subaccount = null };
    amount = <amount> : nat;
    fee = null;
    memo = null;
    from_subaccount = null;
    created_at_time = null;
  }
)'

# OR (Top-up feature) We have front-end top-up feature to top-up 5 ICP per user for testing (one time only)
# first need to do top-up to the prompt marketplace canister (e.g., 100 ICP for testing)
# Then do top-up by open user dropdown at the top-right user icon (if you authenticated).
dfx canister call icp_ledger_canister icrc1_transfer '(
  record {
    to = record { owner = principal <prompt_marketplace_canister_id>; subaccount = null };
    amount = 10_000_000_000 : nat; // 100 ICP
    fee = null;
    memo = null;
    from_subaccount = null;
    created_at_time = null;
  }
)' 

# Check your balance
dfx canister call prompt_marketplace get_icp_balance
```

**Note**: The `deploy_ledger.sh` script creates a local ledger with 10,000 ICP for testing.

## System Architecture

### Backend (Motoko)

```
prompt_marketplace/
├── main.mo              # Main canister logic
├── Ledger.mo            # ICP ledger integration (ICRC-1)
├── Transactions.mo      # Transaction tracking system
├── Types.mo             # Type definitions
├── Items.mo             # Item management
├── Users.mo             # User management
├── Licenses.mo          # License management
├── Comments.mo          # Comment system
├── Favorites.mo         # Favorites system
├── Views.mo             # View tracking
├── Categories.mo        # Category management
├── Verification.mo      # Content verification
└── prompt_marketplace.did # Candid interface
```

### Frontend (Next.js)

```
frontend/
├── src/
│   ├── app/                    # Next.js app router
│   ├── components/             # React components
│   │   ├── common/            # Shared components
│   │   ├── marketplace/       # Marketplace components
│   │   ├── items/             # Item components
│   │   ├── users/             # User components
│   │   └── comments/          # Comment components
│   ├── contexts/              # React contexts
│   ├── hooks/                 # Custom hooks
│   ├── ic/                    # Internet Computer integration
│   └── utils/                 # Utility functions
└── public/                    # Static assets
```

#### 📋 **Deployment Checklist**

After making changes to the canister:

```bash
# 1. Deploy the canister
dfx deploy prompt_marketplace

# 2. Generate candid interface (if needed)
dfx generate prompt_marketplace

mv src/declarations/prompt_marketplace/prompt_marketplace.did.js frontend/src/ic/prompt_marketplace.did.js
```

#### 🚨 **Important Deployment Notes**

**Whenever you make changes to the canister code:**
1. **Always run** `dfx deploy prompt_marketplace` to deploy changes
2. **Always run** `dfx generate prompt_marketplace` to update the candid interface

**Common Issues:**
- Transfer failures: Check canister balance and fund if needed
- Interface errors: Run `dfx generate` after deployment

### Error Handling

The system provides detailed error messages for:

- `InsufficientBalance`: User doesn't have enough ICP
- `NotAuthorized`: User trying to buy their own item
- `AlreadyLicensed`: User already owns the item
- `NotFound`: Item doesn't exist
- `InternalError`: Ledger transfer failures

## Platform Wallet Management

### Overview

The platform wallet is the account that receives all payments from users. By default, it uses the canister's own principal, but you can set it to any principal you control.

### Check Current Status

```bash
# Use the helper script
frontend/scripts/./check_platform_wallet.sh

# Or check manually
dfx canister call prompt_marketplace get_platform_wallet
dfx canister call prompt_marketplace get_canister_principal
```

### Set Platform Wallet

```bash
# Run script
dfx identity use <new-identity>
frontend/scripts/.setup_platform_wallet.sh
```

### How It Works

1. **Default**: If no platform wallet is set, the canister principal receives payments
2. **Custom**: You can set any principal as the platform wallet
3. **Revenue Flow**: 
   - User pays → Platform wallet receives full amount
   - Platform wallet → Creator (95%)
   - Platform wallet keeps 5% fee

### Testing

```bash
# Test ICP balance and ledger functionality
frontend/scripts/./test_icp_integration.sh

# Check platform wallet status
frontend/scripts/./check_platform_wallet.sh
```

### Key Canister Methods

```bash
# User Management
dfx canister call prompt_marketplace register_user
dfx canister call prompt_marketplace get_icp_balance
dfx canister call prompt_marketplace get_user_icp_balance "YOUR_PRINCIPAL_ID"

# Canister Balance Management
dfx canister call prompt_marketplace get_canister_icp_balance  # Check canister balance
dfx ledger account-id --of-canister prompt_marketplace  # Get canister account ID

# Transfer Fee Management
dfx canister call prompt_marketplace get_transfer_fee  # Get current transfer fee in e8s

# Item Management
dfx canister call prompt_marketplace get_items
dfx canister call prompt_marketplace get_item_detail 1

# Purchase (client-initiated transfer)
dfx canister call prompt_marketplace finalize_purchase 1

# Licenses
dfx canister call prompt_marketplace get_my_licenses
dfx canister call prompt_marketplace get_licenses_by_item 1

# Transaction Management (Admin)
dfx canister call prompt_marketplace get_pending_transactions
dfx canister call prompt_marketplace get_all_transactions
dfx canister call prompt_marketplace get_transaction_count

# Platform Wallet
dfx canister call prompt_marketplace get_platform_wallet
dfx canister call prompt_marketplace set_platform_wallet '(principal "YOUR_PRINCIPAL_ID")'
```

## Mainnet Deployment

### Mainnet Setup Commands

```bash
# Deploy to mainnet
./deploy_ledger_mainnet.sh

# Deploy canister
dfx deploy internet_identity --network ic

# Setup Platform Wallet
dfx identity use <new-identity>
frontend/scripts/.setup_platform_wallet.sh ic
```

### Important Notes

- **Fake Money**: Current system is using custom ledger canister, not real ICP canister.
- **Top-up Manually/Frontend**: Need to top-up ICP to the user's principal (read Fund Your Local Account Section).

## Troubleshooting

### Internet Identity Issues

If you encounter `IC0301: Canister not found` errors for Internet Identity:

1. **Check if Internet Identity is deployed**:
   ```bash
   dfx canister status internet_identity
   ```

2. **If not deployed, deploy it**:
   ```bash
   dfx deploy internet_identity
   ```

3. **Get the canister ID**:
   ```bash
   dfx canister id internet_identity
   ```

4. **Update your environment variables**:
   - Copy the canister ID from step 3
   - Update `NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID` in your `.env.local` file

### Environment Variables Setup

If you encounter authentication or canister connection issues:

1. **Copy the example environment file**:
   ```bash
   cd frontend
   cp .env.local.example .env.local
   ```

2. **Update canister IDs**:
   ```bash
   # Get current canister IDs
   dfx canister id prompt_marketplace
   dfx canister id internet_identity
   ```

3. **Update your .env.local file** with the correct canister IDs

### Common Issues

- **Canister not found**: Deploy the missing canister using `dfx deploy <canister_name>`
- **Authentication errors**: Ensure Internet Identity is running and accessible
- **Environment variables**: Make sure all required environment variables are set in `.env.local`
- **Balance Not Updating**: Refresh the page or wait for auto-refresh

### Stopping the Replica

```bash
dfx stop
```

### Re-install Canister (Not recommended for production)

```bash
dfx deploy prompt_marketplace --mode=reinstall
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
