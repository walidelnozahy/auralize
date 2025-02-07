import { cookies } from 'next/headers';
import { storeSpotifyTokens } from '@/utils/supabase/server';
import { SPOTIFY_ACCESS_TOKEN, SPOTIFY_REFRESH_TOKEN } from './constants';

export const refreshSpotifyAccessToken = async () => {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('spotify_refresh_token')?.value;

  if (!refreshToken) {
    throw new Error('No refresh token found. User must log in again.');
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Spotify Token Refresh Error:', data);
    throw new Error('Failed to refresh token.');
  }

  // 🔥 Store new access & refresh token using the updated function
  await storeSpotifyTokens(
    data.access_token,
    data.refresh_token ?? refreshToken,
  );

  console.log('Spotify access token refreshed and stored successfully.');
  return data.access_token;
};

export const getSpotifyAccessToken = async () => {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get(SPOTIFY_ACCESS_TOKEN)?.value;
  const refreshToken = cookieStore.get(SPOTIFY_REFRESH_TOKEN)?.value;

  if (!accessToken || !refreshToken) {
    throw new Error('No Spotify token found. User must log in again.');
  }

  return { accessToken, refreshToken };
};
