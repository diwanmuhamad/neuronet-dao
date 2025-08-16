import Array "mo:base/Array";
import Types "Types";

module {
    public type Category = Types.Category;

    public class Categories() {
        private var categories : [Category] = [];
        private var nextCategoryId : Nat = 0;

        public func initialize() {
            if (Array.size(categories) == 0) {
                // Prompt categories
                let promptCategories : [Text] = [
                    "Midjourney Video", "ChatGPT Image", "Imagen", "Veo", "DALL-E", 
                    "Midjourney", "Leonardo AI", "Stable Diffusion", "FLUX", "Sora",
                    "Runway", "Pika Labs", "AnimateDiff", "ComfyUI", "Automatic1111"
                ];
                
                // Dataset categories
                let datasetCategories : [Text] = [
                    "Healthcare", "Finance", "NLP", "Retail", "Automotive", "Social", 
                    "Vision", "IoT", "Climate", "Audio", "Security", "Legal", "Gaming", 
                    "Property", "Logistics", "Geospatial", "Translation", "Biometrics", 
                    "Agriculture", "Network", "Education", "Research", "Government"
                ];
                
                // AI Output categories
                let aiOutputCategories : [Text] = [
                    "Photography", "Design", "Copywriting", "Product", "Development", 
                    "Content", "Branding", "Marketing", "E-commerce", "Social Media", 
                    "Video", "Business", "Career", "Presentation", "Newsletter", 
                    "Podcasting", "Education", "Web Design", "UI/UX", "SEO", 
                    "Animation", "Legal", "Technical", "Creative", "Professional"
                ];

                // Add prompt categories
                for (categoryName in promptCategories.vals()) {
                    let category : Category = {
                        id = nextCategoryId;
                        name = categoryName;
                        itemType = "prompt";
                        description = "AI prompt category for " # categoryName;
                    };
                    categories := Array.append(categories, [category]);
                    nextCategoryId += 1;
                };

                // Add dataset categories
                for (categoryName in datasetCategories.vals()) {
                    let category : Category = {
                        id = nextCategoryId;
                        name = categoryName;
                        itemType = "dataset";
                        description = "Dataset category for " # categoryName;
                    };
                    categories := Array.append(categories, [category]);
                    nextCategoryId += 1;
                };

                // Add AI output categories
                for (categoryName in aiOutputCategories.vals()) {
                    let category : Category = {
                        id = nextCategoryId;
                        name = categoryName;
                        itemType = "ai_output";
                        description = "AI output category for " # categoryName;
                    };
                    categories := Array.append(categories, [category]);
                    nextCategoryId += 1;
                };
            };
        };

        public func getCategories(itemType : ?Text) : [Category] {
            switch (itemType) {
                case null { categories };
                case (?itemTypeValue) {
                    Array.filter<Category>(categories, func(cat : Category) : Bool { 
                        cat.itemType == itemTypeValue 
                    });
                };
            };
        };

        public func getItemTypes() : [Text] {
            ["prompt", "dataset", "ai_output"];
        };

        public func addCategory(name : Text, itemType : Text, description : Text) : Category {
            let category : Category = {
                id = nextCategoryId;
                name = name;
                itemType = itemType;
                description = description;
            };
            categories := Array.append(categories, [category]);
            nextCategoryId += 1;
            category;
        };

        public func getCategoryById(id : Nat) : ?Category {
            Array.find<Category>(categories, func(cat : Category) : Bool { cat.id == id });
        };

        public func getCategoriesByItemType(itemType : Text) : [Category] {
            Array.filter<Category>(categories, func(cat : Category) : Bool { cat.itemType == itemType });
        };
    };
};
