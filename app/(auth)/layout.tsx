import React from 'react';
import type { Metadata } from 'next';
import { CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'EduTrack — Sign In',
  description: 'Sign in or create an account on EduTrack by House of EdTech.',
};

const features = [
  'Structured assignments with per-question grading',
  'Instant automated feedback on every submission',
  'Real-time grading & detailed teacher remarks',
  'Track your complete academic progress',
];

const stats = [
  { value: '3M+', label: 'Learners' },
  { value: '500+', label: 'Courses' },
  { value: '8',   label: 'Brands'  },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='h-screen overflow-hidden flex'>

      {/* ── Left dark panel ── */}
      <div
        className='hidden lg:flex flex-col justify-between w-[460px] shrink-0 px-12 py-10 relative overflow-hidden h-full'
        style={{ background: '#0A0A0A' }}
      >
        {/* Subtle grid overlay */}
        <div
          className='pointer-events-none absolute inset-0 opacity-[0.03]'
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className='relative z-10'>
          {/* Logo */}
          <div className='mb-14'>
            <div className='flex items-center gap-3 mb-1'>
              <img
                src='/icon.svg'
                alt='House of EdTech'
                className='h-9 w-9 rounded-lg object-cover'
              />
              <p className='text-white font-bold text-base'>EduTrack</p>
            </div>
            <p className='text-xs text-gray-600 ml-12'>by House of EdTech</p>
          </div>

          {/* Hero headline — matches HoE style */}
          <h2 className='text-4xl font-bold text-white leading-tight mb-4'>
            World-Class<br />Education.<br />One Platform.
          </h2>
          <p className='text-gray-400 text-sm leading-relaxed mb-10 max-w-[300px]'>
            From assignments to structured feedback — a smarter way to teach and learn, built for India's best educators.
          </p>

          {/* Feature list */}
          <ul className='space-y-3 mb-12'>
            {features.map((f, i) => (
              <li key={i} className='flex items-start gap-3'>
                <CheckCircle2 className='h-4 w-4 text-gray-600 mt-0.5 shrink-0' />
                <span className='text-gray-400 text-sm'>{f}</span>
              </li>
            ))}
          </ul>

          {/* Stats */}
          <div className='grid grid-cols-3 gap-3'>
            {stats.map((s, i) => (
              <div
                key={i}
                className='rounded-xl p-4 text-center'
                style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)' }}
              >
                <p className='text-2xl font-bold text-white'>{s.value}</p>
                <p className='text-xs text-gray-500 mt-1'>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer credit */}
        <div
          className='relative z-10 pt-6'
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <p className='text-xs text-gray-600'>
            © {new Date().getFullYear()} House of EdTech · India's Multi-Brand Education Company
          </p>
        </div>
      </div>

      {/* ── Right form area ── */}
      <div className='flex-1 h-full overflow-y-auto flex flex-col items-center justify-center bg-gray-50 px-6 py-8'>
        {/* Mobile logo */}
        <div className='flex items-center gap-2.5 mb-8 lg:hidden'>
          <img
            src='/icon.svg'
            alt='House of EdTech'
            className='h-9 w-9 rounded-lg object-cover'
          />
          <div>
            <p className='font-bold text-black text-base'>EduTrack</p>
            <p className='text-xs text-gray-400'>by House of EdTech</p>
          </div>
        </div>
        <div className='w-full max-w-md'>{children}</div>
      </div>
    </div>
  );
}
