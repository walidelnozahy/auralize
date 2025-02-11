export const generatePublicUrl = (filePath: string) => {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${filePath}`;
};
