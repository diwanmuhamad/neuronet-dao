import React from 'react';
import Image from 'next/image';

interface RelatedAppProps {
  images: string[];
  title: string;
}

const RelatedApp: React.FC<RelatedAppProps> = ({ images, title }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex items-center gap-3">
        <div className="grid grid-cols-3 gap-1 w-12 h-12">
          {images.slice(0, 3).map((image, index) => (
            <div
              key={index}
              className="aspect-square rounded overflow-hidden"
            >
              <Image
                src={image}
                alt={`Related ${index + 1}`}
                width={50}
                height={50}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        <div className="flex-1">
          <div className="text-white font-medium text-sm">
            {title}
          </div>
          <div className="text-gray-400 text-xs">Related app</div>
        </div>
        <div className="text-white text-sm">2 ►</div>
      </div>
    </div>
  );
};

export default RelatedApp;
