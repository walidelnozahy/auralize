import {
  getSpotifyAccessToken,
  refreshSpotifyAccessToken,
} from '@/utils/spotify/spotify-session';

export const fetchSpotifyData = async (endpoint: string) => {
  const { accessToken } = await getSpotifyAccessToken();

  let response = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (response.status === 401) {
    console.warn('Spotify access token expired, refreshing...');
    const newAccessToken = await refreshSpotifyAccessToken();

    response = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
      headers: { Authorization: `Bearer ${newAccessToken}` },
    });
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch Spotify data from ${endpoint}`);
  }

  return await response.json();
};
