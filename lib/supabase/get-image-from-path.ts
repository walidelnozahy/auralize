import { createClient } from './server';

export async function getPublicUrl(path: string) {
  if (!path) return '';

  const supabase = await createClient();
  const { data } = supabase.storage.from('images').getPublicUrl(path);
  return data.publicUrl;
}
export async function getImageSignedFromPath(path: string) {
  if (!path) return '';
  console.log('path', path);
  const supabase = await createClient();
  const response = await supabase.storage
    .from('images')
    .createSignedUrl(path, 60 * 60 * 24 * 365);
  console.log('generated image signed url', response);
  if (!response?.data?.signedUrl) return '';
  return response.data.signedUrl;
}
