import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Time "mo:base/Time";

actor class PromptMarketplace() = this {
    type ItemType = { #Prompt; #Dataset };
    type Item = {
        id : Nat;
        owner : Principal;
        title : Text;
        description : Text;
        price : Nat;
        itemType : ItemType;
        metadata : Text;
    };
    type License = {
        id : Nat;
        itemId : Nat;
        buyer : Principal;
        timestamp : Time.Time;
        expiration : ?Time.Time;
    };

    stable var items : [Item] = [];
    stable var licenses : [License] = [];
    stable var nextItemId : Nat = 0;
    stable var nextLicenseId : Nat = 0;
    stable var users : [Principal] = [];

    public shared ({ caller }) func register_user() : async Bool {
        let exists = Array.find<Principal>(users, func u = u == caller) != null;
        if (exists) {
            return false;
        } else {
            users := Array.append(users, [caller]);
            return true;
        };
    };

    public shared ({ caller }) func list_item(title : Text, description : Text, price : Nat, itemType : ItemType, metadata : Text) : async Nat {
        let item = {
            id = nextItemId;
            owner = caller;
            title = title;
            description = description;
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
        let itemOpt = Array.find<Item>(items, func i = i.id == itemId);
        switch (itemOpt) {
            case null { return null };
            case (?_) {
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

    public query ({ caller }) func get_my_licenses() : async [License] {
        Array.filter<License>(licenses, func l = l.buyer == caller);
    };
};
