import { createClient } from './server';

export async function saveGeneratedImage({
  originalImagePath,
  generatedImagePath,
  prompt,
  metadata,
}: {
  originalImagePath: string;
  generatedImagePath: string;
  prompt: string;
  metadata: {
    song: string;
    artist: string;
    style: string;
    mood: string;
    scene: string;
    genre: string;
    colorScheme: string;
    lighting: string;
  };
}): Promise<boolean> {
  try {
    const supabase = await createClient();

    // Get the authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error('User not authenticated');
    if (!originalImagePath || !generatedImagePath || !prompt)
      throw new Error('Invalid input');
    // Insert the generated image data into the database
    const { data, error } = await supabase.from('generated_images').insert([
      {
        user_id: user.id,
        original_image_path: originalImagePath,
        generated_image_path: generatedImagePath,
        prompt: prompt,
        metadata: metadata,
      },
    ]);

    if (error) {
      console.error('Error saving generated image:', error);
      return false;
    }

    console.log('Generated image saved successfully');
    return true;
  } catch (error) {
    console.error('Error processing database insert:', error);
    return false;
  }
}
