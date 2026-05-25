'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function Navbar({ user }: { user?: any }) {
  const router = useRouter();
  
  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
    router.push('/login');
  };

  return (
    <nav className='bg-white border-b px-6 py-3 flex justify-between items-center w-full'>
      <span className='font-bold text-blue-700 text-lg hover:cursor-pointer' onClick={() => router.push('/')}>
        EduTrack
      </span>
      <div className='flex items-center gap-3'>
        {user && (
          <>
            <span className='text-sm text-gray-600'>{user.name}</span>
            <span className='text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded capitalize'>
              {user.role}
            </span>
          </>
        )}
        <Button variant='outline' size='sm' onClick={logout}>
          Logout
        </Button>
      </div>
    </nav>
  );
}
