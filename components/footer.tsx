import { Code2 } from 'lucide-react';
import { Heart, Music } from 'lucide-react';

export function Footer() {
  return (
    <a
      href='https://walidelnozahy.com'
      target='_blank'
      rel='noopener noreferrer'
      className='text-muted-foreground fixed bottom-4 right-4 rounded-full bg-background shadow-md hover:shadow-lg transition-all duration-200 group z-50'
    >
      <Code2 className='w-4 h-4 group-hover:text-primary transition-colors' />
      <span className='absolute bottom-full right-0 mb-2 px-3 py-1 text-xs rounded-md bg-background border opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap'>
        <code>crafted with</code>
        <Heart className='w-3 h-3 inline text-red-500 -translate-y-0.5 mx-1' />
        <code>by walid elnozahy</code>{' '}
      </span>
    </a>
  );
}
