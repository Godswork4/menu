import React, { useState } from 'react';
import { Image, ImageProps, ImageStyle } from 'react-native';
import { IMAGES, getImageWithFallback } from '@/constants/Images';

interface ImageWithFallbackProps extends Omit<ImageProps, 'source'> {
  source: string | null | undefined;
  fallback?: string;
  style?: ImageStyle;
}

export default function ImageWithFallback({ 
  source, 
  fallback = IMAGES.DEFAULT_FOOD, 
  style,
  ...props 
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const imageSource = hasError ? fallback : getImageWithFallback(source, fallback);

  return (
    <Image
      {...props}
      source={{ uri: imageSource }}
      style={[style, isLoading && { backgroundColor: '#F5F5F5' }]}
      onError={() => {
        setHasError(true);
        setIsLoading(false);
      }}
      onLoad={() => setIsLoading(false)}
      onLoadStart={() => setIsLoading(true)}
    />
  );
}