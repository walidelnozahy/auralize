import { fetchSpotifyData } from '@/lib/spotify/fetch-data';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get offset and limit from URL params
    const searchParams = request.nextUrl.searchParams;
    const offset = searchParams.get('offset') || '0';
    const limit = searchParams.get('limit') || '20';

    // Add params to the API endpoint
    const endpoint = `me/tracks?offset=${offset}&limit=${limit}`;
    const data = await fetchSpotifyData(endpoint);

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch liked tracks' },
      { status: 500 },
    );
  }
}
