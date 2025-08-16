import Array "mo:base/Array";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Float "mo:base/Float";
import Types "Types";

module {
    public type Comment = Types.Comment;
    public type Error = Types.Error;
    public type Result<T, E> = Types.Result<T, E>;

    public class Comments() {
        private var comments : [Comment] = [];
        private var nextCommentId : Nat = 0;

        public func createComment(
            itemId : Nat,
            author : Principal,
            content : Text,
            rating : Nat
        ) : Result<Comment, Error> {
            // Validate rating (1-5 stars)
            if (rating < 1 or rating > 5) {
                return #err(#InvalidRating);
            };

            let comment : Comment = {
                id = nextCommentId;
                itemId = itemId;
                author = author;
                content = content;
                timestamp = Time.now();
                rating = rating;
            };

            comments := Array.append(comments, [comment]);
            nextCommentId += 1;
            #ok(comment);
        };

        public func getComment(id : Nat) : ?Comment {
            Array.find<Comment>(comments, func(c : Comment) : Bool { c.id == id });
        };

        public func getCommentsByItem(itemId : Nat) : [Comment] {
            Array.filter<Comment>(comments, func(c : Comment) : Bool { c.itemId == itemId });
        };

        public func getCommentsByAuthor(author : Principal) : [Comment] {
            Array.filter<Comment>(comments, func(c : Comment) : Bool { c.author == author });
        };

        public func getAllComments() : [Comment] {
            comments;
        };

        public func getCommentCount() : Nat {
            Array.size(comments);
        };

        public func getAverageRating(itemId : Nat) : Float {
            let itemComments = getCommentsByItem(itemId);
            if (Array.size(itemComments) == 0) {
                return 0.0;
            };
            
            let totalRating = Array.foldLeft<Comment, Nat>(
                itemComments,
                0,
                func(acc : Nat, c : Comment) : Nat { acc + c.rating }
            );
            
            Float.fromInt(totalRating) / Float.fromInt(Array.size(itemComments));
        };
    };
};
