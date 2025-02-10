import { SpotifyTrack, Track } from '@/utils/types';
import { useState, useEffect } from 'react';

export function useLikedTracks(currentIndex: number) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isPaginationLoading, setIsPaginationLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const limit = 20;

  const fetchMoreTracks = async () => {
    if (!hasMore || isPaginationLoading) return;

    // Use different loading states for initial load vs pagination
    if (tracks.length === 0) {
      setInitialLoading(true);
    } else {
      setIsPaginationLoading(true);
    }

    try {
      const res = await fetch(
        `/api/spotify/liked-tracks?offset=${offset}&limit=${limit}`,
      );
      const likedTracksData = await res.json();

      const formattedTracks = likedTracksData.items.map(
        (item: SpotifyTrack) => ({
          id: item.track.id,
          name: item.track.name,
          artists: item.track.artists,
          album: item.track.album,
          uri: item.track.uri,
        }),
      );

      setTracks((prev) => [...prev, ...formattedTracks]);
      setOffset((prev) => prev + limit);
      setHasMore(likedTracksData.next !== null);
    } catch (error) {
      console.error('Error fetching liked tracks:', error);
    } finally {
      setInitialLoading(false);
      setIsPaginationLoading(false);
    }
  };

  useEffect(() => {
    if (tracks.length === 0) {
      fetchMoreTracks();
      return;
    }

    if (currentIndex >= tracks.length - 5) {
      fetchMoreTracks();
    }
  }, [currentIndex, tracks.length]);

  return {
    tracks,
    loading: initialLoading,
    isPaginationLoading,
    hasMore,
  };
}
