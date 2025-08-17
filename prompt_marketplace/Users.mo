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
        private var initialBalance : Nat = 100_000_000; // 1 ICP in e8s

        public func registerUser(principal : Principal) : Result<Bool, Error> {
            let existingUser = Array.find<User>(users, func(u : User) : Bool { u.principal == principal });
            
            switch (existingUser) {
                case (?_) { #err(#InvalidInput) }; // User already exists
                case null {
                    let now = Time.now();
                    let newUser : User = {
                        principal = principal;
                        balance = initialBalance;
                        firstName = null;
                        lastName = null;
                        bio = null;
                        rate = null;
                        createdAt = now;
                        updatedAt = now;
                    };
                    users := Array.append(users, [newUser]);
                    #ok(true);
                };
            };
        };

        public func updateUserProfile(principal : Principal, firstName : ?Text, lastName : ?Text, bio : ?Text, rate : ?Nat) : Result<Bool, Error> {
            let existingUser = Array.find<User>(users, func(u : User) : Bool { u.principal == principal });
            
            switch (existingUser) {
                case null { #err(#NotFound) };
                case (?user) {
                    let now = Time.now();
                    let updatedUser : User = {
                        principal = user.principal;
                        balance = user.balance;
                        firstName = firstName;
                        lastName = lastName;
                        bio = bio;
                        rate = rate;
                        createdAt = user.createdAt;
                        updatedAt = now;
                    };
                    
                    users := Array.map<User, User>(users, func(u : User) : User {
                        if (u.principal == principal) { updatedUser; }
                        else { u; };
                    });
                    #ok(true);
                };
            };
        };

        public func getUser(principal : Principal) : ?User {
            Array.find<User>(users, func(u : User) : Bool { u.principal == principal });
        };

        public func updateBalance(principal : Principal, newBalance : Nat) : Result<Bool, Error> {
            let now = Time.now();
            let updatedUsers = Array.map<User, User>(users, func(u : User) : User {
                if (u.principal == principal) {
                    {
                        principal = u.principal;
                        balance = newBalance;
                        firstName = u.firstName;
                        lastName = u.lastName;
                        bio = u.bio;
                        rate = u.rate;
                        createdAt = u.createdAt;
                        updatedAt = now;
                    };
                }
                else { u; };
            });
            users := updatedUsers;
            #ok(true);
        };

        public func deductBalance(principal : Principal, amount : Nat) : Result<Bool, Error> {
            let existingUser = Array.find<User>(users, func(u : User) : Bool { u.principal == principal });
            
            switch (existingUser) {
                case null { #err(#NotFound) };
                case (?user) {
                    if (user.balance < amount) {
                        #err(#InsufficientBalance);
                    } else {
                        let newBalance = user.balance - amount;
                        updateBalance(principal, newBalance);
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
