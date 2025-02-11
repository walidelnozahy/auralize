import { cn } from '@/lib/utils';
import React, { useState, useEffect } from 'react';

const AudioWave = ({ className }: { className?: string }) => {
  const [heights, setHeights] = useState<number[]>([]);
  const numBars = 5;

  useEffect(() => {
    const newHeights = Array.from({ length: numBars }, (_, i) => {
      if (i === 0 || i === numBars - 1) return 3;
      return Math.floor(Math.random() * 16 + 8);
    });
    setHeights(newHeights);

    const interval = setInterval(() => {
      setHeights((prev) =>
        prev.map((_, i) => {
          if (i === 0 || i === numBars - 1) {
            return Math.floor(Math.random() * 2 + 3); // 3-4px
          }
          return Math.floor(Math.random() * 20 + 8); // 8-28px
        }),
      );
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={cn('flex items-center justify-center gap-[2px]', className)}
    >
      {heights.map((height, i) => (
        <div
          key={i}
          className={`w-[2px] bg-white rounded-full transform origin-center
            ${i === 0 || i === numBars - 1 ? 'animate-wave-tiny' : 'animate-wave-medium'}`}
          style={{
            height: `${height}px`,
            transition: 'height 1.2s ease-in-out',
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  );
};

export default AudioWave;
