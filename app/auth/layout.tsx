import { CursorGlow } from '@/components/cursor-glow';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='min-h-screen w-full flex items-center justify-center'>
      <CursorGlow imageColors={['rgba(29, 78, 216, 0.15)']} />
      {children}
    </div>
  );
}
