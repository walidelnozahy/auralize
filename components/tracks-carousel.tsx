'use client';

import React from 'react';
import TrackCard from './track-card';
import { TrackCarouselProps } from '@/lib/types';

const TrackCarousel = ({
  tracks,
  currentIndex,
  setCurrentIndex,
  tracksArt,
  isLoadingImage,
  generateImage,
}: TrackCarouselProps) => {
  const getCardStyle = (index: number) => {
    const diff = index - currentIndex;

    let translateX = '0%';
    let scale = 1;
    let opacity = 1;
    let zIndex = 0;

    if (diff === 0) {
      scale = 1;
      zIndex = 3;
    } else if (Math.abs(diff) === 1) {
      translateX = diff > 0 ? '90%' : '-90%';
      scale = 0.8;
      zIndex = 2;
    } else if (Math.abs(diff) === 2) {
      translateX = diff > 0 ? '175%' : '-175%';
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
    <div className='relative h-[500px] w-full overflow-hidden'>
      {tracks.length === 0 ? (
        <div className='flex h-full items-center justify-center'>
          <p className=' text-gray-500'>No tracks found</p>
        </div>
      ) : (
        <div className='absolute inset-0 flex items-center justify-center'>
          {getVisibleTracks().map((index) => (
            <div
              key={`${tracks[index].id}-${index}`}
              className='absolute transition-all duration-300 ease-in-out '
              style={getCardStyle(index)}
              onClick={() => setCurrentIndex(currentIndex)}
            >
              <TrackCard
                setCurrentIndex={setCurrentIndex}
                track={tracks[index]}
                currentIndex={currentIndex}
                isCurrent={index === currentIndex}
                tracksArt={tracksArt}
                isLoadingImage={isLoadingImage}
                generateImage={generateImage}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrackCarousel;
