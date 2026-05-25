import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'EduTrack — Student Assignment Portal',
  description:
    'EduTrack is a Student Assignment Submission & Grading Portal with AI-powered feedback using Groq.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className={`${geist.variable} h-full antialiased`}>
      <body className='min-h-full flex flex-col bg-gray-50'>
        {children}
        <Toaster richColors position='top-right' />
      </body>
    </html>
  );
}
