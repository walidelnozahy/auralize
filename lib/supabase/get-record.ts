import { createClient } from './server';

export async function getRecord(id: string): Promise<any> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('generated_images')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching record:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error processing database query:', error);
    return null;
  }
}
