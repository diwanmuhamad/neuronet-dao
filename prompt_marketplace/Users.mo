import Array "mo:base/Array";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Types "Types";
import Nat "mo:base/Nat";

module {
    public type User = Types.User;
    public type Error = Types.Error;
    public type Result<T, E> = Types.Result<T, E>;

    public class Users() {
        private var users : [User] = [];

        public func registerUser(principal : Principal) : Result<Bool, Error> {
            let existingUser = Array.find<User>(users, func(u : User) : Bool { u.principal == principal });
            
            switch (existingUser) {
                case (?_) { #err(#InvalidInput) }; // User already exists
                case null {
                    let now = Time.now();
                    let newUser : User = {
                        principal = principal;
                        balance = 0; // No internal balance - use ICP ledger instead
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

        public func getAllUsers() : [User] {
            users;
        };

        public func getUserCount() : Nat {
            Array.size(users);
        };
    };
};
