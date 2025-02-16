import { openai } from './openai/client';
import { generateArtPrompt } from './openai/generate-art-prompt';
import { generatePublicUrl } from './supabase/generate-image-public-url';
import { saveRecord } from './supabase/save-record';
import { uploadImageFromUrl } from './supabase/upload-image';

export async function createImageArt(body: any, recordId: string) {
  try {
    const originalImagePath = await uploadImageFromUrl({
      song: body.song,
      artist: body.artist,
      imageUrl: body.imageUrl || '',
    });

    const prompt = await generateArtPrompt(body);

    await saveRecord({
      id: recordId,
      metadata: body,
      status: 'processing',
    });
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
    await saveRecord({
      id: recordId,
      originalImagePath: originalImagePath || '',
      generatedImagePath: generatedImagePath || '',
      prompt: prompt || '',
      metadata: body,
      status: 'done',
    });

    const imageUrl = await generatePublicUrl(generatedImagePath || '');
    return imageUrl;
  } catch (error) {
    console.error('Error creating image art:', error);
    throw error;
  }
}
