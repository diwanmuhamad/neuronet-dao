import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Time "mo:base/Time";

actor class PromptMarketplace() = this {
    type Item = {
        id : Nat;
        owner : Principal;
        title : Text;
        description : Text;
        content : Text;
        price : Nat;
        itemType : Text;
        metadata : Text;
    };
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

    stable var items : [Item] = [];
    stable var licenses : [License] = [];
    stable var nextItemId : Nat = 0;
    stable var nextLicenseId : Nat = 0;
    stable var users : [User] = [];

    public shared ({ caller }) func register_user() : async Bool {
        let exists = Array.find<User>(users, func(u : User) : Bool { u.principal == caller }) != null;
        if (exists) {
            return false;
        } else {
            let newUser = {
                principal = caller;
                balance = 100_000_000_000; // 100 ICP in e8s
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
            price = price;
            itemType = itemType;
            metadata = metadata;
        };
        items := Array.append(items, [item]);
        nextItemId += 1;
        return item.id;
    };

    public query func get_items() : async [Item] {
        items;
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
};
