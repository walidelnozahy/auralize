import { NextResponse } from 'next/server';
import { openai } from '@/lib/openai/client'; // Import OpenAI instance
import { generateArtPrompt } from '@/lib/openai/generate-art-prompt';
import { uploadImageFromUrl } from '@/lib/supabase/upload-image';
import { saveGeneratedImage } from '@/lib/supabase/store-image-record';
import { generatePublicUrl } from '@/lib/supabase/generate-image-public-url';
import { getPublicUrl } from '@/lib/supabase/get-image-from-path';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const originalImagePath = await uploadImageFromUrl({
      song: body.song,
      artist: body.artist,
      imageUrl: body.imageUrl || '',
    });
    console.log('originalImagePath', originalImagePath);

    const prompt = await generateArtPrompt(body);
    console.log('promptprompt', prompt);
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1024x1024',
    });
    const generatedImageUrl = response.data[0].url;
    const generatedImagePath = await uploadImageFromUrl({
      song: body.song,
      artist: body.artist,
      generated: true,
      imageUrl: generatedImageUrl || '',
    });
    await saveGeneratedImage({
      originalImagePath: originalImagePath || '',
      generatedImagePath: generatedImagePath || '',
      prompt: prompt || '',
      metadata: body,
    });
    const imageUrl = await getPublicUrl(generatedImagePath || '');

    console.log('imageUrl', imageUrl);

    // return NextResponse.json({ imageUrl: response.data[0].url });
    return NextResponse.json(imageUrl);
  } catch (error) {
    console.log('error', error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 },
    );
  }
}
