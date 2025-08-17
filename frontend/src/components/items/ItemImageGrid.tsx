import React from 'react';
import Image from 'next/image';

interface ItemImageGridProps {
  images: string[];
}

const ItemImageGrid: React.FC<ItemImageGridProps> = ({ images }) => {
  return (
    <div className="grid grid-cols-3 gap-2 bg-gray-800 rounded-xl p-4">
      {images.slice(0, 9).map((image, index) => (
        <div
          key={index}
          className="aspect-square rounded-lg overflow-hidden"
        >
          <Image
            src={image}
            alt={`Preview ${index + 1}`}
            width={200}
            height={200}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
          />
        </div>
      ))}
    </div>
  );
};

export default ItemImageGrid;
