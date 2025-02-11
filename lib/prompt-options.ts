export const styles = [
  'Cyberpunk',
  'Fantasy',
  'Surrealism',
  'Watercolor',
  'Anime',
  'Impressionism',
  'Futuristic',
  'Dark Gothic',
  'Minimalist',
  'Dreamy',
  'Abstract',
];

export const moods = [
  'Energetic',
  'Chill',
  'Melancholic',
  'Happy',
  'Dark',
  'Mystical',
  'Trippy',
];

export const scenes = [
  'A neon-lit futuristic city with flying cars',
  'A misty enchanted forest with glowing trees',
  'A vast cosmic landscape with swirling galaxies',
  'An underwater kingdom with bioluminescent creatures',
  'A cyberpunk street with holographic billboards',
  'An ancient temple surrounded by golden light',
  'A post-apocalyptic wasteland with ruins',
];

export const genres = [
  'Rock',
  'Jazz',
  'Synthwave',
  'Classical',
  'EDM',
  'Lo-Fi',
  'Hip-Hop',
  'Orchestral',
];

export const colorSchemes = [
  'Vibrant neon',
  'Pastel tones',
  'Dark moody',
  'Golden sunset',
  'Black and white',
  'Retro 80s',
  'Monochrome',
];

export const lightingOptions = [
  'Cinematic lighting',
  'Soft glow',
  'Harsh shadows',
  'Ethereal light rays',
  'Volumetric fog',
  'Sunset glow',
  'Dreamy haze',
];

export function getRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
