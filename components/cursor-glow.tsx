'use client';

import type React from 'react';
import { useState, useEffect } from 'react';

export const CursorGlow: React.FC<{ imageColors: string[] }> = ({
  imageColors,
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updatePosition);

    return () => window.removeEventListener('mousemove', updatePosition);
  }, []);

  return (
    <div
      className='pointer-events-none fixed inset-0  transition duration-300 lg:absolute -z-10'
      style={{
        background: `radial-gradient(600px at ${position.x}px ${position.y}px, ${imageColors[0]}, transparent 80%)`,
      }}
    />
  );
};
