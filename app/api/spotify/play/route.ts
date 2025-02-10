// app/api/spotify/play/route.ts
import { fetchSpotifyData } from '@/utils/spotify/fetch-data';
import { NextResponse } from 'next/server';

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { device_id, uris } = body;

    const result = await fetchSpotifyData(
      `me/player/play?device_id=${device_id}`,
      'PUT',
      { uris },
    );

    if (!result.ok) {
      throw new Error('Failed to start playback');
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error playing track:', error);
    return NextResponse.json(
      { error: 'Failed to play track' },
      { status: 500 },
    );
  }
}
