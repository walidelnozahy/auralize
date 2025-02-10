import {
  getSpotifyAccessToken,
  refreshSpotifyAccessToken,
} from '@/utils/spotify/spotify-session';

export const fetchSpotifyData = async (
  endpoint: string,
  method: string = 'GET',
  body?: any,
) => {
  const { accessToken } = await getSpotifyAccessToken();

  let response = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
    method: method,
    headers: { Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify(body),
  });

  if (response.status === 401) {
    console.warn('Spotify access token expired, refreshing...');
    const newAccessToken = await refreshSpotifyAccessToken();

    response = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
      method: method,
      headers: { Authorization: `Bearer ${newAccessToken}` },
      body: JSON.stringify(body),
    });
  }
  console.log('response22222', response);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      `Failed to fetch Spotify data from ${endpoint}: ${error.error?.message || JSON.stringify(error) || 'Unknown error'}`,
    );
  }

  // Handle 204 No Content responses
  if (response.status === 204) {
    return { ok: true };
  }

  return await response.json();
};
