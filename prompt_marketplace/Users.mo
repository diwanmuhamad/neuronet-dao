import Array "mo:base/Array";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Types "Types";

module {
    public type User = Types.User;
    public type Error = Types.Error;
    public type Result<T, E> = Types.Result<T, E>;

    public class Users() {
        private var users : [User] = [];
        private let initialBalance : Nat = 100_000_000_000; // 1000 ICP in e8s

        public func registerUser(principal : Principal) : Result<Bool, Error> {
            let exists = Array.find<User>(users, func(u : User) : Bool { u.principal == principal }) != null;
            if (exists) {
                return #err(#InvalidInput);
            } else {
                let now = Time.now();
                let newUser : User = {
                    principal = principal;
                    balance = initialBalance;
                    createdAt = now;
                    updatedAt = now;
                };
                users := Array.append(users, [newUser]);
                return #ok(true);
            };
        };

        public func getUser(principal : Principal) : ?User {
            Array.find<User>(users, func(u : User) : Bool { u.principal == principal });
        };

        public func updateBalance(principal : Principal, newBalance : Nat) : Result<Bool, Error> {
            let now = Time.now();
            let updatedUsers = Array.map<User, User>(
                users,
                func(u : User) : User {
                    if (u.principal == principal) {
                        {
                            principal = u.principal;
                            balance = newBalance;
                            createdAt = u.createdAt;
                            updatedAt = now;
                        };
                    } else {
                        u;
                    };
                },
            );
            users := updatedUsers;
            #ok(true);
        };

        public func deductBalance(principal : Principal, amount : Nat) : Result<Bool, Error> {
            switch (getUser(principal)) {
                case null { #err(#NotFound) };
                case (?user) {
                    if (user.balance < amount) {
                        return #err(#InsufficientBalance);
                    } else {
                        updateBalance(principal, user.balance - amount);
                    };
                };
            };
        };

        public func addBalance(principal : Principal, amount : Nat) : Result<Bool, Error> {
            switch (getUser(principal)) {
                case null { #err(#NotFound) };
                case (?user) {
                    updateBalance(principal, user.balance + amount);
                };
            };
        };

        public func getAllUsers() : [User] {
            users;
        };

        public func getUserCount() : Nat {
            Array.size(users);
        };
    };
};
