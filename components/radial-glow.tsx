'use client';

import { extractColors } from 'extract-colors';
import type React from 'react';
import { useState, useEffect } from 'react';

export const RadialGlow: React.FC<{ url: string }> = ({ url }) => {
  const [gradientColors, setGradientColors] = useState<string[]>([
    'rgb(45, 45, 45)',
  ]);

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
          .map((color) => `rgb(${color.red}, ${color.green}, ${color.blue})`);
        setGradientColors(topColors);
      } catch (error) {
        console.error('Error extracting colors:', error);
      }
    };

    getImageColors();
  }, [url]);
  return (
    <div
      className='absolute inset-0 overflow-hidden'
      style={{
        background: `radial-gradient(circle at center, ${gradientColors[0]} 0%, ${gradientColors[1] || 'transparent'} 15%, transparent 30%)`,
        opacity: 0.15,
        filter: 'blur(100px)',
      }}
    />
  );
};
