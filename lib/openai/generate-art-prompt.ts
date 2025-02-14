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
          'You are an AI designed to analyze album cover art and generate a single, highly descriptive AI prompt that can be used for both still image and video generation. The output should be cinematic, visually rich, and dynamic enough to guide an animated sequence. Consider motion elements, evolving lighting, and an immersive atmosphere while staying true to the song’s core aesthetic.',
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Analyze this album cover and generate a single AI art prompt that can be used for both an image and an animated video. The visual should capture the essence of the image while adding depth, motion, and a cinematic feel that enhances the song’s atmosphere.
                
                - Song: "${song}"
                - Artist: "${artist}"
                - Influences (for subtle guidance): 
                  - Style: ${style}
                  - Mood: ${mood}
                  - Scene: ${scene}
                  - Genre Influence: ${genre}
                  - Color Scheme (from extracted colors): ${colorPalette}
                  - Lighting: ${lighting}
  
                The generated prompt should:
                - Be **highly detailed** and visually compelling.
                - Describe **motion elements** (e.g., flowing fabric, shifting light, subtle camera movement).
                - Have a **cinematic feel**, incorporating depth, atmosphere, and an emotional arc.
                - Work for both still image and video generation seamlessly.`,
          },
          { type: 'image_url', image_url: { url: imageUrl } },
        ],
      },
    ],
  });

  return response.choices[0].message.content || 'No prompt generated.';
}
