'use client';

import { Button } from '@/components/ui/button';
import { AlertCircle, Mail } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AuthCodeErrorPage() {
  const [errorMessage, setErrorMessage] = useState('');
  const [isEmailVerificationError, setIsEmailVerificationError] =
    useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.replace('#', '?'));
    const errorDescription =
      params.get('error_description') ||
      'We encountered an issue while trying to log you in. This could be due to an expired or invalid session.';
    const errorCode = params.get('error_code');

    // Check specifically for the provider email verification error code
    setIsEmailVerificationError(
      errorCode === 'provider_email_needs_verification',
    );
    setErrorMessage(decodeURIComponent(errorDescription));
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return null; // or return a loading spinner if you prefer
  }

  return (
    <div className='flex-1 w-full flex items-center justify-center'>
      <div className='max-w-md w-full  shadow-xl rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700'>
        <div className='p-8'>
          <div className='flex flex-col items-center text-center'>
            <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 mb-6'>
              {isEmailVerificationError ? (
                <Mail
                  className='w-8 h-8 text-yellow-500 dark:text-yellow-400'
                  aria-hidden='true'
                />
              ) : (
                <AlertCircle
                  className='w-8 h-8 text-red-500 dark:text-red-400'
                  aria-hidden='true'
                />
              )}
            </div>

            <h1 className='text-2xl font-bold mb-3'>
              {isEmailVerificationError
                ? 'Email Verification Required'
                : 'Authentication Error'}
            </h1>

            <p className='text-muted-foreground mb-8'>{errorMessage}</p>

            <Button
              asChild
              className='w-full transition-all duration-200 ease-in-out transform hover:scale-102'
            >
              <Link href='/'>Return to Login</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
