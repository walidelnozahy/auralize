import { signInWithSpotifyAction } from './actions/session';
import { Spotlight } from '@/components/ui/spotlight-new';
import { CursorGlow } from '@/components/cursor-glow';
import { StarBorder } from '@/components/star-border';
import { hasEnvVars } from '@/lib/check-env-vars';

export default function Home() {
  return (
    <main className='min-h-screen flex items-center justify-center p-4 bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden'>
      <CursorGlow imageColors={['rgba(29, 78, 216, 0.15)']} />
      <Spotlight />

      <div className='flex flex-col gap-8 items-center max-w-3xl mx-auto text-center relative z-10'>
        <div className='space-y-2 animate-fade-in-up [animation-delay:200ms] opacity-0 [animation-fill-mode:forwards]'>
          <h1 className='text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400'>
            Auralize
          </h1>
          <p className='text-lg mt-4 font-normal text-base bg-clip-text text-transparent bg-gradient-to-b from-neutral-400 to-neutral-600 max-w-lg text-center mx-auto'>
            Bring Your Music to Life
          </p>
        </div>
        <form
          className='flex flex-col gap-4 animate-fade-in-up [animation-delay:400ms] opacity-0 [animation-fill-mode:forwards]'
          action={signInWithSpotifyAction}
        >
          <StarBorder type='submit'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='w-6 h-6 mr-3'
            >
              <path d='M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z' />
            </svg>
            Sign in with Spotify
          </StarBorder>
        </form>
        {!hasEnvVars && (
          <div className='text-center text-neutral-500 text-sm animate-fade-in-up [animation-delay:600ms] opacity-0 [animation-fill-mode:forwards]'>
            <p className='flex items-center justify-center gap-2'>
              <svg
                width='15'
                height='15'
                viewBox='0 0 15 15'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M7.5 1.5C4.185 1.5 1.5 4.185 1.5 7.5C1.5 10.815 4.185 13.5 7.5 13.5C10.815 13.5 13.5 10.815 13.5 7.5C13.5 4.185 10.815 1.5 7.5 1.5ZM8.25 10.5H6.75V9H8.25V10.5ZM8.25 7.5H6.75V4.5H8.25V7.5Z'
                  fill='currentColor'
                />
              </svg>
              Please set the environment variables in .env.local
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
