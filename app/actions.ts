'use server';

import { createClient } from '@/utils/supabase/server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export const signInWithSpotifyAction = async () => {
  console.log('clicked');
  const supabase = await createClient();
  const origin = (await headers()).get('origin');
  console.log('origin', origin);
  const { error, data } = await supabase.auth.signInWithOAuth({
    provider: 'spotify',
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });
  console.log('data', data);
  console.log('error', error);
  if (data.url) {
    redirect(data.url); // use the redirect API for your server framework
  }
  // if (error) {
  //   return redirect('/auth/auth-code-error');
  // }

  // http://localhost:3000/sign-in#error=access_denied&error_code=provider_email_needs_verification&error_description=Unverified+email+with+spotify.+A+confirmation+email+has+been+sent+to+your+spotify+email
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect('/');
};
