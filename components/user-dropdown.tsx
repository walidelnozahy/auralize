import { signOutAction } from '@/app/actions/session';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { createClient } from '@/utils/supabase/server';
import { ChevronDown } from 'lucide-react';

export default async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='flex items-center gap-2'>
          {user.user_metadata.name}
          <ChevronDown className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <form action={signOutAction}>
          <DropdownMenuItem asChild>
            <Button
              type='submit'
              variant='ghost'
              className='w-full justify-start'
            >
              Sign out
            </Button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
