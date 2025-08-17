import React from 'react';

interface ItemTypeBadgeProps {
  itemType: string;
}

const ItemTypeBadge: React.FC<ItemTypeBadgeProps> = ({ itemType }) => {
  const typeColors = {
    "prompt": { bg: "bg-green-600", text: "text-green-100", icon: "💬" },
    "dataset": { bg: "bg-blue-600", text: "text-blue-100", icon: "📊" },
    "ai_output": { bg: "bg-purple-600", text: "text-purple-100", icon: "🤖" },
    "ai-output": { bg: "bg-purple-600", text: "text-purple-100", icon: "🤖" },
  };

  const typeLabels = {
    "prompt": "Prompt",
    "dataset": "Dataset", 
    "ai_output": "AI Output",
    "ai-output": "AI Output",
  };

  const badge = typeColors[itemType as keyof typeof typeColors] || {
    bg: "bg-gray-600",
    text: "text-gray-100", 
    icon: "⚡"
  };

  const label = typeLabels[itemType as keyof typeof typeLabels] || "AI Tool";

  return (
    <div className={`${badge.bg} ${badge.text} px-3 py-1 rounded-lg font-medium flex items-center gap-2 text-sm`}>
      <span>{badge.icon}</span>
      <span>{label}</span>
    </div>
  );
};

export default ItemTypeBadge;
