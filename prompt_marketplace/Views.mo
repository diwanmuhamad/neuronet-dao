import Array "mo:base/Array";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Types "Types";

module {
    public type View = Types.View;
    public type Error = Types.Error;
    public type Result<T, E> = Types.Result<T, E>;

    public class Views() {
        private var views : [View] = [];
        private var nextViewId : Nat = 0;

        public func addView(itemId : Nat, viewer : Principal) : View {
            let now = Time.now();
            let view : View = {
                id = nextViewId;
                itemId = itemId;
                viewer = viewer;
                createdAt = now;
            };
            views := Array.append(views, [view]);
            nextViewId += 1;
            view;
        };

        public func getViewsByItem(itemId : Nat) : [View] {
            Array.filter<View>(views, func(v : View) : Bool { v.itemId == itemId });
        };

        public func getViewsByUser(user : Principal) : [View] {
            Array.filter<View>(views, func(v : View) : Bool { v.viewer == user });
        };

        public func getViewCount(itemId : Nat) : Nat {
            let itemViews = getViewsByItem(itemId);
            Array.size(itemViews);
        };

        public func getUniqueViewCount(itemId : Nat) : Nat {
            let itemViews = getViewsByItem(itemId);
            let uniqueViewers = Array.foldLeft<View, [Principal]>(
                itemViews,
                [],
                func(acc : [Principal], view : View) : [Principal] {
                    let existing = Array.find<Principal>(acc, func(p : Principal) : Bool { p == view.viewer });
                    switch (existing) {
                        case null { Array.append(acc, [view.viewer]) };
                        case (?_) { acc };
                    };
                }
            );
            Array.size(uniqueViewers);
        };

        public func getAllViews() : [View] {
            views;
        };

        public func getTotalViewCount() : Nat {
            Array.size(views);
        };
    };
};
