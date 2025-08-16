import React from 'react';

interface PromptContentProps {
  content: string;
}

const PromptContent: React.FC<PromptContentProps> = ({ content }) => {
  return (
    <div className="mt-8 bg-gray-800 rounded-xl p-6">
      <h2 className="text-xl font-bold text-white mb-4">
        Prompt Content
      </h2>
      <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
        <pre className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
          {content}
        </pre>
      </div>
    </div>
  );
};

export default PromptContent;
