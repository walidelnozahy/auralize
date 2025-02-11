import { openai } from './client';

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

export async function generateArtPrompt({
  song,
  artist,
  imageUrl,
  extractedColors,
  style = getRandom(styles),
  mood = getRandom(moods),
  scene = getRandom(scenes),
  genre = getRandom(genres),
  colorScheme = getRandom(colorSchemes),
  lighting = getRandom(lightingOptions),
}: {
  song: string;
  artist: string;
  imageUrl: string;
  extractedColors: string[];
  style?: string;
  mood?: string;
  scene?: string;
  genre?: string;
  colorScheme?: string;
  lighting?: string;
}): Promise<string> {
  const colorPalette =
    extractedColors.length > 0 ? extractedColors.join(', ') : colorScheme;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          "You are an AI designed to analyze album cover art and generate an AI art prompt for digital artwork. Describe the image with artistic depth and generate a unique AI prompt using the song's details.",
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Analyze this album cover and generate an AI art prompt that blends the song's essence with the image. 
              Use artistic language, composition, mood, and colors while ensuring visual coherence. 
              The song details:
              - Song: "${song}"
              - Artist: "${artist}"
              - Style: ${style}
              - Mood: ${mood}
              - Scene: ${scene}
              - Genre Influence: ${genre}
              - Color Scheme (from extracted colors): ${colorPalette}
              - Lighting: ${lighting}
              
              Make the AI-generated prompt detailed, cinematic, and visually stunning.`,
          },
          { type: 'image_url', image_url: { url: imageUrl } },
        ],
      },
    ],
  });

  return response.choices[0].message.content || 'No prompt generated.';
}
