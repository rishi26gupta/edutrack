'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          router.push('/login');
        }
      } catch (err) {
        router.push('/login');
      }
      setLoading(false);
    };
    fetchUser();
  }, [router]);

  if (loading) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-gray-50'>
        <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600'></div>
        <p className='text-gray-500 mt-4 text-sm font-semibold'>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex flex-col bg-gray-50/50'>
      <Navbar user={user} />
      <div className='flex flex-1'>
        <Sidebar role={user?.role || 'student'} />
        <main className='flex-1 p-6 bg-white min-h-[calc(100vh-57px-56px)]'>
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
