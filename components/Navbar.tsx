'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function Navbar({ user }: { user?: any }) {
  const router = useRouter();

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    router.push('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <header
      className='sticky top-0 z-30 w-full'
      style={{ background: '#0A0A0A', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
    >
      <div className='flex h-[72px] items-center justify-between px-6 md:px-10'>

        {/* Logo */}
        <button onClick={() => router.push('/')} className='flex items-center gap-3 group'>
          <img
            src='/icon.svg'
            alt='House of EdTech'
            className='h-10 w-10 rounded-xl object-cover group-hover:opacity-90 transition-opacity'
          />
          <div className='leading-none'>
            <p className='text-white font-bold text-base tracking-tight'>EduTrack</p>
            <p className='text-xs text-gray-500 mt-0.5'>by House of EdTech</p>
          </div>
        </button>

        {/* Right side */}
        <div className='flex items-center gap-3'>
          {user && (
            <div
              className='flex items-center gap-3 px-4 py-2 rounded-xl'
              style={{ background: 'rgba(255,255,255,0.06)' }}
            >
              <div className='flex h-8 w-8 items-center justify-center rounded-full bg-white text-black text-sm font-bold shrink-0'>
                {initials}
              </div>
              <div className='hidden sm:block leading-none'>
                <p className='text-white text-sm font-semibold'>{user.name}</p>
                <p className='text-xs text-gray-500 capitalize mt-0.5'>{user.role}</p>
              </div>
            </div>
          )}
          <button
            onClick={logout}
            className='flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-all'
          >
            <LogOut className='h-4 w-4' />
            <span className='hidden sm:inline'>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
