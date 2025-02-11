import { useState, useEffect } from 'react';

export function useImages() {
  const [images, setImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchImages = async () => {
    setIsLoading(true);
    const res = await fetch('/api/list-images');
    const imagesData = await res.json();
    setImages(imagesData);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return {
    images,
    isLoading,
    refresh: fetchImages,
  };
}
