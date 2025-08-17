import Array "mo:base/Array";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Types "Types";

module {
    public type Favorite = Types.Favorite;
    public type Error = Types.Error;
    public type Result<T, E> = Types.Result<T, E>;

    public class Favorites() {
        private var favorites : [Favorite] = [];
        private var nextFavoriteId : Nat = 0;

        public func addFavorite(itemId : Nat, user : Principal) : Result<Favorite, Error> {
            // Check if user already favorited this item
            let existingFavorite = Array.find<Favorite>(
                favorites,
                func(f : Favorite) : Bool { f.itemId == itemId and f.user == user }
            );
            
            switch (existingFavorite) {
                case (?_) { #err(#AlreadyFavorited) };
                case null {
                    let now = Time.now();
                    let favorite : Favorite = {
                        id = nextFavoriteId;
                        itemId = itemId;
                        user = user;
                        createdAt = now;
                    };
                    favorites := Array.append(favorites, [favorite]);
                    nextFavoriteId += 1;
                    #ok(favorite);
                };
            };
        };

        public func removeFavorite(itemId : Nat, user : Principal) : Result<Bool, Error> {
            let existingFavorite = Array.find<Favorite>(
                favorites,
                func(f : Favorite) : Bool { f.itemId == itemId and f.user == user }
            );
            
            switch (existingFavorite) {
                case null { #err(#NotFavorited) };
                case (?_) {
                    favorites := Array.filter<Favorite>(
                        favorites,
                        func(f : Favorite) : Bool { not (f.itemId == itemId and f.user == user) }
                    );
                    #ok(true);
                };
            };
        };

        public func getFavoritesByItem(itemId : Nat) : [Favorite] {
            Array.filter<Favorite>(favorites, func(f : Favorite) : Bool { f.itemId == itemId });
        };

        public func getFavoritesByUser(user : Principal) : [Favorite] {
            Array.filter<Favorite>(favorites, func(f : Favorite) : Bool { f.user == user });
        };

        public func isFavorited(itemId : Nat, user : Principal) : Bool {
            let existingFavorite = Array.find<Favorite>(
                favorites,
                func(f : Favorite) : Bool { f.itemId == itemId and f.user == user }
            );
            switch (existingFavorite) {
                case null { false };
                case (?_) { true };
            };
        };

        public func getFavoriteCount(itemId : Nat) : Nat {
            let itemFavorites = getFavoritesByItem(itemId);
            Array.size(itemFavorites);
        };

        public func getAllFavorites() : [Favorite] {
            favorites;
        };

        public func getTotalFavoriteCount() : Nat {
            Array.size(favorites);
        };
    };
};
