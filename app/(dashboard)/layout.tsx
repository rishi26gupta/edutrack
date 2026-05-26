'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser]       = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(data => setUser(data))
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className='flex flex-col items-center justify-center h-screen bg-[#0A0A0A]'>
        <div className='flex flex-col items-center gap-4'>
          <img
            src='/icon.svg'
            alt='House of EdTech'
            className='h-14 w-14 rounded-2xl object-cover'
          />
          <div className='flex items-center gap-2 text-white/60'>
            <Loader2 className='h-4 w-4 animate-spin' />
            <span className='text-sm font-medium'>Loading…</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    /*
     * Full-viewport layout — nothing at the page level scrolls.
     * Only <main> scrolls its own content independently.
     */
    <div className='h-screen flex flex-col overflow-hidden bg-slate-50'>
      {/* Sticky navbar */}
      <Navbar user={user} />

      {/* Content row — fills exactly the remaining height */}
      <div className='flex flex-1 overflow-hidden'>
        {/* Sidebar — full height, never scrolls (unless many links) */}
        <Sidebar role={user?.role ?? 'student'} />

        {/* Main content scrolls independently */}
        <main className='flex-1 overflow-y-auto p-6 md:p-8'>
          {children}
        </main>
      </div>
    </div>
  );
}
