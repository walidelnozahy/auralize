import { getRandom, moods } from './prompt-options';
import {
  colorSchemes,
  genres,
  lightingOptions,
  scenes,
} from './prompt-options';
import { styles } from './prompt-options';

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
