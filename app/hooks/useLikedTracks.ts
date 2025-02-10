import { SpotifyTrack, Track } from '@/utils/types';
import { useState, useEffect } from 'react';

export function useLikedTracks() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch('/api/spotify/liked-tracks');
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
        setTracks(formattedTracks);
      } catch (error) {
        console.error('Error fetching liked tracks:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { tracks, loading };
}
