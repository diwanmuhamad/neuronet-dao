import Types "Types";
import Time "mo:base/Time";
import Principal "mo:base/Principal";
import Nat64 "mo:base/Nat64";
import Array "mo:base/Array";
import Nat "mo:base/Nat";

module {
    public class Transactions() {
        private var transactions : [Types.Transaction] = [];
        private var nextId : Nat = 0;

        public func recordTransaction(
            buyer : Principal,
            seller : Principal,
            amount : Nat64,
            itemId : Nat
        ) : async Nat {
            let transaction : Types.Transaction = {
                id = nextId;
                buyer = buyer;
                seller = seller;
                amount = amount;
                itemId = itemId;
                status = #pending;
                createdAt = Time.now();
                processedAt = null;
            };

            transactions := Array.append(transactions, [transaction]);
            nextId := nextId + 1;
            transaction.id;
        };

        public func getTransaction(id : Nat) : ?Types.Transaction {
            Array.find<Types.Transaction>(transactions, func(t) { t.id == id });
        };

        public func getPendingTransactions() : [Types.Transaction] {
            Array.filter<Types.Transaction>(transactions, func(t) { 
                switch (t.status) {
                    case (#pending) { true };
                    case (_) { false };
                }
            });
        };

        public func getTransactionsByUser(user : Principal) : [Types.Transaction] {
            Array.filter<Types.Transaction>(transactions, func(t) { 
                t.buyer == user or t.seller == user 
            });
        };

        public func markTransactionCompleted(id : Nat) : Bool {
            let updatedTransactions = Array.map<Types.Transaction, Types.Transaction>(
                transactions,
                func(t) {
                    if (t.id == id) {
                        {
                            id = t.id;
                            buyer = t.buyer;
                            seller = t.seller;
                            amount = t.amount;
                            itemId = t.itemId;
                            status = #completed;
                            createdAt = t.createdAt;
                            processedAt = ?Time.now();
                        }
                    } else {
                        t
                    }
                }
            );
            transactions := updatedTransactions;
            true
        };

        public func markTransactionFailed(id : Nat) : Bool {
            let updatedTransactions = Array.map<Types.Transaction, Types.Transaction>(
                transactions,
                func(t) {
                    if (t.id == id) {
                        {
                            id = t.id;
                            buyer = t.buyer;
                            seller = t.seller;
                            amount = t.amount;
                            itemId = t.itemId;
                            status = #failed;
                            createdAt = t.createdAt;
                            processedAt = ?Time.now();
                        }
                    } else {
                        t
                    }
                }
            );
            transactions := updatedTransactions;
            true
        };

        public func getTransactionCount() : Nat {
            transactions.size()
        };

        public func getAllTransactions() : [Types.Transaction] {
            transactions
        };
    };
};
