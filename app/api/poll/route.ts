import { fetchSpotifyData } from '@/lib/spotify/fetch-data';
import { getRecord } from '@/lib/supabase/get-record';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get offset and limit from URL params
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id') || '0';

    // Add params to the API endpoint
    const data = await getRecord(id);

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch liked tracks' },
      { status: 500 },
    );
  }
}
