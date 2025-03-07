'use client';

import TrackCarousel from '@/components/tracks-carousel';
import { useEffect, useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import debounce from 'lodash/debounce';
import {
  AudioLines,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
import { PlayerControls } from '../../components/player-controls';
import { CursorGlow } from '@/components/cursor-glow';
import { useLikedTracks } from '../hooks/use-liked-tracks';
import { RadialGlow } from '@/components/radial-glow';
import { OrganicSphere } from '@/components/sphere';
import { useExtractedColors } from '../hooks/use-extracted-colors';
import AudioWave from '@/components/audio-wave';
import { ListImages } from '@/components/list-images';
import { useImages } from '../hooks/use-images';
import { generatePublicUrl } from '@/lib/supabase/generate-image-public-url';
import { getRandom, promptOptions } from '@/lib/prompt-options';
import { StatusSpinner } from '@/components/status-spinner';

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: any;
  }
}

export default function Player() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { tracks, loading, isPaginationLoading } = useLikedTracks(currentIndex);
  const [isLoadingPlay, setIsLoadingPlay] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState<any>(null);
  const [deviceId, setDeviceId] = useState<string>('');
  const [promptSettings, setPromptSettings] = useState(() => {
    return Object.keys(promptOptions).reduce(
      (acc, key) => ({
        ...acc,
        [key]: getRandom(promptOptions[key as keyof typeof promptOptions]),
      }),
      {},
    );
  });
  const { toast } = useToast();
  const { images, isLoading: isLoadingImages, refresh } = useImages();
  const { imageColors } = useExtractedColors(
    tracks[currentIndex]?.album?.images[0]?.url,
  );

  const [tracksArt, setTracksArt] = useState<{
    [key: string]: { imageUrl: string };
  }>({});

  const [createdRecord, setCreatedRecord] = useState<any>(null);
  const generateImage = async () => {
    if (
      !tracks[currentIndex] ||
      (createdRecord && createdRecord?.status !== 'done')
    )
      return;

    try {
      setCreatedRecord({
        id: null,
        status: 'analyzing',
      });
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        body: JSON.stringify({
          trackId: tracks[currentIndex].id,
          song: tracks[currentIndex].name,
          artist: tracks[currentIndex].artists[0].name,
          imageUrl: tracks[currentIndex].album.images[0].url,
          extractedColors: imageColors,
          ...promptSettings,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      setCreatedRecord(data);
      console.log('data', data);
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate artwork',
      });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!createdRecord?.id || createdRecord?.status === 'done') return;
      fetch(`/api/poll?id=${createdRecord?.id}`)
        .then((res) => res.json())
        .then((data) => {
          console.log('data', data);
          setCreatedRecord(data);
          if (data?.status === 'done') {
            const imageUrl = generatePublicUrl(data?.generated_image_path);
            setTracksArt((prev) => ({
              ...prev,
              [tracks[currentIndex].id]: {
                ...tracks[currentIndex].album.images[0],
                imageUrl,
              },
            }));
            refresh();
          }
        });
    }, 2000);
    return () => clearInterval(interval);
  }, [createdRecord]);
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

            cb(accessToken);
          } catch (error) {
            toast({
              title: 'Authentication Error',
              description: 'Failed to get Spotify access token',
              variant: 'destructive',
            });
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
          toast({
            title: 'Initialization Error',
            description: message,
            variant: 'destructive',
          });
        },
      );

      player.addListener(
        'account_error',
        ({ message }: { message: string }) => {
          toast({
            title: 'Account Error',
            description: message,
            variant: 'destructive',
          });
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

  // Create a debounced version of playTrack
  const debouncedPlayTrack = useCallback(
    debounce(async (newIndex: number) => {
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
        toast({
          title: 'Playback Error',
          description: 'Failed to play track',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingPlay(false);
      }
    }, 300), // 300ms delay
    [deviceId, tracks, toast],
  );

  // Update handleTrackChange to use debounced playTrack
  const handleTrackChange = async (newIndex: number) => {
    setCurrentIndex(newIndex);
    setCreatedRecord(null);
    await debouncedPlayTrack(newIndex);
  };

  // Update nextTrack to use debounced playTrack
  const nextTrack = async () => {
    if (!player || currentIndex >= tracks.length - 1) return;

    try {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      await debouncedPlayTrack(newIndex);
    } catch (error) {
      console.error('Error skipping to next track:', error);
      toast({
        title: 'Playback Error',
        description: 'Failed to skip to next track',
        variant: 'destructive',
      });
    }
  };

  // Update prevTrack to use debounced playTrack
  const prevTrack = async () => {
    if (!player || currentIndex <= 0) return;

    try {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      await debouncedPlayTrack(newIndex);
    } catch (error) {
      console.error('Error going to previous track:', error);
      toast({
        title: 'Playback Error',
        description: 'Failed to go to previous track',
        variant: 'destructive',
      });
    }
  };

  // Clean up debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedPlayTrack.cancel();
    };
  }, [debouncedPlayTrack]);

  const togglePlayPause = async () => {
    if (!player) return;
    try {
      // Optimistically update the UI state
      setIsPlaying(!isPlaying);

      const state = await player.getCurrentState();

      if (!state) {
        // If no state, we need to start fresh playback
        await debouncedPlayTrack(currentIndex);
        return;
      }

      await player.togglePlay();
    } catch (error) {
      // Revert the optimistic update if there's an error
      setIsPlaying(isPlaying);
      console.error('Error toggling playback:', error);
      toast({
        title: 'Playback Error',
        description: 'Failed to toggle playback',
        variant: 'destructive',
      });
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
      icon:
        isLoadingPlay || isPaginationLoading ? (
          <AudioWave />
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
    {
      title: 'Settings',
      icon: (
        <SlidersHorizontal className='h-full w-full text-neutral-500 dark:text-neutral-300' />
      ),
      onClick: (key: string, value: string) => {
        setPromptSettings((prev) => ({
          ...prev,
          [key]: value,
        }));
      },
    },
    {
      title: 'Generate',
      icon: (
        <Sparkles className='h-full w-full text-neutral-500 dark:text-neutral-300' />
      ),
      isPrimary: true,
      onClick: () => {
        generateImage();
      },
    },
  ];

  if (loading)
    return (
      <main className='flex min-h-screen flex-col items-center justify-center bg-background relative'>
        <RadialGlow imageColors={imageColors} />
        <CursorGlow imageColors={imageColors} />
        <AudioWave className='scale-150' />
      </main>
    );

  return (
    <main className={`flex flex-col items-center min-h-screen relative`}>
      <RadialGlow imageColors={imageColors} />
      <OrganicSphere isPlaying={isPlaying} imageColors={imageColors} />
      <CursorGlow imageColors={imageColors} />

      <nav className='w-full flex justify-center border-b-foreground/10 h-16 bg-transparent relative z-100'>
        <div className='w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm'>
          <AudioLines />
          <ListImages images={images} isLoading={isLoadingImages} />
        </div>
      </nav>
      <div className='flex-1 animate-fade-in-up h-full w-full relative'>
        {!tracks.length ? (
          <div className='flex items-center justify-center'>
            <p className='text-gray-500'>No tracks found</p>
          </div>
        ) : (
          <>
            {/* Add left gradient overlay */}
            <div className='absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-background to-transparent z-20' />
            <TrackCarousel
              tracks={tracks}
              currentIndex={currentIndex}
              setCurrentIndex={handleTrackChange}
              tracksArt={tracksArt}
            />
            {/* Add right gradient overlay */}
            <div className='absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-background to-transparent z-20' />
            <div className='fixed bottom-10 left-1/2 -translate-x-1/2 w-fit'>
              <StatusSpinner status={createdRecord?.status} />
              <PlayerControls
                promptSettings={promptSettings}
                items={controls}
              />
            </div>
          </>
        )}
      </div>
    </main>
  );
}
