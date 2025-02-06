import ConnectSupabaseSteps from '@/components/tutorial/connect-supabase-steps';
import SignUpUserSteps from '@/components/tutorial/sign-up-user-steps';
import { Button } from '@/components/ui/button';
import { hasEnvVars } from '@/utils/supabase/check-env-vars';
import { signInWithSpotifyAction } from './actions';
import SupabaseLogo from '@/components/supabase-logo';
import NextLogo from '@/components/next-logo';

export default async function Home() {
  return (
    <>
      <div className='flex flex-col gap-16 items-center'>
        <div className='flex gap-8 justify-center items-center'>
          <a
            href='https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs'
            target='_blank'
            rel='noreferrer'
          >
            <SupabaseLogo />
          </a>
          <span className='border-l rotate-45 h-6' />
          <a href='https://nextjs.org/' target='_blank' rel='noreferrer'>
            <NextLogo />
          </a>
        </div>
        <h1 className='sr-only'>Supabase and Next.js Starter Template</h1>
        <p className='text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center'>
          The fastest way to build apps with{' '}
          <a
            href='https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs'
            target='_blank'
            className='font-bold hover:underline'
            rel='noreferrer'
          >
            Supabase
          </a>{' '}
          and{' '}
          <a
            href='https://nextjs.org/'
            target='_blank'
            className='font-bold hover:underline'
            rel='noreferrer'
          >
            Next.js
          </a>
        </p>
        <Button onClick={signInWithSpotifyAction}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='currentColor'
            className='w-5 h-5 mr-2'
          >
            <path d='M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z' />
          </svg>
          Sign in with Spotify
        </Button>

        <div className='w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8' />
      </div>
      <main className='flex-1 flex flex-col gap-6 px-4'>
        <h2 className='font-medium text-xl mb-4'>Next steps</h2>
        {hasEnvVars ? <SignUpUserSteps /> : <ConnectSupabaseSteps />}
      </main>
    </>
  );
}
