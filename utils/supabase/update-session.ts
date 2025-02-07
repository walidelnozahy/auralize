import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';
import {
  SPOTIFY_ACCESS_TOKEN,
  SPOTIFY_REFRESH_TOKEN,
} from '../spotify/constants';

export const updateSession = async (request: NextRequest) => {
  try {
    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              request.cookies.set(name, value),
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    // This will refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    const error = userError || sessionError;
    console.log('Session Data:', session);
    console.log('User Data:', user);

    // 🚀 Store Spotify tokens in cookies if available
    const providerToken = session?.provider_token;
    const providerRefreshToken = session?.provider_refresh_token;

    if (providerToken && providerRefreshToken) {
      response.cookies.set(SPOTIFY_ACCESS_TOKEN, providerToken, {
        httpOnly: true,
        secure: false,
        path: '/',
      });
      response.cookies.set(SPOTIFY_REFRESH_TOKEN, providerRefreshToken, {
        httpOnly: true,
        secure: false,
        path: '/',
      });

      console.log('Stored Spotify tokens in cookies via middleware.');
    }

    // 🚀 Protected Routes: Redirect if user is not authenticated
    if (request.nextUrl.pathname.startsWith('/protected') && !!error) {
      return NextResponse.redirect(
        new URL('/auth/auth-code-error', request.url),
      );
    }

    // 🚀 Redirect authenticated users from auth pages to protected area
    if (
      (request.nextUrl.pathname === '/' ||
        request.nextUrl.pathname.startsWith('/auth')) &&
      !!user
    ) {
      return NextResponse.redirect(new URL('/protected', request.url));
    }

    return response;
  } catch (e) {
    console.error('Middleware Error:', e);
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
