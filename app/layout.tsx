import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'EduTrack — Student Assignment Portal',
  description:
    'EduTrack is a Student Assignment Submission & Grading Portal with AI-powered feedback using Groq.',
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className={`${spaceGrotesk.variable} h-full antialiased`}>
      <body className='min-h-full flex flex-col bg-gray-50'>
        {children}
        <Toaster richColors position='top-right' />
      </body>
    </html>
  );
}
