const styles = [
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

const moods = [
  'Energetic',
  'Chill',
  'Melancholic',
  'Happy',
  'Dark',
  'Mystical',
  'Trippy',
];

const scenes = [
  'A neon-lit futuristic city with flying cars',
  'A misty enchanted forest with glowing trees',
  'A vast cosmic landscape with swirling galaxies',
  'An underwater kingdom with bioluminescent creatures',
  'A cyberpunk street with holographic billboards',
  'An ancient temple surrounded by golden light',
  'A post-apocalyptic wasteland with ruins',
];

const genres = [
  'Rock',
  'Jazz',
  'Synthwave',
  'Classical',
  'EDM',
  'Lo-Fi',
  'Hip-Hop',
  'Orchestral',
];

const colorSchemes = [
  'Vibrant neon',
  'Pastel tones',
  'Dark moody',
  'Golden sunset',
  'Black and white',
  'Retro 80s',
  'Monochrome',
];

const lightingOptions = [
  'Cinematic lighting',
  'Soft glow',
  'Harsh shadows',
  'Ethereal light rays',
  'Volumetric fog',
  'Sunset glow',
  'Dreamy haze',
];
function getRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
export function generatePrompt({
  songName,
  artist,
  imageDescription,
  extractedColors,
  style = getRandom(styles),
  mood = getRandom(moods),
  scene = getRandom(scenes),
  genre = getRandom(genres),
  colorScheme = getRandom(colorSchemes),
  lighting = getRandom(lightingOptions),
}: {
  songName: string;
  artist: string;
  imageDescription: string;
  extractedColors: string[];
  style?: string;
  mood?: string;
  scene?: string;
  genre?: string;
  colorScheme?: string;
  lighting?: string;
}): string {
  const colorPalette =
    extractedColors?.length > 0 ? extractedColors?.join(', ') : colorScheme;

  return `A ${style} artwork inspired by the song "${songName}" by ${artist}, reflecting its mood: ${mood}. The scene is ${scene}, featuring elements of ${genre}. The colors are inspired by the album cover, which includes shades of ${colorPalette}, creating a cohesive visual experience. 
  
    The album art is described as: "${imageDescription}". The generated artwork should reflect this description, blending its artistic essence with the song’s atmosphere. The composition includes intricate details, designed in a ${lighting} setting. Ultra-detailed, cinematic, and visually stunning.`;
}
