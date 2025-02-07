import { createClient } from '@/utils/supabase/server';
import { InfoIcon } from 'lucide-react';
import { redirect } from 'next/navigation';
import { getUserLikedTracks, getUserPlaylists } from '../actions/spotify';
import LikedTracksCarousel from '@/components/liked-tracks-carouse';
import TrackCarousel from '@/components/liked-tracks-carouse-2';

interface SpotifyTrack {
  track: {
    id: string;
    name: string;
    artists: any[]; // You can make this more specific if needed
    album: any; // You can make this more specific if needed
  };
}

export default async function ProtectedPage() {
  const supabase = await createClient();
  const likedTracksData = await getUserLikedTracks();
  console.log('likedTracks', likedTracksData?.items);
  const tracks = likedTracksData.items.map((item: SpotifyTrack) => ({
    id: item.track.id,
    name: item.track.name,
    artists: item.track.artists,
    album: item.track.album,
  }));

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!user) {
    return redirect('/sign-in');
  }

  return (
    <div className='flex-1 w-full flex flex-col gap-12'>
      <LikedTracksCarousel tracks={tracks} />
      <TrackCarousel tracks={tracks} />
      <div className='w-full'>
        <div className='bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center'>
          <InfoIcon size='16' strokeWidth={2} />
          This is a protected page that you can only see as an authenticated
          user
        </div>
      </div>
      <div className='flex flex-col gap-2 items-start '>
        <h2 className='font-bold text-2xl mb-4 text-center'>
          Your user details
        </h2>
        <pre className='text-xs font-mono p-3 rounded border overflow-auto w-full max-h-48'>
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
      <div className='flex flex-col gap-2 items-start '>
        <h2 className='font-bold text-2xl mb-4 text-center'>Session details</h2>
        <pre className='text-xs font-mono p-3 rounded border overflow-auto w-full max-h-48'>
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>
      <div className='flex flex-col gap-2 items-start '>
        <h2 className='font-bold text-2xl mb-4 text-center'>Session details</h2>
        <pre className='text-xs font-mono p-3 rounded border overflow-auto w-full max-h-screen'>
          {JSON.stringify(likedTracksData, null, 2)}
        </pre>
      </div>
    </div>
  );
}
