<div align="center">
  <img alt="Auralize - See Your Music!" src="/app/assets/meta-image.png">
  <h1>Auralize ✨</h1>
  <p>Ever wondered what your music looks like? Now you can find out!</p>
</div>

<p align="center">
  <a href="#what-is-this"><strong>What is this?</strong></a> ·
  <a href="#cool-stuff"><strong>Cool Stuff</strong></a> ·
  <a href="#get-started"><strong>Get Started</strong></a> ·
  <a href="#build-it"><strong>Build It</strong></a>
</p>

## What is this?

Auralize is a fun experiment that turns your Spotify music into AI art! Play your favorite tracks and watch as AI creates unique artwork based on what it "hears". Built with Next.js, Supabase, and the magic of OpenAI.

### Built With

- **Next.js 15** - Because fast is fun
- **Supabase** - Handles all the boring stuff
- **OpenAI** - The creative genius
- **Spotify API** - Brings the beats
- **TailwindCSS** - Makes it pretty

## Cool Stuff

- 🎵 Play your Spotify tunes right here
- 🎨 Watch AI turn songs into art
- 💾 Keep your generated masterpieces
- 🎮 Full music controls
- 🌈 UI that vibes with your music
- 🎭 Tweak how the AI interprets your music

## Get Started

### You'll Need

- Node.js 18+
- A Supabase account (free!)
- OpenAI API access
- Spotify Developer account (also free!)

### Secret Stuff

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

### Setting Up The Backend

1. Get a Supabase project going
2. Set up auth:

   - Add `/auth/email-confirmed` to redirects
   - Turn on Spotify login with these permissions:
     ```
     user-library-read streaming
     user-modify-playback-state user-read-playback-state
     ```

3. Copy this into your SQL editor:

```sql
create table generated_images (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id),
  original_image_path text,
  generated_image_path text,
  prompt text,
  metadata jsonb,
  status text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table generated_images enable row level security;

create policy "Users can view their own images"
  on generated_images for select using ( auth.uid() = user_id );

create policy "Users can insert their own images"
  on generated_images for insert with check ( auth.uid() = user_id );
```

4. Set up storage:

```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT TO public USING ( bucket_id = 'images' );

CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT TO authenticated WITH CHECK ( bucket_id = 'images' );
```

### Spotify Setup

1. Create an app in your Spotify Developer dashboard
2. Add this redirect: `[your-domain]/auth/callback`

## Build It

```bash
git clone https://github.com/yourusername/auralize.git
cd auralize
npm install
npm run dev
```

Now go make some AI art! 🎨 🎵 ✨

## Known Limitations & Future Plans

> **Note:** Unfortunately, Spotify has deprecated their audio analysis and audio features endpoints, which limited our ability to do deep music analysis. The current version relies more on track metadata and album artwork for generating visuals.

### Future Ideas 🚀

- Explore alternative music APIs with better audio analysis capabilities
- Maybe switch to a local audio processing approach
- Add more AI models for different artistic styles
- Implement real-time audio visualization

Feel free to fork and experiment with your own music analysis solutions! 🎵
