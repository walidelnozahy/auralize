import { Button } from '@/components/ui/button';
import { Menu, ArrowLeftFromLine, Download, Share2 } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LogOut } from 'lucide-react';
import { AudioWaveform } from 'lucide-react';
import { generatePublicUrl } from '@/lib/supabase/generate-image-public-url';
import { useEffect } from 'react';
import { useState } from 'react';
import { signOutAction } from '@/app/actions/session';

export function ListImages({
  images,
  isLoading,
}: {
  images: any[];
  isLoading: boolean;
}) {
  const [user, setUser] = useState<{
    user_metadata: {
      name: string;
    };
  } | null>(null);

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
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant='ghost' size='icon'>
          <ArrowLeftFromLine className='h-5 w-5' />
        </Button>
      </SheetTrigger>
      <SheetContent side='right' className='w-[400px] sm:w-[540px]'>
        <SheetHeader>
          <div className='space-y-2'>
            <p className='text-sm text-muted-foreground'>
              Welcome back,{' '}
              {user?.user_metadata?.name?.split(' ')[0] ||
                user?.user_metadata.name}
            </p>
            <SheetTitle>Generated Images</SheetTitle>
          </div>
        </SheetHeader>

        <ScrollArea className='h-[calc(100vh-8rem)] mt-4'>
          {isLoading ? (
            <div className='flex items-center justify-center h-[50vh]'>
              <AudioWaveform className='h-8 w-8 animate-pulse' />
            </div>
          ) : images.length === 0 ? (
            <div className='flex flex-col items-center justify-center h-[50vh] text-center text-muted-foreground'>
              <Menu className='h-8 w-8 mb-4' />
              <p>No images generated yet.</p>
              <p className='text-sm'>Your generated images will appear here.</p>
            </div>
          ) : (
            <div className='grid grid-cols-2 gap-4 pb-4'>
              {images
                .filter((item) => item.status === 'done')
                ?.map(
                  (item: {
                    id: string;
                    original_image_path: string;
                    generated_image_path: string;
                    prompt: string;
                    metadata: {
                      song: string;
                      artist: string;
                    };
                  }) => (
                    <div key={item.id} className='relative group'>
                      <img
                        src={generatePublicUrl(item.generated_image_path)}
                        alt={`${item.metadata.song} by ${item.metadata.artist}`}
                        className='rounded-lg w-full aspect-square object-cover'
                      />
                      <div className='absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col items-center justify-center gap-2'>
                        <div className='text-center mb-2'>
                          <p className='text-sm text-white font-medium'>
                            {item.metadata.song}
                          </p>
                          <p className='text-xs text-white/80'>
                            {item.metadata.artist}
                          </p>
                        </div>
                        <Button
                          variant='secondary'
                          size='icon'
                          onClick={() => {
                            const imageUrl = generatePublicUrl(
                              item.generated_image_path,
                            );
                            fetch(imageUrl)
                              .then((response) => response.blob())
                              .then((blob) => {
                                const url = window.URL.createObjectURL(blob);
                                const link = document.createElement('a');
                                link.href = url;
                                link.download = `visualizer-${item.metadata.song}-${Date.now()}.png`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                window.URL.revokeObjectURL(url);
                              });
                          }}
                        >
                          <Download className='h-4 w-4' />
                        </Button>
                      </div>
                    </div>
                  ),
                )}
            </div>
          )}
        </ScrollArea>

        <SheetFooter className='absolute bottom-0 left-0 right-0 p-6 border-t bg-background'>
          <Button variant='outline' className='w-full' onClick={signOutAction}>
            <LogOut className='mr-2 h-4 w-4' />
            Sign Out
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
