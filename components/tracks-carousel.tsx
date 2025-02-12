'use client';

import React from 'react';
import TrackCard from './track-card';
import { TrackCarouselProps } from '@/lib/types';

const TrackCarousel = ({
  tracks,
  currentIndex,
  setCurrentIndex,
  tracksArt,
}: TrackCarouselProps) => {
  const getCardStyle = (index: number) => {
    const diff = index - currentIndex;

    let translateX = '0%';
    let scale = 1;
    let opacity = 1;
    let zIndex = 0;

    if (diff === 0) {
      translateX = '0%';
      scale = 1;
      zIndex = 3;
    } else if (Math.abs(diff) === 1) {
      translateX = diff > 0 ? '120%' : '-120%';
      scale = 0.8;
      zIndex = 2;
    } else if (Math.abs(diff) === 2) {
      translateX = diff > 0 ? '220%' : '-220%';
      scale = 0.6;
      zIndex = 1;
    } else {
      opacity = 0;
    }

    return {
      transform: `translateX(${translateX}) scale(${scale})`,
      opacity,
      zIndex,
    };
  };

  // Show tracks within a window of the current index
  const getVisibleTracks = () => {
    const visibleIndices = [];
    // Show 2 tracks before and after the current track
    for (let i = currentIndex - 2; i <= currentIndex + 2; i++) {
      if (i >= 0 && i < tracks.length) {
        visibleIndices.push(i);
      }
    }
    return visibleIndices;
  };

  return (
    <div className='fixed h-[500px] flex items-center justify-center h-fill top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-transparent'>
      <div className='relative w-full h-[500px] mx-auto flex items-center justify-center'>
        {getVisibleTracks().map((index) => (
          <div
            key={`${tracks[index].id}-${index}`}
            className='absolute  transition-all duration-500 ease-in-out cursor-pointer z-20'
            style={getCardStyle(index)}
            onClick={() => setCurrentIndex(index)}
          >
            <TrackCard
              setCurrentIndex={setCurrentIndex}
              track={tracks[index]}
              currentIndex={currentIndex}
              isCurrent={index === currentIndex}
              tracksArt={tracksArt}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackCarousel;
