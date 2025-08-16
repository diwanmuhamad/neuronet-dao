import React from 'react';

interface ItemTagsProps {
  tags?: string[];
}

const ItemTags: React.FC<ItemTagsProps> = ({ 
  tags = [
    "55 words",
    "GPT-4O",
    "Tested ✓",
    "Instructions ✓",
    "9 examples ✓",
    "HD images ✓",
    "No artists ✗"
  ] 
}) => {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className={`px-3 py-1 rounded-full text-sm ${
              tag.includes('GPT-4O') 
                ? 'bg-green-600 text-white font-medium'
                : 'bg-gray-800 text-gray-300'
            }`}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ItemTags;
