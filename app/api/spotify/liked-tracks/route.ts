import { fetchSpotifyData } from '@/utils/spotify/fetch-data';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await fetchSpotifyData('me/tracks');
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch liked tracks' },
      { status: 500 },
    );
  }
}
