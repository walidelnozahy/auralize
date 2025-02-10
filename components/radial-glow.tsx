'use client';

import type React from 'react';

export const RadialGlow: React.FC<{ gradientColors: string[] }> = ({
  gradientColors,
}) => {
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
