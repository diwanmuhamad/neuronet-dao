import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Array "mo:base/Array";

actor PromptMarketplace {

    type Prompt = {
        id : Nat;
        title : Text;
        description : Text;
        content : Text;
        price_icp : Nat;
        owner : Principal;
    };

    var prompts : [Prompt] = [];
    var nextId : Nat = 0;

    public shared (msg) func uploadPrompt(
        title : Text,
        description : Text,
        content : Text,
        price_icp : Nat,
    ) : async Prompt {
        let newPrompt : Prompt = {
            id = nextId;
            title = title;
            description = description;
            content = content;
            price_icp = price_icp;
            owner = msg.caller;
        };

        prompts := Array.append(prompts, [newPrompt]);
        nextId += 1;

        return newPrompt;
    };

    public query func listPrompts() : async [Prompt] {
        return prompts;
    };
};
