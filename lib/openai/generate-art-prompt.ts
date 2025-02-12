import { promptOptions } from '../prompt-options';
import { openai } from './client';

function getRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function generateArtPrompt({
  song,
  artist,
  imageUrl,
  extractedColors,
  style = getRandom(promptOptions.style),
  mood = getRandom(promptOptions.mood),
  scene = getRandom(promptOptions.scene),
  genre = getRandom(promptOptions.genre),
  colorScheme = getRandom(promptOptions.colorScheme),
  lighting = getRandom(promptOptions.lighting),
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
          "You are an AI designed to analyze album cover art and generate a highly detailed AI art prompt. Prioritize the composition, colors, and mood of the provided image while ensuring coherence with the song's theme. Use artistic language to enhance the visual description.",
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Analyze this album cover and generate an AI art prompt that primarily reflects the visual elements of the image while incorporating the song’s essence. 
                The song details are additional inspiration but should not override the image's core aesthetic.
                
                - Song: "${song}"
                - Artist: "${artist}"
                - Influences (for subtle guidance): 
                  - Style: ${style}
                  - Mood: ${mood}
                  - Scene: ${scene}
                  - Genre Influence: ${genre}
                  - Color Scheme (from extracted colors): ${colorPalette}
                  - Lighting: ${lighting}
  
                Ensure the AI-generated prompt is highly descriptive, cinematic, and visually compelling.`,
          },
          { type: 'image_url', image_url: { url: imageUrl } },
        ],
      },
    ],
  });

  return response.choices[0].message.content || 'No prompt generated.';
}
