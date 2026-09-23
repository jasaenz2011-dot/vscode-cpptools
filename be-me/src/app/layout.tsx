import type { Metadata, Viewport } from 'next';
import { Archivo, Space_Grotesk, Space_Mono } from 'next/font/google';
import './globals.css';
import { StudioProvider } from '@/components/StudioProvider';

const display = Archivo({
  subsets: ['latin'],
  variable: '--font-be-display',
  display: 'swap',
});

const ui = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-be-ui',
  display: 'swap',
});

const mono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-be-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Be ME! — Build Your Identity',
  description:
    'An avatar creator studio for K–8 students. Build your character, grow them from Kindergarten to 8th grade, and stamp your own Be ME! student badge.',
  applicationName: 'Be ME!',
  keywords: ['avatar creator', 'student identity', 'maker space', 'K-8', 'classroom'],
  authors: [{ name: 'Be ME! Maker Program' }],
  openGraph: {
    title: 'Be ME! — Build Your Identity',
    description:
      'Design your student avatar, watch it grow from K to 8th grade, and export your own Be ME! badge.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#0f172a',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${ui.variable} ${mono.variable}`}>
      <body className="min-h-dvh antialiased">
        <StudioProvider>{children}</StudioProvider>
      </body>
    </html>
  );
}
