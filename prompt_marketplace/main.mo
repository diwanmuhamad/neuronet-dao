import Types "Types";
import Categories "Categories";
import Users "Users";
import Items "Items";
import Comments "Comments";
import Licenses "Licenses";
import Favorites "Favorites";
import Views "Views";
import Principal "mo:base/Principal";

actor class PromptMarketplace() = this {
    // Initialize all modules
    private let categories = Categories.Categories();
    private let users = Users.Users();
    private let items = Items.Items();
    private let comments = Comments.Comments();
    private let licenses = Licenses.Licenses();
    private let favorites = Favorites.Favorites();
    private let views = Views.Views();

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
        category : Text, // Added category parameter
        metadata : Text
    ) : async Nat {
        let item = items.createItem(caller, title, description, content, price, itemType, category, metadata);
        item.id;
    };

    public query func get_items() : async [Types.Item] {
        items.getAllItems();
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
                
                // Check if user has sufficient balance
                switch (users.deductBalance(caller, item.price)) {
                    case (#ok(_)) {
                        // Create license
                        let license = licenses.createLicense(itemId, caller, null);
                        ?license.id;
                    };
                    case (#err(_)) { null };
                };
            };
        };
    };

    public shared ({ caller }) func get_my_licenses() : async [Types.License] {
        licenses.getLicensesByBuyer(caller);
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

    // User Profile Management
    public query func get_user_profile(userPrincipal : Principal) : async ?Types.User {
        users.getUser(userPrincipal);
    };

    public query func get_items_by_user(userPrincipal : Principal) : async [Types.Item] {
        items.getItemsByOwner(userPrincipal);
    };

    public query func get_comments_by_user(userPrincipal : Principal) : async [Types.Comment] {
        comments.getCommentsByAuthor(userPrincipal);
    };
};
