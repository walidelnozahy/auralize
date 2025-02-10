'use client';

import { signOutAction } from '@/app/actions/session';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function SignOutButton() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('/api/user');
        if (!response.ok) {
          throw new Error('Failed to fetch user info');
        }
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

  if (!user) return null;

  return (
    <div className='flex items-center gap-2'>
      <p className='text-sm  leading-none'>
        {user.user_metadata.name?.split(' ')[0] || user.user_metadata.name}
      </p>
      <Button
        type='submit'
        variant='ghost'
        size='sm'
        className='text-smw-full justify-start cursor-pointer'
        onClick={signOutAction}
      >
        <LogOut className='mr-2 h-4 w-4' />
      </Button>
    </div>
  );
}
