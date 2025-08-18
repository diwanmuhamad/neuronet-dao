import Array "mo:base/Array";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Text "mo:base/Text";
import Nat32 "mo:base/Nat32";
import Char "mo:base/Char";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Types "Types";

module {
    public type OnChainRecord = Types.OnChainRecord;
    public type VerificationResult = Types.VerificationResult;
    public type Error = Types.Error;
    public type Result<T, E> = Types.Result<T, E>;

    public class Verification() {
        private var onChainRecords : [OnChainRecord] = [];
        private var nextRecordId : Nat = 0;

        // Generate a simple hash of content (using basic string hash)
        public func generateContentHash(content : Text) : Text {
            var hash : Nat = 0;
            let chars = content.chars();

            for (char in chars) {
                let charCode = Char.toNat32(char);
                hash := hash * 31 + Nat32.toNat(charCode);
            };

            // Convert to string representation
            Nat.toText(hash);
        };

        // Store item hash and metadata on-chain
        public func storeOnChain(
            itemId : Nat,
            content : Text,
            ownerWallet : Principal,
            licenseTerms : Text,
            royaltyPercent : Nat
        ) : OnChainRecord {
            let contentHash = generateContentHash(content);
            let now = Time.now();

            let record : OnChainRecord = {
                id = nextRecordId;
                itemId = itemId;
                contentHash = contentHash;
                ownerWallet = ownerWallet;
                timestamp = now;
                licenseTerms = licenseTerms;
                royaltyPercent = royaltyPercent;
                isVerified = true;
            };

            onChainRecords := Array.append(onChainRecords, [record]);
            nextRecordId += 1;
            record;
        };

        // Verify content against on-chain record
        public func verifyContent(itemId : Nat, content : Text) : VerificationResult {
            let contentHash = generateContentHash(content);

            switch (getOnChainRecord(itemId)) {
                case null {
                    {
                        isVerified = false;
                        onChainRecord = null;
                        hashMatch = false;
                        message = "No on-chain record found for this item";
                    }
                };
                case (?record) {
                    let hashMatch = Text.equal(contentHash, record.contentHash);
                    {
                        isVerified = record.isVerified and hashMatch;
                        onChainRecord = ?record;
                        hashMatch = hashMatch;
                        message = if (hashMatch) {
                            "Content verified successfully on-chain"
                        } else {
                            "Content hash does not match on-chain record"
                        };
                    }
                };
            };
        };

        // Get on-chain record by item ID
        public func getOnChainRecord(itemId : Nat) : ?OnChainRecord {
            Array.find<OnChainRecord>(onChainRecords, func(record : OnChainRecord) : Bool {
                record.itemId == itemId
            });
        };

        // Get all on-chain records
        public func getAllOnChainRecords() : [OnChainRecord] {
            onChainRecords;
        };

        // Get on-chain records by owner
        public func getRecordsByOwner(owner : Principal) : [OnChainRecord] {
            Array.filter<OnChainRecord>(onChainRecords, func(record : OnChainRecord) : Bool {
                record.ownerWallet == owner
            });
        };

        // Check if item is verified on-chain
        public func isItemVerified(itemId : Nat) : Bool {
            switch (getOnChainRecord(itemId)) {
                case null { false };
                case (?record) { record.isVerified };
            };
        };

        // Get verification statistics
        public func getVerificationStats() : { totalRecords : Nat; verifiedRecords : Nat } {
            let total = Array.size(onChainRecords);
            let verified = Array.size(Array.filter<OnChainRecord>(onChainRecords, func(record : OnChainRecord) : Bool {
                record.isVerified
            }));
            { totalRecords = total; verifiedRecords = verified };
        };

        // Update verification status (admin function)
        public func updateVerificationStatus(itemId : Nat, isVerified : Bool) : Result<Bool, Error> {
            let updatedRecords = Array.map<OnChainRecord, OnChainRecord>(
                onChainRecords,
                func(record : OnChainRecord) : OnChainRecord {
                    if (record.itemId == itemId) {
                        {
                            id = record.id;
                            itemId = record.itemId;
                            contentHash = record.contentHash;
                            ownerWallet = record.ownerWallet;
                            timestamp = record.timestamp;
                            licenseTerms = record.licenseTerms;
                            royaltyPercent = record.royaltyPercent;
                            isVerified = isVerified;
                        }
                    } else {
                        record
                    }
                }
            );

            onChainRecords := updatedRecords;
            #ok(true);
        };

        // Batch verify multiple items
        public func batchVerifyItems(itemIds : [Nat], contents : [Text]) : [VerificationResult] {
            if (Array.size(itemIds) != Array.size(contents)) {
                return [];
            };

            Array.mapEntries<Nat, VerificationResult>(itemIds, func(itemId : Nat, index : Nat) : VerificationResult {
                if (index < Array.size(contents)) {
                    verifyContent(itemId, contents[index])
                } else {
                    {
                        isVerified = false;
                        onChainRecord = null;
                        hashMatch = false;
                        message = "Content not provided for verification";
                    }
                }
            });
        };
    };
}
