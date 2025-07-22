## Running the Backend Canister (Prompt Marketplace)

This project uses the Internet Computer (IC) and Motoko for its backend. The backend canister is located in the `prompt_marketplace` directory.

### Prerequisites

- [DFINITY SDK (dfx)](https://internetcomputer.org/docs/current/developer-docs/setup/install/) installed (`brew install dfinity/tap/dfx` or see official docs)
- [Node.js](https://nodejs.org/) (for frontend, if you want to run both)

### 1. Start the Local IC Replica

```bash
dfx start --background
```

### 2. Deploy the Backend Canister

From the project root, run:

```bash
dfx deploy
```

This will compile and deploy the `prompt_marketplace` canister locally.

### 3. Interact with the Canister

You can call canister methods using `dfx` commands. For example, to list all items:

```bash
dfx canister call prompt_marketplace get_items
```

Or to register a user:

```bash
dfx canister call prompt_marketplace register_user
```

### 4. Stopping the Replica

When finished, stop the local replica with:

```bash
dfx stop
```
