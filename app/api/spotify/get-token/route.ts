import { getSpotifyAccessToken } from '@/lib/spotify/spotify-session';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await getSpotifyAccessToken();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch liked tracks' },
      { status: 500 },
    );
  }
}
