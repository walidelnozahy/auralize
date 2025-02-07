'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { images: { url: string }[] };
}

interface LikedTracksCarouselProps {
  tracks: Track[];
}

export default function LikedTracksCarousel({
  tracks,
}: LikedTracksCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTrack = () => setCurrentIndex((prev) => (prev + 1) % tracks.length);
  const prevTrack = () =>
    setCurrentIndex((prev) => (prev - 1 + tracks.length) % tracks.length);

  return (
    <div className='relative w-full flex items-center justify-center h-[400px]'>
      {/* Previous Track */}
      <motion.div
        key={tracks[(currentIndex - 1 + tracks.length) % tracks.length].id}
        className='absolute left-10 opacity-50 scale-90'
        initial={{ opacity: 0, x: -100, scale: 0.8 }}
        animate={{ opacity: 0.5, x: 0, scale: 0.9 }}
        exit={{ opacity: 0, x: -100, scale: 0.8 }}
        transition={{ duration: 0.4 }}
      >
        <TrackCard
          track={tracks[(currentIndex - 1 + tracks.length) % tracks.length]}
        />
      </motion.div>

      {/* Current Track */}
      <AnimatePresence mode='wait'>
        <motion.div
          key={tracks[currentIndex].id}
          className='z-10'
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5 }}
        >
          <TrackCard track={tracks[currentIndex]} large />
        </motion.div>
      </AnimatePresence>

      {/* Next Track */}
      <motion.div
        key={tracks[(currentIndex + 1) % tracks.length].id}
        className='absolute right-10 opacity-50 scale-90'
        initial={{ opacity: 0, x: 100, scale: 0.8 }}
        animate={{ opacity: 0.5, x: 0, scale: 0.9 }}
        exit={{ opacity: 0, x: 100, scale: 0.8 }}
        transition={{ duration: 0.4 }}
      >
        <TrackCard track={tracks[(currentIndex + 1) % tracks.length]} />
      </motion.div>

      {/* Navigation Buttons */}
      <button
        onClick={prevTrack}
        className='absolute left-0 p-3 text-white bg-black/40 rounded-full'
      >
        ◀
      </button>
      <button
        onClick={nextTrack}
        className='absolute right-0 p-3 text-white bg-black/40 rounded-full'
      >
        ▶
      </button>
    </div>
  );
}

// Reusable Track Card Component
function TrackCard({ track, large }: { track: Track; large?: boolean }) {
  return (
    <div
      className={`relative flex flex-col items-center justify-center p-4 rounded-2xl shadow-xl bg-black/80 backdrop-blur-md ${
        large ? 'w-[280px] h-[340px]' : 'w-[200px] h-[260px]'
      }`}
    >
      <img
        src={track.album.images[0].url}
        alt={track.name}
        className={`rounded-lg ${large ? 'w-48 h-48' : 'w-36 h-36'}`}
      />
      <h3 className='text-white text-lg font-semibold mt-4'>{track.name}</h3>
      <p className='text-gray-400 text-sm'>
        {track.artists.map((artist) => artist.name).join(', ')}
      </p>
    </div>
  );
}
