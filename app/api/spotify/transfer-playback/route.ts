import { getSpotifyAccessToken } from '@/utils/spotify/spotify-session';
import { NextResponse } from 'next/server';

export async function PUT(request: Request) {
  try {
    const { device_id } = await request.json();
    const accessToken = await getSpotifyAccessToken();

    const response = await fetch('https://api.spotify.com/v1/me/player', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        device_ids: [device_id],
        play: true,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to transfer playback');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error transferring playback:', error);
    return NextResponse.json(
      { error: 'Failed to transfer playback' },
      { status: 500 },
    );
  }
}
