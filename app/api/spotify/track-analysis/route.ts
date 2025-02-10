import { NextResponse } from 'next/server';
import { fetchSpotifyData } from '@/utils/spotify/fetch-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const trackId = searchParams.get('trackId');

  if (!trackId) {
    return NextResponse.json(
      { error: 'Track ID is required' },
      { status: 400 },
    );
  }

  try {
    const response = await fetchSpotifyData(`audio-analysis/${trackId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch track analysis');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch track analysis' },
      { status: 500 },
    );
  }
}
