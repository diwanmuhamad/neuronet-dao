import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Float "mo:base/Float";

module {
    public type Comment = {
        id : Nat;
        itemId : Nat;
        author : Principal;
        content : Text;
        createdAt : Time.Time;
        updatedAt : Time.Time;
        rating : Nat; // 1-5 stars
    };

    public type ItemBase = {
        id : Nat;
        owner : Principal;
        title : Text;
        description : Text;
        price : Nat;
        itemType : Text;
        category : Text; // Added category field
        metadata : Text;
        comments : [Comment];
        averageRating : Float;
        totalRatings : Nat;
        createdAt : Time.Time;
        updatedAt : Time.Time;
        // On-chain verification fields
        contentHash : Text;
        isVerified : Bool;
        licenseTerms : Text;
        royaltyPercent : Nat;
        licensedWallets : [Principal];
        thumbnailImages : [Text]; // Array of S3 URLs for thumbnail images
        // S3 storage fields
        contentFileKey : Text; // S3 key for the content file
        contentFileName : Text; // Original filename
        contentRetrievalUrl : Text; // S3 retrieval URL
    };

    public type Item = ItemBase and {
        content : Text;
    };

    public type ItemDetail = ItemBase;

    public type License = {
        id : Nat;
        itemId : Nat;
        buyer : Principal;
        createdAt : Time.Time;
        updatedAt : Time.Time;
        expiration : ?Time.Time;
        licenseTerms : Text;
        isActive : Bool;
    };

    public type User = {
        principal : Principal;
        balance : Nat; // Deprecated - use ICP ledger for balance management
        firstName : ?Text; // Optional first name
        lastName : ?Text; // Optional last name
        bio : ?Text; // Optional bio
        rate : ?Nat; // Optional hourly rate in cents
        createdAt : Time.Time;
        updatedAt : Time.Time;
    };

    public type Favorite = {
        id : Nat;
        itemId : Nat;
        user : Principal;
        createdAt : Time.Time;
    };

    public type View = {
        id : Nat;
        itemId : Nat;
        viewer : Principal;
        createdAt : Time.Time;
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

    public type OnChainRecord = {
        id : Nat;
        itemId : Nat;
        contentHash : Text;
        ownerWallet : Principal;
        timestamp : Time.Time;
        licenseTerms : Text;
        royaltyPercent : Nat;
        isVerified : Bool;
    };

    public type VerificationResult = {
        isVerified : Bool;
        onChainRecord : ?OnChainRecord;
        hashMatch : Bool;
        message : Text;
    };

    public type PlatformConfig = {
        platformFeePercent : Nat; // 5% = 5
    };

    public type Error = {
        #NotFound;
        #InsufficientBalance;
        #InvalidRating;
        #NotAuthorized;
        #InvalidInput;
        #InternalError;
        #AlreadyFavorited;
        #NotFavorited;
        #AlreadyLicensed;
        #VerificationFailed;
        #HashMismatch;
        #DuplicateContent;
    };

    public type Transaction = {
        id : Nat;
        buyer : Principal;
        seller : Principal;
        amount : Nat64; // Amount in e8s
        itemId : Nat;
        status : TransactionStatus;
        createdAt : Time.Time;
        processedAt : ?Time.Time;
    };

    public type TransactionStatus = {
        #pending;
        #completed;
        #failed;
    };

    public type Result<T, E> = {
        #ok : T;
        #err : E;
    };
};
