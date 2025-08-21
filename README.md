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

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd neuronet-dao
```

### 2. Deploy Backend

```bash
# Deploy canister
dfx deploy internet_identity 

# Deploy ICP ledger and marketplace
./deploy_ledger.sh

# Or deploy manually
dfx start --background
dfx deploy
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
   - Browse items and click "Buy" on any item
   - System will transfer ICP directly from your wallet to the seller
   - Platform fee (5%) is automatically deducted and kept by the canister
   - License is created immediately after successful transfer
5. **For sellers**:
   - Payments are received directly to your ICP wallet
   - No withdrawal process needed - funds are already in your wallet

### 5. Fund Your Local Account (For Testing)

To test purchases, you'll need ICP in your local account:

```bash
# Get your account ID
dfx ledger account-id

# Transfer ICP to your account (from the default account with 10,000 ICP)
dfx ledger transfer --amount 10 --memo 0 YOUR_ACCOUNT_ID

# Check your balance
dfx ledger balance
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

## ICP Ledger Integration

### Overview

The marketplace uses the Internet Computer's native ICP ledger for all payment transactions with a **direct transfer system**. This provides:

- **Real ICP payments**: Users pay with actual ICP tokens directly from their wallet
- **Decentralized transactions**: All payments are recorded on the ICP blockchain
- **Transparent fees**: Platform fees and creator payments are handled transparently
- **Secure transfers**: Leverages ICP's built-in security and consensus
- **No deposit required**: Users can purchase items directly with their wallet balance

**Note**: The deposit/withdrawal system has been **disabled** in favor of direct ICP transfers for a simpler user experience.

### Local Development Configuration

- **Token Symbol**: `ICP` (Internet Computer Protocol)
- **Transfer Fee**: 0.0001 ICP (10,000 e8s)
- **Platform Fee**: 5% of item price
- **Creator Payment**: 95% of item price

### How It Works

The marketplace now uses a **direct transfer system** for secure ICP transactions:

#### 💰 **Direct Transfer System**

1. **No Deposit Required**: Users can purchase items directly with their ICP wallet balance
2. **Two-Step Transfer**: 
   - Step 1: Buyer transfers ICP to canister (full amount + transfer fee)
   - Step 2: Canister transfers ICP to seller (amount - platform fee)
3. **Automatic Processing**: All transfers happen automatically when user clicks "Buy"

#### 📊 **Balance Types**

- **ICP Wallet Balance**: Your actual ICP balance in your wallet (used for purchases)
- **No Deposited Balance**: The deposit/withdrawal system is disabled

#### 🔄 **Purchase Flow**

1. **User clicks "Buy"** on any item
2. **System checks** user's ICP wallet balance
3. **If sufficient balance**:
   - Buyer transfers full amount + transfer fee to canister
   - Canister transfers amount - platform fee to seller
   - Canister keeps platform fee (5%)
   - License is created for the buyer
4. **If insufficient balance**: Error message shown

#### 💸 **Fee Structure**
- **Transfer Fee**: 0.0001 ICP (paid by buyer)
- **Platform Fee**: 5% of item price (kept by canister)
- **Creator Payment**: 95% of item price (transferred to creator)

#### ⚠️ **Important Notes**
- **Canister must have ICP balance** to pay transfer fees (see setup below)
- **Users pay directly** from their wallet balance (no deposit needed)
- **Transfer fees** are paid by the buyer
- **Platform fees** are automatically deducted and kept by the canister
- **All transactions** use real ICP tokens through the ledger

### Canister Setup Requirements

#### 🔧 **Fund the Canister**

The canister needs ICP balance to pay transfer fees. After deployment, fund the canister:

```bash
# Get canister account ID
dfx ledger account-id --of-canister prompt_marketplace

# Transfer ICP to canister (recommended: 1-5 ICP for testing)
dfx ledger transfer --amount 1 --memo 0 CANISTER_ACCOUNT_ID

# Check canister balance
dfx canister call prompt_marketplace get_canister_icp_balance
```

#### 📋 **Deployment Checklist**

After making changes to the canister:

```bash
# 1. Deploy the canister
dfx deploy prompt_marketplace

# 2. Generate candid interface (if needed)
dfx generate prompt_marketplace

# 3. Check canister balance
dfx canister call prompt_marketplace get_canister_icp_balance

# 4. Fund canister if needed
dfx ledger transfer --amount 1 --memo 0 CANISTER_ACCOUNT_ID
```

#### 🚨 **Important Deployment Notes**

**Whenever you make changes to the canister code:**
1. **Always run** `dfx deploy prompt_marketplace` to deploy changes
2. **Always run** `dfx generate prompt_marketplace` to update the candid interface
3. **Check canister balance** after deployment
4. **Fund canister** if balance is low (needed for transfer fees)

**Common Issues:**
- `#InsufficientFunds` error: Canister needs more ICP for transfer fees
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
./check_platform_wallet.sh

# Or check manually
dfx canister call prompt_marketplace get_platform_wallet
dfx canister call prompt_marketplace get_canister_principal
```

### Set Platform Wallet

```bash
# Set to your identity principal
dfx canister call prompt_marketplace set_platform_wallet '(principal "'$(dfx identity get-principal)'")'

# Or set to any principal
dfx canister call prompt_marketplace set_platform_wallet '(principal "YOUR_PRINCIPAL_ID")'
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
./test_icp_integration.sh

# Check ICP balance
dfx canister call prompt_marketplace get_icp_balance

# Check ledger status
dfx canister call ryjl3-tyaaa-aaaaa-aaaba-cai name

# Check platform wallet status
./check_platform_wallet.sh
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

# Purchase (requires deposited balance)
dfx canister call prompt_marketplace buy_item 1

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

### Network Configuration

The system supports both local development and mainnet deployment:

```bash
# Local development (default)
dfx canister call prompt_marketplace get_icp_balance

# Mainnet deployment
dfx canister call prompt_marketplace get_icp_balance --network=ic
```

### Mainnet Considerations

1. **ICP Ledger**: Mainnet uses the real ICP ledger canister ID: `ryjl3-tyaaa-aaaaa-aaaba-cai`
2. **Real ICP**: All transactions use real ICP tokens with actual value
3. **Platform Wallet**: Set to a principal you control for receiving platform fees
4. **Identity**: Use your mainnet Internet Identity for authentication

### Mainnet Setup Commands

```bash
# Deploy to mainnet
dfx deploy --network=ic

# Get your account ID for production
./get_account_id.sh

# Set platform wallet on mainnet (use account ID, not principal)
dfx canister call prompt_marketplace set_platform_wallet '(principal "'$(dfx identity get-principal)'")' --network=ic

# Check platform wallet on mainnet
dfx canister call prompt_marketplace get_platform_wallet --network=ic

# Check ICP balance on mainnet
dfx canister call prompt_marketplace get_icp_balance --network=ic

# Check ledger balance on mainnet
dfx ledger balance --network=ic
```

### Important Notes

- **Real Money**: Mainnet transactions use real ICP with actual value
- **Test First**: Always test thoroughly on local before mainnet deployment
- **Account IDs**: Use proper account IDs from `dfx ledger account-id` for production
- **Backup**: Ensure you have backups of your identity and canister configurations
- **Monitoring**: Set up monitoring for mainnet transactions and errors

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

### Deposit/Withdrawal Issues

- **"Insufficient deposited balance" when buying**: You need to deposit ICP into the marketplace first using the "Deposit" button
- **Can't purchase items**: Ensure you have enough deposited balance (not just wallet balance) for item price + transfer fee
- **Deposit/withdrawal failures**: Check that you have enough ICP in your wallet and the canister is running
- **Balance discrepancies**: Use the refresh button in the user dropdown to update all balances

### ICP Transfer Issues

1. **Insufficient Balance**: Ensure you have enough ICP for item price + transfer fee
2. **Transfer Failures**: Check network connectivity and canister status  
3. **Wrong balance type**: Remember that purchases use "Deposited Balance", not "ICP Wallet Balance"

### Debug Commands

```bash
# Check ledger status
dfx canister call ryjl3-tyaaa-aaaaa-aaaba-cai name

# Check account balance
dfx ledger balance

# Check user balances
dfx canister call prompt_marketplace get_icp_balance
dfx canister call prompt_marketplace get_deposited_balance

# Check specific user balance
dfx canister call prompt_marketplace get_user_icp_balance "YOUR_PRINCIPAL_ID"

# Test deposit/withdrawal - DISABLED FOR NOW
dfx canister call prompt_marketplace deposit_icp '(100_000_000: nat64)'
dfx canister call prompt_marketplace withdraw_icp '(50_000_000: nat64)'

# View transaction history
dfx canister call prompt_marketplace get_all_transactions
dfx canister call prompt_marketplace get_pending_transactions
dfx canister call prompt_marketplace get_transaction_count

# Check canister status
dfx canister status prompt_marketplace

# Platform wallet management
./check_platform_wallet.sh

# Check platform wallet
dfx canister call prompt_marketplace get_platform_wallet

# Set platform wallet
dfx canister call prompt_marketplace set_platform_wallet '(principal "YOUR_PRINCIPAL_ID")'

# Get canister principal
dfx canister call prompt_marketplace get_canister_principal
```

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
