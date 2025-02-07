'use client';

import { signInWithSpotifyAction } from '@/app/actions/session';
import { Button } from '@/components/ui/button';
import { AlertCircle, Mail } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function EmailConfirmed() {
  useEffect(() => {
    signInWithSpotifyAction();
  }, []);

  return (
    <div className='flex-1 w-full flex items-center justify-center'>
      <div className='max-w-md w-full shadow-xl rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700'>
        <div className='p-8'>
          <div className='flex flex-col items-center text-center'>
            <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 dark:bg-green-900/20 mb-6'>
              <Mail
                className='w-8 h-8 text-green-500 dark:text-green-400'
                aria-hidden='true'
              />
            </div>

            <h1 className='text-2xl font-bold mb-3'>
              Email Confirmed Successfully
            </h1>

            <p className='text-muted-foreground mb-8'>
              Your email has been successfully verified. Please sign in to
              continue.
            </p>

            <Button
              asChild
              className='w-full transition-all duration-200 ease-in-out transform hover:scale-102'
            >
              <Link href='/'>Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
