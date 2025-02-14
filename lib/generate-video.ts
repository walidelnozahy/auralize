import { writeFile } from 'fs/promises';
import { getPublicUrl } from './supabase/get-image-from-path';
import { saveRecord } from './supabase/save-record';
import { createClient } from './supabase/server';
import Replicate from 'replicate';

export async function generateVideo(
  imageUrl: string,
  prompt: string,
  recordId: string,
) {
  try {
    const supabase = await createClient();
    // Initialize Replicate client
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN!,
    });

    // Generate video using Tencent Hunyuan Video model
    const output = await replicate.run(
      'lightricks/ltx-video:8c47da666861d081eeb4d1261853087de23923a268a69b63febdf5dc1dee08e4',
      {
        input: {
          cfg: 3.5,
          image: imageUrl,
          model: '0.9.1',
          steps: 35,
          length: 97,
          prompt: prompt,
          target_size: 640,
          aspect_ratio: '1:1',
          negative_prompt: 'low quality, worst quality, deformed, distorted',
          image_noise_scale: 0.15,
        },
      },
    );
    console.log('type of output', typeof output);
    console.log('output', output);
    if (!output || !Array.isArray(output) || output.length === 0) {
      throw new Error('Video generation failed');
    }

    // Get the first stream from the output
    const stream = output[0];
    if (!(stream instanceof ReadableStream)) {
      throw new Error('Invalid output format');
    }

    // Convert the stream to a buffer
    const response = new Response(stream);
    const videoBuffer = await response.arrayBuffer();

    // Upload to Supabase Storage
    const { data: storageData, error: storageError } = await supabase.storage
      .from('images')
      .upload(`videos/${recordId}.mp4`, videoBuffer, {
        contentType: 'video/mp4',
        upsert: true,
      });

    if (storageError) throw storageError;

    const generatedVideoPath = storageData?.path;

    // Get public URL for the uploaded video
    const videoUrl = await getPublicUrl(generatedVideoPath || '');

    // Update the record in the database with the video URL
    const { error: dbError } = await supabase
      .from('generated_images')
      .update({ video_url: videoUrl, status: 'done' })
      .eq('id', recordId);

    if (dbError) throw dbError;

    return videoUrl;
  } catch (error) {
    await saveRecord({
      id: recordId,
      status: 'error',
    });
    console.error('Error creating video:', error);
    throw error;
  }
}
