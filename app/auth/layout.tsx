import { CursorGlow } from '@/components/cursor-glow';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='min-h-screen w-full flex items-center justify-center'>
      <CursorGlow />
      {children}
    </div>
  );
}
