import { createClient } from './server';

export async function uploadImageFromUrl({
  song,
  artist,
  generated,
  imageUrl,
}: {
  song: string;
  artist: string;
  generated?: boolean;
  imageUrl: string;
}): Promise<string | null> {
  try {
    const supabase = await createClient();
    // Get the authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error('User not authenticated');

    // Fetch the image from the URL
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error('Failed to fetch image');

    // Convert to Blob
    const imageBlob = await response.blob();
    const fileExtension = imageBlob.type.split('/')[1] || 'jpg'; // Default to JPG

    // Sanitize file name
    const sanitizeForFileName = (str: string) =>
      str
        ?.trim()
        ?.replace(/[^a-zA-Z0-9\s-]/g, '')
        .replace(/\s+/g, '_') || 'untitled';
    const source = generated ? 'generated' : 'original';
    const safeFileName = `${sanitizeForFileName(song)}-${sanitizeForFileName(
      artist,
    )}-${source}-${Date.now()}.${fileExtension}`;
    const filePath = `${source}/${user.id}/${safeFileName}`;

    // Upload to Supabase Storage with metadata
    const { data, error } = await supabase.storage
      .from('images') // Your bucket name
      .upload(filePath, imageBlob, {
        contentType: imageBlob.type,
        upsert: true, // Overwrites if a file with the same name exists
      });

    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }

    // Get the public URL of the uploaded image
    const path = data?.path;

    return path;
  } catch (error) {
    console.error('Error processing image upload:', error);
    return null;
  }
}
