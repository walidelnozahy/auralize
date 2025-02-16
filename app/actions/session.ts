'use server';

import {
  SPOTIFY_ACCESS_TOKEN_KEY,
  SPOTIFY_REFRESH_TOKEN_KEY,
} from '@/lib/spotify/constants';
import { createClient } from '@/lib/supabase/server';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

export const signInWithSpotifyAction = async () => {
  const supabase = await createClient();
  const origin = (await headers()).get('origin');

  const scopes = [
    'user-library-read', // Access liked songs
    'streaming', // Play music
    'user-modify-playback-state', // Control playback (play, pause, next/prev)
    'user-read-playback-state', // Get playback state (needed for player controls)
  ].join(' '); // Join scopes as a space-separated string

  const { data } = await supabase.auth.signInWithOAuth({
    provider: 'spotify',
    options: {
      redirectTo: `${origin}/auth/callback`,
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
  cookieStore.set(SPOTIFY_ACCESS_TOKEN_KEY, '', {
    httpOnly: true,
    secure: false,
    path: '/',
    maxAge: 0,
  });
  cookieStore.set(SPOTIFY_REFRESH_TOKEN_KEY, '', {
    httpOnly: true,
    secure: false,
    path: '/',
    maxAge: 0,
  });

  console.log('Cleared Spotify cookies on logout.');

  return redirect('/');
};
