'use client';
import React from 'react';
import { Play } from 'lucide-react';
import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { TrackCardProps } from '@/utils/types';
const TrackCard = ({ track, isCurrent }: TrackCardProps) => {
  if (isCurrent) {
    return (
      <CardContainer className='inter-var w-80 cursor-pointer'>
        <BackgroundGradient className='rounded-[22px] h-full'>
          <CardBody className='bg-zinc-900/90 rounded-[22px] border border-white/[0.2] group overflow-hidden h-full flex flex-col cursor-pointer'>
            <CardItem
              translateZ='140'
              className='relative w-full aspect-[4/5] overflow-hidden flex-1'
            >
              <div
                className='absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-500'
                style={{ backgroundImage: `url(${track.album.images[0].url})` }}
              />
              <div className='absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300'>
                <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full'>
                  <div className='flex flex-col items-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300'>
                    <CardItem
                      translateZ='180'
                      as='button'
                      className='bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-xl mb-4'
                    >
                      <Play className='w-6 h-6 text-black' fill='black' />
                    </CardItem>
                    <CardItem
                      translateZ='120'
                      className='text-center w-full px-4'
                    >
                      <h2 className='text-xl font-bold text-white'>
                        {track.name}
                      </h2>
                      <p className='text-white/90 text-sm mt-2'>
                        {track.artists.map((artist) => artist.name).join(', ')}
                      </p>
                    </CardItem>
                  </div>
                </div>
              </div>
            </CardItem>
          </CardBody>
        </BackgroundGradient>
      </CardContainer>
    );
  }

  return (
    <div className='group relative bg-zinc-900/80 rounded-xl shadow-xl w-80 border border-white/[0.1] overflow-hidden cursor-pointer'>
      <div className='aspect-square relative overflow-hidden'>
        <div
          className='absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-all duration-500 grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100'
          style={{ backgroundImage: `url(${track.album.images[0].url})` }}
        />
        <div className='absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300'>
          <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full'>
            <div className='flex flex-col items-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300'>
              <button className='bg-white rounded-full p-3 mb-4'>
                <Play className='w-5 h-5 text-black' />
              </button>
              <h3 className='text-white font-semibold text-lg text-center w-full px-4'>
                {track.name}
              </h3>
              <p className='text-white/80 text-sm mt-2 text-center w-full px-4'>
                {track.artists.map((artist) => artist.name).join(', ')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TrackCard;
