import Types "Types";
import Categories "Categories";
import Users "Users";
import Items "Items";
import Comments "Comments";
import Licenses "Licenses";
import Favorites "Favorites";
import Views "Views";
import Verification "Verification";
import Principal "mo:base/Principal";

actor class PromptMarketplace() = this {
    // Initialize all modules
    private let categories = Categories.Categories();
    private let users = Users.Users();
    private let verification = Verification.Verification();
    private let items = Items.Items(verification);
    private let comments = Comments.Comments();
    private let licenses = Licenses.Licenses();
    private let favorites = Favorites.Favorites();
    private let views = Views.Views();

    // Platform wallet configuration
    private var platformWallet : ?Principal = null;

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

    public shared ({ caller }) func get_balance() : async ?Nat {
        switch (users.getUser(caller)) {
            case null { null };
            case (?user) { ?user.balance };
        };
    };

    // Item Management
    public shared ({ caller }) func list_item(
        title : Text,
        description : Text,
        content : Text,
        price : Nat,
        itemType : Text,
        category : Text,
        metadata : Text,
        licenseTerms : Text,
        royaltyPercent : Nat
    ) : async Nat {
        let item = items.createItem(caller, title, description, content, price, itemType, category, metadata, licenseTerms, royaltyPercent);
        item.id;
    };

    // Admin function to create items for different users (for sample data)
    public shared ({ caller = _ }) func create_item_for_user(
        owner : Principal,
        title : Text,
        description : Text,
        content : Text,
        price : Nat,
        itemType : Text,
        category : Text,
        metadata : Text,
        licenseTerms : Text,
        royaltyPercent : Nat
    ) : async Nat {
        let item = items.createItem(owner, title, description, content, price, itemType, category, metadata, licenseTerms, royaltyPercent);
        item.id;
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
    public shared ({ caller }) func buy_item(itemId : Nat) : async ?Nat {
        switch (items.getItem(itemId)) {
            case null { null };
            case (?item) {
                // Prevent users from buying their own items
                if (item.owner == caller) {
                    return null; // User cannot buy their own item
                };

                // Check if user already has license
                if (items.hasLicense(itemId, caller)) {
                    return null; // User already has license
                };

                // Check if user has sufficient balance
                switch (users.deductBalance(caller, item.price)) {
                    case (#ok(_)) {
                        // Process license purchase with platform fee
                        let purchaseResult = licenses.processLicensePurchase(
                            itemId,
                            caller,
                            item.price,
                            item.licenseTerms,
                            null
                        );

                        // Add buyer to licensed wallets in item
                        let _ = items.addLicensedWallet(itemId, caller);

                        // Add creator payment to their balance (creator gets payment minus platform fee)
                        let _ = users.addBalance(item.owner, purchaseResult.creatorPayment);

                        // Add platform fee to platform wallet
                        let platformRecipient = switch (platformWallet) {
                            case (?wallet) { wallet };
                            case null { Principal.fromActor(this) }; // Default to canister principal
                        };
                        let _ = users.addBalance(platformRecipient, purchaseResult.platformFee);

                        ?purchaseResult.license.id;
                    };
                    case (#err(_)) { null };
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

    // Platform wallet management
    public shared ({ caller = _ }) func set_platform_wallet(wallet : Principal) : async Bool {
        platformWallet := ?wallet;
        true;
    };

    public query func get_platform_wallet() : async ?Principal {
        platformWallet;
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
};
