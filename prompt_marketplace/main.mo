import Types "Types";
import Categories "Categories";
import Users "Users";
import Items "Items";
import Comments "Comments";
import Licenses "Licenses";
import Favorites "Favorites";
import Views "Views";
import Verification "Verification";
import Ledger "Ledger";
import Transactions "Transactions";
import Principal "mo:base/Principal";
import Nat64 "mo:base/Nat64";
import Text "mo:base/Text";
import _Array "mo:base/Array";
import Debug "mo:base/Debug";

actor class PromptMarketplace(ledger_id : Principal) = this {
    // Initialize all modules
    private let categories = Categories.Categories();
    private let users = Users.Users();
    private let verification = Verification.Verification();
    private let items = Items.Items(verification);
    private let comments = Comments.Comments();
    private let licenses = Licenses.Licenses();
    private let favorites = Favorites.Favorites();
    private let views = Views.Views();
    private let transactions = Transactions.Transactions();

    // ICP Ledger integration
    private let ledger = Ledger.Ledger(ledger_id);

    // Platform wallet configuration
    private var platformWallet : ?Principal = null;

    // Platform wallet management functions
    public shared ({ caller = _ }) func set_platform_wallet(wallet : Principal) : async Bool {
        // Only allow the canister controller to set the platform wallet
        // For now, allow any caller in development
        platformWallet := ?wallet;
        true;
    };

    public query func get_platform_wallet() : async ?Principal {
        platformWallet;
    };

    public query func get_canister_principal() : async Principal {
        Principal.fromActor(this);
    };

    // Transaction Management (Admin functions)
    public shared ({ caller = _ }) func get_pending_transactions() : async [Types.Transaction] {
        transactions.getPendingTransactions();
    };

    public shared ({ caller = _ }) func get_transactions_by_user(userPrincipal : Text) : async [Types.Transaction] {
        let user = Principal.fromText(userPrincipal);
        transactions.getTransactionsByUser(user);
    };

    public shared ({ caller = _ }) func mark_transaction_completed(transactionId : Nat) : async Bool {
        transactions.markTransactionCompleted(transactionId);
    };

    public shared ({ caller = _ }) func mark_transaction_failed(transactionId : Nat) : async Bool {
        transactions.markTransactionFailed(transactionId);
    };

    public query func get_transaction_count() : async Nat {
        transactions.getTransactionCount();
    };

    public query func get_all_transactions() : async [Types.Transaction] {
        transactions.getAllTransactions();
    };

    // Deposit/Withdrawal Management - DISABLED FOR NOW
    // TODO: Implement deposit/withdrawal system in future version
    // private var userDeposits : [(Principal, Nat64)] = []; // (user, amount in e8s)

    // // Deposit ICP into the canister
    // public shared ({ caller }) func deposit_icp(amount_e8s : Nat64) : async Types.Result<Nat64, Types.Error> {
    //     // For now, we'll simulate the deposit by adding to the user's deposited balance
    //     // In production, this should verify that the user actually transferred ICP to the canister
        
    //     let currentBalance = await get_user_deposited_balance(caller);
    //     let newBalance = currentBalance + amount_e8s;
        
    //     // Update user's deposited balance
    //     await update_user_deposited_balance(caller, newBalance);
        
    //     #ok(newBalance);
    // };

    // // Withdraw ICP from the canister
    // public shared ({ caller }) func withdraw_icp(amount_e8s : Nat64) : async Types.Result<Nat64, Types.Error> {
    //     let currentBalance = await get_user_deposited_balance(caller);
        
    //     if (currentBalance < amount_e8s) {
    //         return #err(#InsufficientBalance);
    //     };
        
    //     // Get current transfer fee
    //     let transferFee = await ledger.getTransferFee();
        
    //     // Transfer ICP from canister to user
    //     let transferResult = await ledger.transferICP(
    //         Principal.fromActor(this),
    //         caller,
    //         amount_e8s,
    //         1, // memo for withdrawal
    //         transferFee
    //     );
        
    //     switch (transferResult) {
    //         case (#ok(_)) {
    //                 let newBalance = currentBalance - amount_e8s;
    //                 await update_user_deposited_balance(caller, newBalance);
    //                 #ok(newBalance);
    //             };
    //             case (#err(error)) { #err(error) };
    //     };
    // };

    // // Get user's deposited balance
    // public shared ({ caller }) func get_deposited_balance() : async Nat64 {
    //     await get_user_deposited_balance(caller);
    // };

    // // Internal helper functions
    // private func get_user_deposited_balance(user : Principal) : async Nat64 {
    //     let userDeposit = Array.find<(Principal, Nat64)>(userDeposits, func((principal, _)) { principal == user });
    //     switch (userDeposit) {
    //         case (?deposit) { deposit.1 };
    //         case null { 0 : Nat64 };
    //     };
    // };

    // private func update_user_deposited_balance(user : Principal, newBalance : Nat64) : async () {
    //     let updatedDeposits = Array.map<(Principal, Nat64), (Principal, Nat64)>(
    //         userDeposits,
    //         func((principal, balance)) {
    //             if (principal == user) {
    //                     (principal, newBalance);
    //             } else {
    //                     (principal, balance);
    //             };
    //         }
    //     );
        
    //     // If user doesn't exist, add them
    //     let userExists = Array.find<(Principal, Nat64)>(userDeposits, func((principal, _)) { principal == user });
    //     switch (userExists) {
    //         case (?_) { userDeposits := updatedDeposits };
    //         case null { 
    //                 userDeposits := Array.append(userDeposits, [(user, newBalance)]);
    //             };
    //     };
    // };

    // These functions are no longer used with direct transfer system
    // private func deduct_user_deposited_balance(user : Principal, amount : Nat64) : async () {
    //     let currentBalance = await get_user_deposited_balance(user);
    //     let newBalance = if (currentBalance >= amount) { currentBalance - amount } else { 0 : Nat64 };
    //     await update_user_deposited_balance(user, newBalance);
    // };

    // private func add_user_deposited_balance(user : Principal, amount : Nat64) : async () {
    //     let currentBalance = await get_user_deposited_balance(user);
    //     let newBalance = currentBalance + amount;
    //     await update_user_deposited_balance(user, newBalance);
    // };

    // Initialize categories on deployment
    categories.initialize();

    // Category Management
    public query func get_categories(itemType : ?Text) : async [Types.Category] {
        categories.getCategories(itemType);
    };

    public query func get_item_types() : async [Text] {
        categories.getItemTypes();
    };

    // User Management
    public shared ({ caller }) func register_user() : async Bool {
        switch (users.registerUser(caller)) {
            case (#ok(_)) { true };
            case (#err(_)) { false };
        };
    };

    // Get ICP balance from ledger (primary balance function)
    public shared ({ caller }) func get_icp_balance() : async Nat64 {
        Debug.print("get_icp_balance called by: " # Principal.toText(caller));
        await ledger.getBalance(caller);
    };

    // Get ICP balance for a specific principal (for frontend use)
    public shared ({ caller = _ }) func get_user_icp_balance(userPrincipal : Text) : async Nat64 {
        let principal = Principal.fromText(userPrincipal);
        await ledger.getBalance(principal);
    };

    // Get canister's ICP balance (for debugging)
    public shared ({ caller = _ }) func get_canister_icp_balance() : async Nat64 {
        await ledger.getBalance(Principal.fromActor(this));
    };



    // Legacy balance function - deprecated, use get_icp_balance instead
    public shared ({ caller }) func get_balance() : async ?Nat {
        // Return ICP balance converted to Nat for backward compatibility
        let icpBalance = await ledger.getBalance(caller);
        ?Nat64.toNat(icpBalance);
    };

    // Item Management
    public shared ({ caller }) func list_item(
        title : Text,
        description : Text,
        contentHash : Text,
        price : Nat,
        itemType : Text,
        category : Text,
        metadata : Text,
        licenseTerms : Text,
        royaltyPercent : Nat,
        thumbnailImages : [Text],
        contentFileKey : Text,
        contentFileName : Text,
        contentRetrievalUrl : Text
    ) : async Types.Result<Nat, Types.Error> {
        let result = items.createItem(caller, title, description, contentHash, price, itemType, category, metadata, licenseTerms, royaltyPercent, thumbnailImages, contentFileKey, contentFileName, contentRetrievalUrl);
        switch (result) {
            case (#ok(item)) { #ok(item.id) };
            case (#err(error)) { #err(error) };
        };
    };

    // Admin function to create items for different users (for sample data)
    public shared ({ caller = _ }) func create_item_for_user(
        owner : Principal,
        title : Text,
        description : Text,
        contentHash : Text,
        price : Nat,
        itemType : Text,
        category : Text,
        metadata : Text,
        licenseTerms : Text,
        royaltyPercent : Nat,
        thumbnailImages : [Text],
        contentFileKey : Text,
        contentFileName : Text,
        contentRetrievalUrl : Text
    ) : async Types.Result<Nat, Types.Error> {
        let result = items.createItem(owner, title, description, contentHash, price, itemType, category, metadata, licenseTerms, royaltyPercent, thumbnailImages, contentFileKey, contentFileName, contentRetrievalUrl);
        switch (result) {
            case (#ok(item)) { #ok(item.id) };
            case (#err(error)) { #err(error) };
        };
    };

    public query func get_items() : async [Types.Item] {
        items.getAllItems();
    };

    // Get items by type with pagination
    public query func get_items_by_type_paginated(itemType : Text, page : Nat, limit : Nat) : async [Types.Item] {
        items.getItemsByTypePaginated(itemType, page, limit);
    };

    // Get total count of items by type
    public query func get_items_count_by_type(itemType : Text) : async Nat {
        items.getItemCountByType(itemType);
    };

    public query func get_item_detail(itemId : Nat) : async ?Types.ItemDetail {
        items.getItemDetail(itemId);
    };

    // Comment Management
    public shared ({ caller }) func add_comment(itemId : Nat, content : Text, rating : Nat) : async ?Nat {
        // Allow any authenticated user to comment (no license required)
        switch (comments.createComment(itemId, caller, content, rating)) {
            case (#ok(comment)) {
                // Update item with new comment
                let _ = items.addComment(itemId, comment);
                ?comment.id;
            };
            case (#err(_)) { null };
        };
    };

    public query func get_comments_by_item(itemId : Nat) : async [Types.Comment] {
        comments.getCommentsByItem(itemId);
    };

    // License Management

    // Finalize purchase after client-initiated ICP transfer to canister
    public shared ({ caller }) func finalize_purchase(itemId : Nat) : async Types.Result<Nat, Types.Error> {
        switch (items.getItem(itemId)) {
            case null { #err(#NotFound) };
            case (?item) {
                if (item.owner == caller) { return #err(#NotAuthorized) };
                if (items.hasLicense(itemId, caller)) { return #err(#AlreadyLicensed) };

                let priceInE8s = Nat64.fromNat(item.price);
                let transferFee : Nat64 = await ledger.getTransferFee();

                // TODO: Optionally verify that canister received funds from caller.
                // Skipped for now due to lack of indexing in this MVP.

                // Pay seller from canister (less platform fee)
                let platformFee = licenses.calculatePlatformFee(item.price);
                let platformFeeInE8s = Nat64.fromNat(platformFee);
                let sellerAmount = priceInE8s - platformFeeInE8s;

                let canisterToSellerResult = await ledger.transferICP(
                    Principal.fromActor(this),
                    item.owner,
                    sellerAmount,
                    1,
                    transferFee
                );

                switch (canisterToSellerResult) {
                    case (#ok(_)) {
                        // Get the effective platform wallet
                        let effectivePlatformWallet = switch (platformWallet) {
                            case (?wallet) { wallet };
                            case null { Principal.fromActor(this) };
                        };

                        // Transfer platform fee to platform wallet (if not the canister itself)
                        if (effectivePlatformWallet != Principal.fromActor(this)) {
                            // Check if canister has enough balance for platform fee transfer
                            let canisterBalance = await ledger.getBalance(Principal.fromActor(this));
                            let requiredAmount = platformFeeInE8s + transferFee;
                            
                            if (canisterBalance >= requiredAmount) {
                                let platformFeeTransferResult = await ledger.transferICP(
                                    Principal.fromActor(this), // Canister pays platform fee
                                    effectivePlatformWallet, // Platform wallet receives
                                    platformFeeInE8s,
                                    2, // memo for platform fee
                                    transferFee
                                );

                                switch (platformFeeTransferResult) {
                                    case (#ok(_platformBlockIndex)) {
                                        // Platform fee transfer successful, continue with purchase
                                    };
                                    case (#err(error)) {
                                        // Platform fee transfer failed, but seller already paid
                                        // In this case, we continue with the purchase and keep the platform fee in the canister
                                        // This is better than rolling back the entire transaction
                                        // The platform fee can be manually transferred later if needed
                                        Debug.print("Platform fee transfer failed: " # debug_show(error) # " - keeping fee in canister");
                                    };
                                };
                            } else {
                                // Canister doesn't have enough balance for platform fee transfer
                                // Continue with purchase and keep platform fee in canister
                                Debug.print("Insufficient canister balance for platform fee transfer. Required: " # Nat64.toText(requiredAmount) # ", Available: " # Nat64.toText(canisterBalance) # " - keeping fee in canister");
                            };
                        };

                        let _transactionId = await transactions.recordTransaction(caller, item.owner, priceInE8s, itemId);
                        let purchaseResult = licenses.processLicensePurchase(itemId, caller, item.price, item.licenseTerms, null);
                        let _ = items.addLicensedWallet(itemId, caller);
                        #ok(purchaseResult.license.id);
                    };
                    case (#err(error)) { #err(error) };
                };
            };
        };
    };

    public shared ({ caller }) func get_my_licenses() : async [Types.License] {
        licenses.getActiveLicensesByBuyer(caller);
    };

    public query func get_licenses_by_item(itemId : Nat) : async [Types.License] {
        licenses.getLicensesByItem(itemId);
    };

    // Favorite Management
    public shared ({ caller }) func add_favorite(itemId : Nat) : async ?Nat {
        switch (favorites.addFavorite(itemId, caller)) {
            case (#ok(favorite)) { ?favorite.id };
            case (#err(_)) { null };
        };
    };

    public shared ({ caller }) func remove_favorite(itemId : Nat) : async Bool {
        switch (favorites.removeFavorite(itemId, caller)) {
            case (#ok(_)) { true };
            case (#err(_)) { false };
        };
    };

    public shared ({ caller }) func is_favorited(itemId : Nat) : async Bool {
        favorites.isFavorited(itemId, caller);
    };

    public query func get_favorites_by_item(itemId : Nat) : async [Types.Favorite] {
        favorites.getFavoritesByItem(itemId);
    };

    public shared ({ caller }) func get_my_favorites() : async [Types.Favorite] {
        favorites.getFavoritesByUser(caller);
    };

    public query func get_favorite_count(itemId : Nat) : async Nat {
        favorites.getFavoriteCount(itemId);
    };

    // View Management
    public shared ({ caller }) func add_view(itemId : Nat) : async Nat {
        let view = views.addView(itemId, caller);
        view.id;
    };

    public query func get_views_by_item(itemId : Nat) : async [Types.View] {
        views.getViewsByItem(itemId);
    };

    public query func get_view_count(itemId : Nat) : async Nat {
        views.getViewCount(itemId);
    };

    public query func get_unique_view_count(itemId : Nat) : async Nat {
        views.getUniqueViewCount(itemId);
    };

    // Internet Identity integration
    public shared ({ caller }) func whoami() : async Principal {
        caller;
    };

    // Additional utility functions
    public query func get_item_count() : async Nat {
        items.getItemCount();
    };

    public query func get_user_count() : async Nat {
        users.getUserCount();
    };

    public query func get_license_count() : async Nat {
        licenses.getLicenseCount();
    };

    public query func get_total_favorite_count() : async Nat {
        favorites.getTotalFavoriteCount();
    };

    public query func get_total_view_count() : async Nat {
        views.getTotalViewCount();
    };

    public query func search_items(searchQuery : Text) : async [Types.Item] {
        items.searchItems(searchQuery);
    };

    public shared ({ caller }) func get_items_by_owner() : async [Types.Item] {
        items.getItemsByOwner(caller);
    };

    public query func get_items_by_type(itemType : Text) : async [Types.Item] {
        items.getItemsByType(itemType);
    };

    public query func get_items_by_category(category : Text) : async [Types.Item] {
        items.getItemsByCategory(category);
    };

    // On-chain Verification Functions
    public query func verify_item_content(itemId : Nat) : async Types.VerificationResult {
        items.verifyItemOnChain(itemId);
    };

    public query func get_content_hash(content : Text) : async Text {
        verification.generateContentHash(content);
    };

    public query func get_onchain_record(itemId : Nat) : async ?Types.OnChainRecord {
        verification.getOnChainRecord(itemId);
    };

    public query func get_verification_stats() : async { totalRecords : Nat; verifiedRecords : Nat } {
        verification.getVerificationStats();
    };

    public shared ({ caller }) func get_my_onchain_records() : async [Types.OnChainRecord] {
        verification.getRecordsByOwner(caller);
    };

    // Enhanced License Management
    public shared ({ caller }) func check_item_license(itemId : Nat) : async Bool {
        items.hasLicense(itemId, caller);
    };

    public query func get_platform_fee(price : Nat) : async Nat {
        licenses.calculatePlatformFee(price);
    };

    public query func get_creator_payment(price : Nat) : async Nat {
        licenses.calculateCreatorPayment(price);
    };

    // Get transfer fee in e8s (use ICP ledger's default fee)
    public shared ({ caller = _ }) func get_transfer_fee() : async Nat64 {
        // Get the current transfer fee from the ledger
        await ledger.getTransferFee();
    };

    // Get platform configuration
    public query func get_platform_config() : async Types.PlatformConfig {
        licenses.getPlatformConfig();
    };

    public shared ({ caller = _ }) func deactivate_license(licenseId : Nat) : async Bool {
        switch (licenses.deactivateLicense(licenseId)) {
            case (#ok(_)) { true };
            case (#err(_)) { false };
        };
    };

    public query func get_effective_platform_wallet() : async Principal {
        switch (platformWallet) {
            case (?wallet) { wallet };
            case null { Principal.fromActor(this) };
        };
    };

    // Platform fee statistics
    public query func get_platform_wallet_balance() : async ?Nat {
        let effectiveWallet = switch (platformWallet) {
            case (?wallet) { wallet };
            case null { Principal.fromActor(this) };
        };
        switch (users.getUser(effectiveWallet)) {
            case null { null };
            case (?user) { ?user.balance };
        };
    };

    // Manual platform fee transfer (for admin use)
    public shared ({ caller = _ }) func transfer_platform_fees() : async Types.Result<Nat64, Types.Error> {
        let effectivePlatformWallet = switch (platformWallet) {
            case (?wallet) { wallet };
            case null { return #err(#NotAuthorized) }; // Can't transfer to canister itself
        };

        let canisterBalance = await ledger.getBalance(Principal.fromActor(this));
        let transferFee = await ledger.getTransferFee();

        // Only transfer if we have enough balance for at least the transfer fee
        if (canisterBalance <= transferFee) {
            return #err(#InsufficientBalance);
        };

        // Transfer all available balance minus transfer fee
        let transferAmount = canisterBalance - transferFee;
        
        let transferResult = await ledger.transferICP(
            Principal.fromActor(this),
            effectivePlatformWallet,
            transferAmount,
            3, // memo for manual platform fee transfer
            transferFee
        );

        switch (transferResult) {
            case (#ok(_)) { #ok(transferAmount) };
            case (#err(error)) { #err(error) };
        };
    };



    // Batch verification for multiple items
    public query func batch_verify_items(itemIds : [Nat], contents : [Text]) : async [Types.VerificationResult] {
        verification.batchVerifyItems(itemIds, contents);
    };

    // Check if item is verified on-chain
    public query func is_item_verified(itemId : Nat) : async Bool {
        verification.isItemVerified(itemId);
    };

    // Get featured items (most viewed) by type
    public query func get_featured_items(itemType : Text, limit : Nat) : async [Types.Item] {
        items.getFeaturedItems(itemType, limit);
    };

    // Get trending items (most viewed and commented) by type
    public query func get_trending_items(itemType : Text, limit : Nat) : async [Types.Item] {
        items.getTrendingItems(itemType, limit);
    };

    // User Profile Management
    public shared ({ caller }) func update_user_profile(firstName : ?Text, lastName : ?Text, bio : ?Text, rate : ?Nat) : async Bool {
        switch (users.updateUserProfile(caller, firstName, lastName, bio, rate)) {
            case (#ok(_)) { true };
            case (#err(_)) { false };
        };
    };

    public query func get_user_profile(userPrincipal : Principal) : async ?Types.User {
        users.getUser(userPrincipal);
    };

    public shared ({ caller }) func get_my_profile() : async ?Types.User {
        users.getUser(caller);
    };

    public query func get_items_by_user(userPrincipal : Principal) : async [Types.Item] {
        items.getItemsByOwner(userPrincipal);
    };

    public query func get_comments_by_user(userPrincipal : Principal) : async [Types.Comment] {
        comments.getCommentsByAuthor(userPrincipal);
    };

    // Check if content hash already exists (for duplicate prevention)
    public query func check_content_duplicate(contentHash : Text) : async Bool {
        verification.isDuplicateContent(contentHash);
    };

    // Get existing item info by content hash
    public query func get_item_by_content_hash(contentHash : Text) : async ?Types.OnChainRecord {
        verification.getItemByContentHash(contentHash);
    };
};
