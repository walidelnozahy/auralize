import { NextResponse } from 'next/server';
import { createImageArt } from '@/lib/create-image-art';
import { saveRecord } from '@/lib/supabase/save-record';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = await saveRecord({
      metadata: body,
      status: 'analyzing',
    });
    const record = data?.[0];

    createImageArt(body, record.id);

    return NextResponse.json(record);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 },
    );
  }
}
