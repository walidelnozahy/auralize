import { generateVideo } from './generate-video';
import { openai } from './openai/client';
import { generateArtPrompt } from './openai/generate-art-prompt';
import { getPublicUrl } from './supabase/get-image-from-path';
import { saveRecord } from './supabase/save-record';
import { uploadImageFromUrl } from './supabase/upload-image';

export async function generateArt(body: any, recordId: string) {
  try {
    const originalImagePath = await uploadImageFromUrl({
      song: body.song,
      artist: body.artist,
      imageUrl: body.imageUrl || '',
    });

    const prompt = await generateArtPrompt(body);
    generateVideo(body.imageUrl || '', prompt || '', recordId);
    return;
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
    });
    generateVideo(generatedImagePath || '', prompt || '', recordId);

    const imageUrl = await getPublicUrl(generatedImagePath || '');
    return imageUrl;
  } catch (error) {
    await saveRecord({
      id: recordId,
      status: 'error',
    });
    console.error('Error creating image art:', error);
    throw error;
  }
}
