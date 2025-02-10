'use client';

import TrackCarousel from '@/components/tracks-carousel';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import SignOutButton from '@/components/sign-out-button';
import { extractColors } from 'extract-colors';
import AudioVisualizer from '../../components/audio-visualizer';
import {
  AudioLines,
  AudioWaveform,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
} from 'lucide-react';
import { PlayerControls } from '../../components/player-controls';
import { CursorGlow } from '@/components/cursor-glow';
import { Spinner } from '@/components/spinner';
import { useLikedTracks } from '../hooks/useLikedTracks';
import { RadialGlow } from '@/components/radial-glow';

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: any;
  }
}

export default function Player() {
  const { tracks, loading } = useLikedTracks();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoadingPlay, setIsLoadingPlay] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState<any>(null);
  const [deviceId, setDeviceId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Initialize Spotify Web Playback SDK
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'Auralize Web Player',
        getOAuthToken: async (cb: (token: string) => void) => {
          try {
            const res = await fetch('/api/spotify/get-token');
            const data = await res.json();
            const accessToken = data.accessToken;
            if (accessToken) {
              cb(accessToken);
            } else {
              throw new Error('No Spotify access token found');
            }
          } catch (error) {
            setError('Failed to get Spotify access token');
            console.error(error);
          }
        },
        volume: 0.5,
      });

      // Add event listeners
      player.addListener(
        'ready',
        async ({ device_id }: { device_id: string }) => {
          console.log('Ready with Device ID', device_id);
          setDeviceId(device_id);
          // Activate element for mobile browsers
          await player.activateElement();
        },
      );

      player.addListener(
        'not_ready',
        ({ device_id }: { device_id: string }) => {
          console.log('Device ID has gone offline', device_id);
          setDeviceId('');
        },
      );

      player.addListener('player_state_changed', (state: any) => {
        if (!state) {
          return;
        }
        setIsPlaying(!state.paused);
        // Update current track index if changed
        const currentTrackUri = state.track_window.current_track.uri;
        const newIndex = tracks.findIndex(
          (track) => track.uri === currentTrackUri,
        );
        if (newIndex !== -1 && newIndex !== currentIndex) {
          setCurrentIndex(newIndex);
        }
      });

      player.addListener(
        'initialization_error',
        ({ message }: { message: string }) => {
          setError(`Initialization error: ${message}`);
        },
      );

      player.addListener(
        'authentication_error',
        ({ message }: { message: string }) => {
          setError(`Authentication error: ${message}`);
        },
      );

      player.addListener(
        'account_error',
        ({ message }: { message: string }) => {
          setError(`Account error: ${message}`);
        },
      );

      player.connect();
      setPlayer(player);
    };

    return () => {
      if (player) {
        player.disconnect();
      }
      document.body.removeChild(script);
    };
  }, []);
  // useEffect(() => {
  //   if (!player) return;

  //   const updateEnergy = async () => {
  //     const state = await player.getCurrentState();
  //     if (!state) {
  //       console.warn('⚠️ No state received from Spotify player.');
  //       return;
  //     }

  //     setIsPlaying(!state.paused);

  //     if (state.paused) {
  //       console.log('⏸️ Music is paused, setting energy to 0.');

  //       return;
  //     }

  //     const { position, duration, playback_speed } = state;
  //     console.log('state', state);
  //     if (!duration || duration === 0) {
  //       console.warn('⚠️ Invalid track duration:', duration);
  //       return;
  //     }

  //     // Normalize track progress (0 to 1)
  //     const progressRatio = position / duration;

  //     // Estimate beat oscillation (sin wave based on track progress)
  //     const estimatedBeat = Math.sin(progressRatio * Math.PI * playback_speed);

  //     // Ensure energy is within a valid range
  //     const estimatedIntensity = Math.max(
  //       0,
  //       Math.min(1, (estimatedBeat + 1) * 0.5),
  //     );

  //     console.log('🎶 Updated Energy:', estimatedIntensity);
  //     setEnergy(estimatedIntensity);
  //   };

  //   // Run every second ONLY when music is playing
  //   const interval = setInterval(updateEnergy, 1000);

  //   return () => clearInterval(interval);
  // }, [player, isPlaying]);

  const playTrack = async (newIndex: number) => {
    if (!deviceId || !tracks[newIndex]) return;

    try {
      setIsLoadingPlay(true);
      const res = await fetch('/api/spotify/play', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          device_id: deviceId,
          uris: [tracks[newIndex].uri],
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to start playback');
      }
    } catch (error) {
      console.error('Error playing track:', error);
      setError('Failed to play track');
    } finally {
      setIsLoadingPlay(false);
    }
  };

  const nextTrack = async () => {
    if (!player || currentIndex >= tracks.length - 1) return;

    try {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      // Always start fresh playback for the new track
      await playTrack(newIndex);
    } catch (error) {
      console.error('Error skipping to next track:', error);
      setError('Failed to skip to next track');
    }
  };

  const prevTrack = async () => {
    if (!player || currentIndex <= 0) return;

    try {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      // Always start fresh playback for the new track
      await playTrack(newIndex);
    } catch (error) {
      console.error('Error going to previous track:', error);
      setError('Failed to go to previous track');
    }
  };

  const togglePlayPause = async () => {
    if (!player) return;
    try {
      // Optimistically update the UI state
      setIsPlaying(!isPlaying);

      const state = await player.getCurrentState();

      if (!state) {
        // If no state, we need to start fresh playback
        await playTrack(currentIndex);
        return;
      }

      await player.togglePlay();
    } catch (error) {
      // Revert the optimistic update if there's an error
      setIsPlaying(isPlaying);
      console.error('Error toggling playback:', error);
      setError('Failed to toggle playback');
    }
  };
  const controls = [
    {
      title: 'Previous',
      icon: (
        <SkipBack className='h-full w-full text-neutral-500 dark:text-neutral-300' />
      ),
      onClick: prevTrack,
    },
    {
      title: isPlaying ? 'Pause' : 'Play',
      icon: isLoadingPlay ? (
        <Spinner className='h-full w-full text-neutral-500 dark:text-neutral-300' />
      ) : isPlaying ? (
        <Pause className='h-full w-full text-neutral-500 dark:text-neutral-300' />
      ) : (
        <Play className='h-full w-full text-neutral-500 dark:text-neutral-300' />
      ),

      onClick: togglePlayPause,
    },
    {
      title: 'Next',
      icon: (
        <SkipForward className='h-full w-full text-neutral-500 dark:text-neutral-300' />
      ),
      onClick: nextTrack,
    },
  ];

  if (loading)
    return (
      <main className='flex min-h-screen flex-col items-center justify-center bg-background relative'>
        <div className='absolute inset-0 overflow-hidden'>
          <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-foreground/5 to-transparent blur-2xl' />
        </div>
        <Spinner
          size={48}
          className='text-foreground animate-fade-in relative'
        />
      </main>
    );

  if (error) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <p className='text-red-500'>{error}</p>
      </div>
    );
  }

  return (
    <main className=' flex flex-col items-center relative min-h-screen'>
      <RadialGlow url={tracks[currentIndex]?.album?.images[0]?.url} />
      <CursorGlow />
      {/* <AudioVisualizer isPlaying={isPlaying} /> */}
      <div className='flex-1 w-full flex flex-col items-center animate-fade-in-up relative'>
        <nav className='w-full flex justify-center border-b-foreground/10 h-16'>
          <div className='w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm'>
            <AudioLines />
            <SignOutButton />
          </div>
        </nav>
        <div className='flex-1 w-full z-10'>
          <div className='flex-1 w-full flex flex-col gap-2 mt-4 relative'>
            {/* Add left gradient overlay */}
            <div className='absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-20' />

            <TrackCarousel
              tracks={tracks}
              currentIndex={currentIndex}
              setCurrentIndex={async (newIndex) => {
                setCurrentIndex(newIndex);
                await playTrack(newIndex);
              }}
            />

            {/* Add right gradient overlay */}
            <div className='absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-20' />

            <PlayerControls items={controls} />
          </div>
        </div>

        {/* 
        <footer className='w-full'>
          <div className='max-w-5xl mx-auto py-2 px-5 text-center text-xs flex items-center justify-center gap-2'>
            <p className='text-muted-foreground'>
              Built with ❤️ by{' '}
              <a href='https://github.com/walidelnozahy'>Walid Elnozahy</a>
            </p>
          </div>
        </footer> */}
      </div>
    </main>
  );
}
