import Array "mo:base/Array";
import Principal "mo:base/Principal";
import Float "mo:base/Float";
import Text "mo:base/Text";
import Prim "mo:base/Prelude";
import Time "mo:base/Time";
import Types "Types";
import Verification "Verification";

module {
    public type Item = Types.Item;
    public type ItemDetail = Types.ItemDetail;
    public type Comment = Types.Comment;
    public type Error = Types.Error;
    public type Result<T, E> = Types.Result<T, E>;

    public class Items(verification : Verification.Verification) {
        private var items : [Item] = [];
        private var nextItemId : Nat = 0;

        public func createItem(
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
        ) : Item {
            let now = Time.now();

            // Generate content hash
            let contentHash = verification.generateContentHash(content);

            let item : Item = {
                id = nextItemId;
                owner = owner;
                title = title;
                description = description;
                content = content;
                price = price * 100_000_000; // Convert to e8s
                itemType = itemType;
                category = category;
                metadata = metadata;
                comments = [];
                averageRating = 0.0;
                totalRatings = 0;
                createdAt = now;
                updatedAt = now;
                // On-chain verification fields
                contentHash = contentHash;
                isVerified = true;
                licenseTerms = licenseTerms;
                royaltyPercent = royaltyPercent;
                licensedWallets = [];
            };
            items := Array.append(items, [item]);

            // Store on-chain record after item is created with correct ID
            let _onChainRecord = verification.storeOnChain(
                item.id,
                content,
                owner,
                licenseTerms,
                royaltyPercent
            );

            nextItemId += 1;
            item;
        };

        public func getItem(id : Nat) : ?Item {
            Array.find<Item>(items, func(i : Item) : Bool { i.id == id });
        };

        public func getItemDetail(id : Nat) : ?ItemDetail {
            switch (getItem(id)) {
                case null { null };
                case (?item) {
                    let itemDetail : ItemDetail = {
                        id = item.id;
                        owner = item.owner;
                        title = item.title;
                        description = item.description;
                        price = item.price;
                        itemType = item.itemType;
                        category = item.category;
                        metadata = item.metadata;
                        comments = item.comments;
                        averageRating = item.averageRating;
                        totalRatings = item.totalRatings;
                        createdAt = item.createdAt;
                        updatedAt = item.updatedAt;
                        // On-chain verification fields
                        contentHash = item.contentHash;
                        isVerified = item.isVerified;
                        licenseTerms = item.licenseTerms;
                        royaltyPercent = item.royaltyPercent;
                        licensedWallets = item.licensedWallets;
                    };
                    ?itemDetail;
                };
            };
        };

        public func getAllItems() : [Item] {
            items;
        };

        public func getItemsByOwner(owner : Principal) : [Item] {
            Array.filter<Item>(items, func(i : Item) : Bool { i.owner == owner });
        };

        public func getItemsByType(itemType : Text) : [Item] {
            Array.filter<Item>(items, func(i : Item) : Bool { i.itemType == itemType });
        };

        public func getItemsByTypePaginated(itemType : Text, page : Nat, limit : Nat) : [Item] {
            let typeItems = Array.filter<Item>(items, func(i : Item) : Bool { i.itemType == itemType });
            let startIndex = page * limit;
            let arraySize = Array.size(typeItems);

            if (startIndex >= arraySize) {
                return [];
            };

            let endIndex = if (startIndex + limit > arraySize) {
                arraySize;
            } else {
                startIndex + limit;
            };

            Array.subArray<Item>(typeItems, startIndex, endIndex - startIndex);
        };

        public func getItemCountByType(itemType : Text) : Nat {
            let typeItems = Array.filter<Item>(items, func(i : Item) : Bool { i.itemType == itemType });
            Array.size(typeItems);
        };

        public func getItemsByCategory(category : Text) : [Item] {
            Array.filter<Item>(items, func(i : Item) : Bool { i.category == category });
        };

        public func addComment(itemId : Nat, comment : Comment) : Result<Bool, Error> {
            let now = Time.now();
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
                            category = item.category;
                            metadata = item.metadata;
                            comments = newComments;
                            averageRating = newAverageRating;
                            totalRatings = newTotalRatings;
                            createdAt = item.createdAt;
                            updatedAt = now;
                            // On-chain verification fields
                            contentHash = item.contentHash;
                            isVerified = item.isVerified;
                            licenseTerms = item.licenseTerms;
                            royaltyPercent = item.royaltyPercent;
                            licensedWallets = item.licensedWallets;
                        };
                    } else {
                        item;
                    };
                },
            );
            items := updatedItems;
            #ok(true);
        };

        public func getItemCount() : Nat {
            Array.size(items);
        };

        public func searchItems(searchQuery : Text) : [Item] {
            Array.filter<Item>(items, func(item : Item) : Bool {
                Text.contains(item.title, #text searchQuery) or Text.contains(item.description, #text searchQuery)
            });
        };

        // Get featured items (most viewed) by type
        public func getFeaturedItems(itemType : Text, limit : Nat) : [Item] {
            let typeItems = Array.filter<Item>(items, func(item : Item) : Bool { item.itemType == itemType });

            // Sort by total ratings (which represents views/engagement)
            let sortedItems = Array.sort<Item>(typeItems, func(a : Item, b : Item) : { #less; #equal; #greater } {
                if (a.totalRatings > b.totalRatings) {
                    #less;
                } else if (a.totalRatings < b.totalRatings) {
                    #greater;
                } else {
                    #equal;
                };
            });

            // Return top items up to limit
            if (Array.size(sortedItems) <= limit) {
                sortedItems;
            } else {
                Array.subArray<Item>(sortedItems, 0, limit);
            };
        };

        // Get trending items (most viewed and commented) by type
        public func getTrendingItems(itemType : Text, limit : Nat) : [Item] {
            let typeItems = Array.filter<Item>(items, func(item : Item) : Bool { item.itemType == itemType });

            // Sort by combination of total ratings and comment count
            let sortedItems = Array.sort<Item>(typeItems, func(a : Item, b : Item) : { #less; #equal; #greater } {
                let aScore = a.totalRatings + Array.size(a.comments) * 10; // Weight comments more heavily
                let bScore = b.totalRatings + Array.size(b.comments) * 10;

                if (aScore > bScore) {
                    #less;
                } else if (aScore < bScore) {
                    #greater;
                } else {
                    #equal;
                };
            });

            // Return top items up to limit
            if (Array.size(sortedItems) <= limit) {
                sortedItems;
            } else {
                Array.subArray<Item>(sortedItems, 0, limit);
            };
        };

        // Add buyer to licensed wallets
        public func addLicensedWallet(itemId : Nat, buyer : Principal) : Result<Bool, Error> {
            let now = Time.now();
            let updatedItems = Array.map<Item, Item>(
                items,
                func(item : Item) : Item {
                    if (item.id == itemId) {
                        // Check if buyer is already licensed
                        let alreadyLicensed = Array.find<Principal>(item.licensedWallets, func(wallet : Principal) : Bool {
                            wallet == buyer
                        });

                        switch (alreadyLicensed) {
                            case (?_) { item }; // Already licensed, return unchanged
                            case null {
                                // Add buyer to licensed wallets
                                let newLicensedWallets = Array.append(item.licensedWallets, [buyer]);
                                {
                                    id = item.id;
                                    owner = item.owner;
                                    title = item.title;
                                    description = item.description;
                                    content = item.content;
                                    price = item.price;
                                    itemType = item.itemType;
                                    category = item.category;
                                    metadata = item.metadata;
                                    comments = item.comments;
                                    averageRating = item.averageRating;
                                    totalRatings = item.totalRatings;
                                    createdAt = item.createdAt;
                                    updatedAt = now;
                                    contentHash = item.contentHash;
                                    isVerified = item.isVerified;
                                    licenseTerms = item.licenseTerms;
                                    royaltyPercent = item.royaltyPercent;
                                    licensedWallets = newLicensedWallets;
                                };
                            };
                        };
                    } else {
                        item;
                    };
                },
            );
            items := updatedItems;
            #ok(true);
        };

        // Check if user has license for item
        public func hasLicense(itemId : Nat, buyer : Principal) : Bool {
            switch (getItem(itemId)) {
                case null { false };
                case (?item) {
                    Array.find<Principal>(item.licensedWallets, func(wallet : Principal) : Bool {
                        wallet == buyer
                    }) != null;
                };
            };
        };

        // Verify item content on-chain
        public func verifyItemOnChain(itemId : Nat) : Types.VerificationResult {
            switch (getItem(itemId)) {
                case null {
                    {
                        isVerified = false;
                        onChainRecord = null;
                        hashMatch = false;
                        message = "Item not found";
                    }
                };
                case (?item) {
                    verification.verifyContent(itemId, item.content);
                };
            };
        };

        // Get verification module instance
        public func getVerification() : Verification.Verification {
            verification;
        };
    };
};
