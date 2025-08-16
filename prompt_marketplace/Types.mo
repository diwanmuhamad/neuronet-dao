import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Float "mo:base/Float";

module {
    public type Comment = {
        id : Nat;
        itemId : Nat;
        author : Principal;
        content : Text;
        timestamp : Time.Time;
        rating : Nat; // 1-5 stars
    };

    public type ItemBase = {
        id : Nat;
        owner : Principal;
        title : Text;
        description : Text;
        price : Nat;
        itemType : Text;
        metadata : Text;
        comments : [Comment];
        averageRating : Float;
        totalRatings : Nat;
    };

    public type Item = ItemBase and {
        content : Text;
    };

    public type ItemDetail = ItemBase;

    public type License = {
        id : Nat;
        itemId : Nat;
        buyer : Principal;
        timestamp : Time.Time;
        expiration : ?Time.Time;
    };

    public type User = {
        principal : Principal;
        balance : Nat;
    };

    public type Category = {
        id : Nat;
        name : Text;
        itemType : Text; // "prompt", "dataset", "ai_output"
        description : Text;
    };

    public type ItemType = {
        #prompt;
        #dataset;
        #ai_output;
    };

    public type Error = {
        #NotFound;
        #InsufficientBalance;
        #InvalidRating;
        #NotAuthorized;
        #InvalidInput;
        #InternalError;
    };

    public type Result<T, E> = {
        #ok : T;
        #err : E;
    };
};
