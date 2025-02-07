'use server';

import { fetchSpotifyData } from '@/utils/spotify/fetch-data';

export const getUserPlaylists = async () => {
  return fetchSpotifyData('me/playlists');
};

export const getUserLikedTracks = async () => {
  return fetchSpotifyData('me/tracks');
};
