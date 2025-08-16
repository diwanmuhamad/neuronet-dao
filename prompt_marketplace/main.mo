import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Time "mo:base/Time";
import Float "mo:base/Float";

actor class PromptMarketplace() = this {
    type Comment = {
        id : Nat;
        itemId : Nat;
        author : Principal;
        content : Text;
        timestamp : Time.Time;
        rating : Nat; // 1-5 stars
    };

    type ItemBase = {
        id : Nat;
        owner : Principal;
        title : Text;
        description : Text;
        price : Nat;
        itemType : Text;
        metadata : Text;
        comments : [Comment];
        averageRating : Float;
        totalRatings : Nat;
    };

    type Item = ItemBase and {
        content : Text;
    };

    type ItemDetail = ItemBase;

    type License = {
        id : Nat;
        itemId : Nat;
        buyer : Principal;
        timestamp : Time.Time;
        expiration : ?Time.Time;
    };
    
    type User = {
        principal : Principal;
        balance : Nat;
    };

    type Category = {
        id : Nat;
        name : Text;
        itemType : Text; // "prompt", "dataset", "ai_output"
        description : Text;
    };

    stable var items : [Item] = [];
    stable var licenses : [License] = [];
    stable var comments : [Comment] = [];
    stable var categories : [Category] = [];
    stable var nextItemId : Nat = 0;
    stable var nextLicenseId : Nat = 0;
    stable var nextCommentId : Nat = 0;
    stable var nextCategoryId : Nat = 0;
    stable var users : [User] = [];

    // Initialize categories
    private func initializeCategories() {
        if (Array.size(categories) == 0) {
            // Prompt categories
            let promptCategories : [Text] = [
                "Midjourney Video", "ChatGPT Image", "Imagen", "Veo", "DALL-E", 
                "Midjourney", "Leonardo AI", "Stable Diffusion", "FLUX", "Sora",
                "Runway", "Pika Labs", "AnimateDiff", "ComfyUI", "Automatic1111"
            ];
            
            // Dataset categories
            let datasetCategories : [Text] = [
                "Healthcare", "Finance", "NLP", "Retail", "Automotive", "Social", 
                "Vision", "IoT", "Climate", "Audio", "Security", "Legal", "Gaming", 
                "Property", "Logistics", "Geospatial", "Translation", "Biometrics", 
                "Agriculture", "Network", "Education", "Research", "Government"
            ];
            
            // AI Output categories
            let aiOutputCategories : [Text] = [
                "Photography", "Design", "Copywriting", "Product", "Development", 
                "Content", "Branding", "Marketing", "E-commerce", "Social Media", 
                "Video", "Business", "Career", "Presentation", "Newsletter", 
                "Podcasting", "Education", "Web Design", "UI/UX", "SEO", 
                "Animation", "Legal", "Technical", "Creative", "Professional"
            ];

            // Add prompt categories
            for (categoryName in promptCategories.vals()) {
                let category = {
                    id = nextCategoryId;
                    name = categoryName;
                    itemType = "prompt";
                    description = "AI prompt category for " # categoryName;
                };
                categories := Array.append(categories, [category]);
                nextCategoryId += 1;
            };

            // Add dataset categories
            for (categoryName in datasetCategories.vals()) {
                let category = {
                    id = nextCategoryId;
                    name = categoryName;
                    itemType = "dataset";
                    description = "Dataset category for " # categoryName;
                };
                categories := Array.append(categories, [category]);
                nextCategoryId += 1;
            };

            // Add AI output categories
            for (categoryName in aiOutputCategories.vals()) {
                let category = {
                    id = nextCategoryId;
                    name = categoryName;
                    itemType = "ai_output";
                    description = "AI output category for " # categoryName;
                };
                categories := Array.append(categories, [category]);
                nextCategoryId += 1;
            };
        };
    };

    // Initialize categories on deployment
    initializeCategories();

    public query func get_categories(itemType : ?Text) : async [Category] {
        switch (itemType) {
            case null { categories };
            case (?itemTypeValue) {
                Array.filter<Category>(categories, func(cat : Category) : Bool { 
                    cat.itemType == itemTypeValue 
                });
            };
        };
    };

    public query func get_item_types() : async [Text] {
        ["prompt", "dataset", "ai_output"];
    };

    public shared ({ caller }) func register_user() : async Bool {
        let exists = Array.find<User>(users, func(u : User) : Bool { u.principal == caller }) != null;
        if (exists) {
            return false;
        } else {
            let newUser = {
                principal = caller;
                balance = 100_000_000_000; // 1000 ICP in e8s
            };
            users := Array.append(users, [newUser]);
            return true;
        };
    };

    public shared ({ caller }) func list_item(title : Text, description : Text, content : Text, price : Nat, itemType : Text, metadata : Text) : async Nat {
        let item = {
            id = nextItemId;
            owner = caller;
            title = title;
            description = description;
            content = content;
            price = price * 100_000_000;
            itemType = itemType;
            metadata = metadata;
            comments = [];
            averageRating = 0.0;
            totalRatings = 0;
        };
        items := Array.append(items, [item]);
        nextItemId += 1;
        return item.id;
    };

    public query func get_items() : async [Item] {
        items;
    };

    public query func get_item_detail(itemId : Nat) : async ?ItemDetail {
        let itemOpt = Array.find<Item>(items, func(i : Item) : Bool { i.id == itemId });
        switch (itemOpt) {
            case null { return null };
            case (?item) {
                let itemDetail = {
                    id = item.id;
                    owner = item.owner;
                    title = item.title;
                    description = item.description;
                    price = item.price;
                    itemType = item.itemType;
                    metadata = item.metadata;
                    comments = item.comments;
                    averageRating = item.averageRating;
                    totalRatings = item.totalRatings;
                };
                return ?itemDetail;
            };
        };
    };

    public shared ({ caller }) func add_comment(itemId : Nat, content : Text, rating : Nat) : async ?Nat {
        // Verify user has license for this item
        let userLicenses = Array.filter<License>(licenses, func(l : License) : Bool {
            l.buyer == caller and l.itemId == itemId
        });

        if (Array.size(userLicenses) == 0) {
            return null; // User doesn't own this item
        };

        // Validate rating (1-5 stars)
        if (rating < 1 or rating > 5) {
            return null;
        };

        let comment = {
            id = nextCommentId;
            itemId = itemId;
            author = caller;
            content = content;
            timestamp = Time.now();
            rating = rating;
        };

        comments := Array.append(comments, [comment]);
        nextCommentId += 1;

        // Update item with new comment and recalculate average rating
        let updatedItems = Array.map<Item, Item>(
            items,
            func(item : Item) : Item {
                if (item.id == itemId) {
                    let newComments = Array.append(item.comments, [comment]);
                    let totalRating = Array.foldLeft<Comment, Nat>(
                        newComments,
                        0,
                        func(acc : Nat, c : Comment) : Nat { acc + c.rating }
                    );
                    let newTotalRatings = item.totalRatings + 1;
                    let newAverageRating = if (newTotalRatings > 0) {
                        Float.fromInt(totalRating) / Float.fromInt(newTotalRatings)
                    } else {
                        0.0
                    };
                    {
                        id = item.id;
                        owner = item.owner;
                        title = item.title;
                        description = item.description;
                        content = item.content;
                        price = item.price;
                        itemType = item.itemType;
                        metadata = item.metadata;
                        comments = newComments;
                        averageRating = newAverageRating;
                        totalRatings = newTotalRatings;
                    };
                } else {
                    item;
                };
            },
        );
        items := updatedItems;

        return ?comment.id;
    };

    public shared ({ caller }) func buy_item(itemId : Nat) : async ?Nat {
        let itemOpt = Array.find<Item>(items, func(i : Item) : Bool { i.id == itemId });
        switch (itemOpt) {
            case null { return null };
            case (?item) {
                // Find user and check balance
                let userOpt = Array.find<User>(users, func(u : User) : Bool { u.principal == caller });
                switch (userOpt) {
                    case null { return null };
                    case (?user) {
                        if (user.balance < item.price) {
                            return null; // Insufficient balance
                        } else {
                            // Update user balance
                            let updatedUsers = Array.map<User, User>(
                                users,
                                func(u : User) : User {
                                    if (u.principal == caller) {
                                        {
                                            principal = u.principal;
                                            balance = u.balance - item.price;
                                        };
                                    } else {
                                        u;
                                    };
                                },
                            );
                            users := updatedUsers;

                            // Create license
                            let license = {
                                id = nextLicenseId;
                                itemId = itemId;
                                buyer = caller;
                                timestamp = Time.now();
                                expiration = null;
                            };
                            licenses := Array.append(licenses, [license]);
                            nextLicenseId += 1;
                            return ?license.id;
                        };
                    };
                };
            };
        };
    };

    public query ({ caller }) func get_my_licenses() : async [License] {
        Array.filter<License>(licenses, func(l : License) : Bool { l.buyer == caller });
    };

    public query ({ caller }) func get_balance() : async ?Nat {
        let userOpt = Array.find<User>(users, func(u : User) : Bool { u.principal == caller });
        switch (userOpt) {
            case null { return null };
            case (?user) { return ?user.balance };
        };
    };

    // Internet Identity integration - whoami function
    public query ({ caller }) func whoami() : async Principal {
        caller;
    };
};
