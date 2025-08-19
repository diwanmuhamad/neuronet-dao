"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { isS3Url, generateRetrievalUrl } from '../../utils/imageUtils';

interface SecureImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  onError?: () => void;
  fallbackSrc?: string;
}

export default function SecureImage({
  src,
  alt,
  width,
  height,
  className,
  onError,
  fallbackSrc = "/placeholder_default.svg"
}: SecureImageProps) {
  const [imageSrc, setImageSrc] = useState<string>(src);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadImage = async () => {
      // If it's not an S3 URL, use the original src
      if (!isS3Url(src)) {
        setImageSrc(src);
        return;
      }

      setIsLoading(true);
      try {
        const retrievalUrl = await generateRetrievalUrl(src);
        if (retrievalUrl) {
          setImageSrc(retrievalUrl);
        } else {
          setImageSrc(fallbackSrc);
        }
      } catch (error) {
        console.error('Error loading secure image:', error);
        setImageSrc(fallbackSrc);
      } finally {
        setIsLoading(false);
      }
    };

    loadImage();
  }, [src, fallbackSrc]);

  const handleError = () => {
    setImageSrc(fallbackSrc);
    onError?.();
  };

  if (isLoading) {
    return (
      <div 
        className={`bg-gray-200 animate-pulse ${className}`}
        style={{ width, height }}
      />
    );
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleError}
    />
  );
}
