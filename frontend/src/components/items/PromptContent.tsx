import React, { useState, useEffect } from 'react';

interface PromptContentProps {
  contentRetrievalUrl: string;
  itemType: string;
  fileName: string;
}

const PromptContent: React.FC<PromptContentProps> = ({ contentRetrievalUrl, itemType, fileName }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await fetch(contentRetrievalUrl);
        
        if (!response.ok) {
          throw new Error('Failed to fetch content');
        }

        if (itemType === 'ai_output') {
          // For AI outputs, the URL is already an image URL
          setContent(contentRetrievalUrl);
        } else {
          // For prompts and datasets, fetch the text file content
          const textContent = await response.text();
          setContent(textContent);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [contentRetrievalUrl, itemType]);

  const getContentTitle = () => {
    switch (itemType) {
      case 'prompt':
        return 'Prompt Content';
      case 'dataset':
        return 'Dataset Content';
      case 'ai_output':
        return 'AI Output';
      default:
        return 'Content';
    }
  };

  if (loading) {
    return (
      <div className="mt-8 bg-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">
          {getContentTitle()}
        </h2>
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 bg-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">
          {getContentTitle()}
        </h2>
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
          <p className="text-red-400 text-center">Error loading content: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 bg-gray-800 rounded-xl p-6">
      <h2 className="text-xl font-bold text-white mb-4">
        {getContentTitle()}
      </h2>
      <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
        {itemType === 'ai_output' ? (
          <div className="flex justify-center">
            <img 
              src={content} 
              alt="AI Output" 
              className="max-w-full h-auto rounded-lg"
              style={{ maxHeight: '500px' }}
            />
          </div>
        ) : itemType === 'dataset' ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">CSV Dataset Content</span>
              <button
                onClick={() => {
                  const blob = new Blob([content], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = fileName || 'dataset.csv';
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors"
              >
                Download CSV
              </button>
            </div>
            <pre className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed max-h-96 overflow-auto bg-gray-800 p-4 rounded-lg border border-gray-700">
              {content}
            </pre>
          </div>
        ) : (
          <pre className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
            {content}
          </pre>
        )}
        <div className="mt-4 text-xs text-gray-500">
          File: {fileName}
        </div>
      </div>
    </div>
  );
};

export default PromptContent;
