import { createClient, storeSpotifyTokens } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('Spotify Auth Callback Error:', error);
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }

  // Extract tokens
  const providerToken = data.session?.provider_token;
  const providerRefreshToken = data.session?.provider_refresh_token;

  if (providerToken && providerRefreshToken) {
    // 🔥 Store Spotify tokens using the new function
    await storeSpotifyTokens(providerToken, providerRefreshToken);
    console.log('Stored Spotify tokens successfully via Server Component.');
  }

  return NextResponse.redirect(`${origin}/protected`);
}
