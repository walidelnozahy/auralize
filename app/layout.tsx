import { Geist } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Footer } from '@/components/footer';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Auralize · Transform Music into Art',
  description:
    'Turn your favorite songs into stunning AI-generated artwork. Experience music visualization like never before with our innovative audio-to-image technology.',
  openGraph: {
    title: 'Auralize · Transform Music into Art',
    description:
      'Turn your favorite songs into stunning AI-generated artwork. Experience music visualization like never before with our innovative audio-to-image technology.',
    url: defaultUrl,
    images: [
      {
        url: '/meta-image.png',
        width: 800,
        height: 600,
        alt: 'Auralize - Music to Art Generation',
      },
    ],
    siteName: 'Auralize',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Auralize · Transform Music into Art',
    description:
      'Turn your favorite songs into stunning AI-generated artwork. Experience music visualization like never before with our innovative audio-to-image technology.',
  },
};

const geistSans = Geist({
  display: 'swap',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className={geistSans.className} suppressHydrationWarning>
      <body className='bg-background text-foreground'>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
