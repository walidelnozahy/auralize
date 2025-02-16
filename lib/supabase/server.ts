import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import {
  SPOTIFY_ACCESS_TOKEN_KEY,
  SPOTIFY_REFRESH_TOKEN_KEY,
} from '../spotify/constants';

export const createClient = async () => {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
};

// 🔥 New Function: Store Spotify Tokens Like Supabase
export const storeSpotifyTokens = async (
  accessToken: string,
  refreshToken: string,
) => {
  try {
    const cookieStore = await cookies();

    cookieStore.set(SPOTIFY_ACCESS_TOKEN_KEY, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    cookieStore.set(SPOTIFY_REFRESH_TOKEN_KEY, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    console.log('Spotify tokens stored successfully!');
  } catch (error) {
    console.error('Error storing Spotify tokens:', error);
  }
};
