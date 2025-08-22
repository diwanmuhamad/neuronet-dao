import Types "Types";
import Debug "mo:base/Debug";
import Result "mo:base/Result";
import Principal "mo:base/Principal";
import Nat64 "mo:base/Nat64";

module {
    public class Ledger(ledger_id : Principal) {
        private let ledger : actor {
            icrc1_balance_of : ({ owner : Principal; subaccount : ?[Nat8] }) -> async Nat;
            icrc1_transfer : ({ from_subaccount : ?[Nat8]; to : { owner : Principal; subaccount : ?[Nat8] }; amount : Nat; fee : ?Nat; memo : ?Nat; created_at_time : ?Int }) -> async { #Ok : Nat; #Err : { #BadFee : { expected_fee : Nat }; #BadBurn : { min_burn_amount : Nat }; #InsufficientFunds : { balance : Nat }; #TooOld; #CreatedInFuture : { ledger_time : Int }; #Duplicate : { duplicate_of : Nat }; #TemporarilyUnavailable; #GenericError : { error_code : Nat; message : Text } } };
        } = actor(Principal.toText(ledger_id));

        // Get user's ICP balance in e8s
        public func getBalance(principal : Principal) : async Nat64 {
            let account = { owner = principal; subaccount = null };
            let balance = await ledger.icrc1_balance_of(account);
            Nat64.fromNat(balance);
        };

        // Transfer ICP tokens
        public func transferICP(
            _from : Principal,
            to : Principal,
            amount : Nat64,
            memo : Nat64,
            fee : Nat64
        ) : async Types.Result<Nat64, Types.Error> {
            // Debug: log inputs and environment
            Debug.print(
                "transferICP called with:" #
                " from=" # Principal.toText(_from) #
                " to=" # Principal.toText(to) #
                " amount(e8s)=" # Nat64.toText(amount) #
                " fee(e8s)=" # Nat64.toText(fee) #
                " memo=" # Nat64.toText(memo)
            );
            Debug.print("Using ledger canister: " # Principal.toText(Principal.fromActor(ledger)));
            let args = {
                from_subaccount = null;
                to = { owner = to; subaccount = null };
                amount = Nat64.toNat(amount);
                fee = ?Nat64.toNat(fee);
                memo = ?Nat64.toNat(memo);
                created_at_time = null;
            };
            // Debug: log constructed transfer args
            Debug.print("icrc1_transfer args: " # debug_show args);
            
            let result = await ledger.icrc1_transfer(args);
            switch (result) {
                case (#Ok(blockIndex)) { #ok(Nat64.fromNat(blockIndex)) };
                case (#Err(error)) {
                    Debug.print("Transfer error: " # debug_show error);
                    #err(#InternalError);
                };
            };
        };

        // Check if user has sufficient balance
        public func hasSufficientBalance(principal : Principal, requiredAmount : Nat64) : async Bool {
            let balance = await getBalance(principal);
            balance >= requiredAmount;
        };

        // Get account balance (for backward compatibility)
        public func getAccountBalance(account : { owner : Principal; subaccount : ?[Nat8] }) : async Nat64 {
            let balance = await ledger.icrc1_balance_of(account);
            Nat64.fromNat(balance);
        };

        // Convert principal to account (for backward compatibility)
        public func principalToAccountIdentifier(principal : Principal, _subaccount : ?[Nat8]) : { owner : Principal; subaccount : ?[Nat8] } {
            { owner = principal; subaccount = _subaccount };
        };

        // Get the current transfer fee from the ledger
        public func getTransferFee() : async Nat64 {
            // For now, return the standard ICP transfer fee
            // In the future, this could query the ledger for dynamic fees
            10_000; // 0.0001 ICP = 10,000 e8s
        };
    };
};
