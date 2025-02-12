import { extractColors } from 'extract-colors';
import { useState, useEffect } from 'react';

export function useExtractedColors(url: string) {
  const [imageColors, setImageColors] = useState<string[]>(['rgb(45, 45, 45)']);

  useEffect(() => {
    const getImageColors = async () => {
      try {
        if (!url) return;

        const colors = await extractColors(url, {
          pixels: 32000,
          distance: 0.15,
          saturationDistance: 0.2,
          lightnessDistance: 0.2,
          hueDistance: 0.083333333,
          colorValidator: (r, g, b, a = 255) => a > 250,
        });

        const sortedColors = colors.sort((a, b) => b.area - a.area);
        const topColors = sortedColors
          .slice(0, 2)
          .map((color) => `${color.hex}`);
        setImageColors(topColors);
      } catch (error) {
        console.error('Error extracting colors:', error);
      }
    };

    getImageColors();
  }, [url]);

  return { imageColors };
}
