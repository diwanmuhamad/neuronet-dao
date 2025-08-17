import React, { useState } from 'react';

interface ExpandableDescriptionProps {
  description: string;
  maxLength?: number;
}

const ExpandableDescription: React.FC<ExpandableDescriptionProps> = ({ 
  description, 
  maxLength = 250 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const shouldShowMore = description.length > maxLength;
  const displayText = isExpanded ? description : description.slice(0, maxLength);

  if (!shouldShowMore) {
    return (
      <p className="text-gray-300 leading-relaxed">
        {description}
      </p>
    );
  }

  return (
    <div>
      <p className="text-gray-300 leading-relaxed">
        {displayText}
        {!isExpanded && '...'}
      </p>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-purple-400 hover:text-purple-300 text-sm font-medium mt-2 transition-colors"
      >
        {isExpanded ? 'Show less' : 'Show more'}
      </button>
    </div>
  );
};

export default ExpandableDescription;
