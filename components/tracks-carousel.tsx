'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import TrackCard from './track-card';
import { TrackCarouselProps } from '@/utils/types';

const TrackCarousel = ({
  tracks,
  currentIndex,
  setCurrentIndex,
}: TrackCarouselProps) => {
  const getCardStyle = (index: number) => {
    const diff = (index - currentIndex + tracks.length) % tracks.length;
    const adjustedDiff = diff > tracks.length / 2 ? diff - tracks.length : diff;

    let translateX = '0%';
    let scale = 1;
    let opacity = 1;
    let zIndex = 0;

    if (adjustedDiff === 0) {
      scale = 1;
      zIndex = 3;
    } else if (Math.abs(adjustedDiff) === 1) {
      translateX = adjustedDiff > 0 ? '90%' : '-90%';
      scale = 0.8;
      // opacity = 0.6;
      zIndex = 2;
    } else if (Math.abs(adjustedDiff) === 2) {
      translateX = adjustedDiff > 0 ? '175%' : '-175%';
      scale = 0.6;
      // opacity = 0.3;
      zIndex = 1;
    } else {
      // opacity = 0;
    }

    return {
      transform: `translateX(${translateX}) scale(${scale})`,
      opacity,
      zIndex,
    };
  };

  return (
    <div className='relative h-[600px] w-full overflow-hidden'>
      {/* Carousel Content */}
      <div className='absolute inset-0 flex items-center justify-center'>
        {tracks.map((track, index) => (
          <div
            key={track.id}
            className='absolute transition-all duration-300 ease-in-out'
            style={getCardStyle(index)}
            onClick={() => setCurrentIndex(index)}
          >
            <TrackCard track={track} isCurrent={index === currentIndex} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackCarousel;
