import { NextResponse } from 'next/server';
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const redirectTo = searchParams.get('redirect_to')?.toString();
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/';
  console.log('STARTED CALLBACK');
  console.log('code', code);
  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }
  if (redirectTo) {
    return NextResponse.redirect(redirectTo);
  }
  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/protected`);
}
