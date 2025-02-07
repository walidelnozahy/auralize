'use client';
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

interface SpotifyTrack {
  id: string;
  name: string;
  artists: any[];
  album: any;
}

const TrackCarousel = ({ tracks }: { tracks: SpotifyTrack[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextTrack = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prev) => (prev + 1) % tracks.length);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const prevTrack = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

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
      translateX = adjustedDiff > 0 ? '80%' : '-80%';
      scale = 0.85;
      opacity = 0.7;
      zIndex = 2;
    } else if (Math.abs(adjustedDiff) === 2) {
      translateX = adjustedDiff > 0 ? '160%' : '-160%';
      scale = 0.7;
      opacity = 0.4;
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

  return (
    <div className='relative h-screen w-full bg-gradient-to-b from-gray-900 to-black overflow-hidden'>
      <div className='absolute inset-0 flex items-center justify-center'>
        {tracks.map((track, index) => (
          <div
            key={track.id}
            className='absolute w-80 transition-all duration-300 ease-in-out'
            style={getCardStyle(index)}
          >
            <div className='bg-gray-800 rounded-lg shadow-xl overflow-hidden'>
              <div className='relative group'>
                <img
                  src={track.album.images[0].url}
                  alt={track.name}
                  className='w-full aspect-square object-cover'
                />
                <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center'>
                  <button className='opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-green-500 rounded-full p-4'>
                    <Play className='w-6 h-6 text-white' />
                  </button>
                </div>
              </div>
              <div className='p-4'>
                <h3 className='text-white font-semibold truncate'>
                  {track.name}
                </h3>
                <p className='text-gray-400 text-sm truncate'>
                  {track.artists.map((artist) => artist.name).join(', ')}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className='absolute bottom-8 left-0 right-0 flex justify-center gap-4'>
        <button
          onClick={prevTrack}
          className='bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full p-3 text-white'
          disabled={isAnimating}
        >
          <ChevronLeft className='w-6 h-6' />
        </button>
        <button
          onClick={nextTrack}
          className='bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full p-3 text-white'
          disabled={isAnimating}
        >
          <ChevronRight className='w-6 h-6' />
        </button>
      </div>
    </div>
  );
};

export default TrackCarousel;
