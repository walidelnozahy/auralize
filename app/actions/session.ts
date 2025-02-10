'use server';

import {
  SPOTIFY_ACCESS_TOKEN,
  SPOTIFY_REFRESH_TOKEN,
} from '@/utils/spotify/constants';
import { createClient } from '@/utils/supabase/server';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

export const signInWithSpotifyAction = async (
  redirectTo: string = '/auth/callback',
) => {
  const supabase = await createClient();
  const origin = (await headers()).get('origin');

  const scopes = [
    'user-library-read', // Access liked songs
    'streaming', // Play music
    'user-modify-playback-state', // Control playback (play, pause, next/prev)
    'user-read-playback-state', // Get playback state (needed for player controls)
  ].join(' '); // Join scopes as a space-separated string

  const { error, data } = await supabase.auth.signInWithOAuth({
    provider: 'spotify',
    options: {
      redirectTo: `${origin}${redirectTo}`,
      scopes, // Add scopes here
    },
  });

  if (data.url) {
    redirect(data.url);
  }
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();

  // 🔥 Clear Spotify cookies
  const cookieStore = await cookies();
  cookieStore.set(SPOTIFY_ACCESS_TOKEN, '', {
    httpOnly: true,
    secure: false,
    path: '/',
    maxAge: 0,
  });
  cookieStore.set(SPOTIFY_REFRESH_TOKEN, '', {
    httpOnly: true,
    secure: false,
    path: '/',
    maxAge: 0,
  });

  console.log('Cleared Spotify cookies on logout.');

  return redirect('/');
};
