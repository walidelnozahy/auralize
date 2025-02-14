import { NextResponse } from 'next/server';
import { saveRecord } from '@/lib/supabase/save-record';
import { generateArt } from '@/lib/generate-art';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = await saveRecord({
      metadata: body,
      status: 'analyzing',
    });
    const record = data?.[0];

    generateArt(body, record.id);

    return NextResponse.json(record);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 },
    );
  }
}
