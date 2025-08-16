import Array "mo:base/Array";
import Principal "mo:base/Principal";
import Float "mo:base/Float";
import Text "mo:base/Text";
import Prim "mo:base/Prelude";
import Time "mo:base/Time";
import Types "Types";

module {
    public type Item = Types.Item;
    public type ItemDetail = Types.ItemDetail;
    public type Comment = Types.Comment;
    public type Error = Types.Error;
    public type Result<T, E> = Types.Result<T, E>;

    public class Items() {
        private var items : [Item] = [];
        private var nextItemId : Nat = 0;

        public func createItem(
            owner : Principal,
            title : Text,
            description : Text,
            content : Text,
            price : Nat,
            itemType : Text,
            category : Text, // Added category parameter
            metadata : Text
        ) : Item {
            let now = Time.now();
            let item : Item = {
                id = nextItemId;
                owner = owner;
                title = title;
                description = description;
                content = content;
                price = price * 100_000_000; // Convert to e8s
                itemType = itemType;
                category = category; // Added category field
                metadata = metadata;
                comments = [];
                averageRating = 0.0;
                totalRatings = 0;
                createdAt = now;
                updatedAt = now;
            };
            items := Array.append(items, [item]);
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
                        category = item.category; // Added category field
                        metadata = item.metadata;
                        comments = item.comments;
                        averageRating = item.averageRating;
                        totalRatings = item.totalRatings;
                        createdAt = item.createdAt;
                        updatedAt = item.updatedAt;
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
                            category = item.category; // Added category field
                            metadata = item.metadata;
                            comments = newComments;
                            averageRating = newAverageRating;
                            totalRatings = newTotalRatings;
                            createdAt = item.createdAt;
                            updatedAt = now;
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
    };
};
