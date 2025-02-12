'use client';
import React from 'react';
import { Play, Download, Share2, Wand2 } from 'lucide-react';
import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { TrackCardProps } from '@/lib/types';
import AudioWave from './audio-wave';
import { Button } from '@/components/ui/button';

const TrackCard = ({
  track,
  setCurrentIndex,
  currentIndex,
  isCurrent,
  tracksArt,
}: TrackCardProps) => {
  if (isCurrent) {
    return (
      <CardContainer className=' '>
        <BackgroundGradient className='rounded-[22px] '>
          <CardBody className='bg-zinc-900/90 rounded-[22px] border border-white/[0.2] group overflow-hidden h-full flex flex-col'>
            <div className='relative w-full aspect-[4/5] overflow-hidden flex-1'>
              <div
                className='absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-500 z-100'
                style={{
                  backgroundImage: `url(${tracksArt?.[track.id]?.imageUrl || track.album.images[0].url})`,
                  transition: 'background-image 0.5s ease-in-out',
                }}
              />
              <div className='absolute h-full w-full inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center'>
                <div className='flex flex-col items-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300'>
                  <div
                    className='bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-xl mb-4'
                    onClick={() => setCurrentIndex(currentIndex)}
                  >
                    <Play className='w-6 h-6 text-black' fill='black' />
                  </div>
                  <div className='text-center w-full px-4 flex flex-col items-center justify-center gap-2'>
                    <h2 className='text-xl font-bold text-white'>
                      {track.name}
                    </h2>
                    <p className='text-white/90 text-sm mt-2'>
                      {track.artists.map((artist) => artist.name).join(', ')}
                    </p>
                    {/* <Button
                      variant='secondary'
                      size='sm'
                      onClick={() => generateImage()}
                    >
                      <Wand2 className='h-4 w-4 mr-2' />
                      Reimagine
                    </Button> */}
                    {tracksArt?.[track.id]?.imageUrl && (
                      <div className='flex justify-center gap-2 mt-4'>
                        <Button variant='secondary' size='icon'>
                          <Download className='h-4 w-4' />
                        </Button>

                        <Button variant='secondary' size='icon'>
                          <Share2 className='h-4 w-4' />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </BackgroundGradient>
      </CardContainer>
    );
  }

  return (
    <div className='group relative bg-zinc-900/80 rounded-xl shadow-xl w-80 border border-white/[0.1] overflow-hidden cursor-pointer'>
      <div className='aspect-square relative overflow-hidden'>
        <div
          className='absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-all duration-500'
          style={{
            backgroundImage: `url(${tracksArt?.[track.id]?.imageUrl || track.album.images[0].url})`,
            transition: 'background-image 0.5s ease-in-out',
          }}
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
