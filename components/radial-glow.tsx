'use client';

import type React from 'react';

export const RadialGlow: React.FC<{ imageColors: string[] }> = ({
  imageColors,
}) => {
  return (
    <div
      className='absolute inset-0 overflow-hidden -z-1'
      style={{
        // backgroundColor: imageColors[0],
        background: `radial-gradient(circle at center, ${imageColors[0]}, ${imageColors[1]})`,
        // opacity: 0.2,
        // filter: 'blur(82px)',
      }}
    />
  );
};
