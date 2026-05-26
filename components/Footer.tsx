import React from 'react';

export default function Footer() {
  return (
    <footer style={{ background: '#0A0A0A', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className='flex flex-col sm:flex-row items-center justify-between gap-3 px-8 py-4'>
        <div className='flex items-center gap-2.5'>
          <img
            src='/icon.svg'
            alt='House of EdTech'
            className='h-7 w-7 rounded-lg object-cover'
          />
          <span className='text-white font-bold text-sm'>EduTrack</span>
          <span className='text-gray-700 text-sm'>·</span>
          <a href='https://houseofedtech.in' target='_blank' rel='noopener noreferrer'
            className='text-xs text-gray-600 hover:text-gray-400 transition-colors'>
            House of EdTech
          </a>
        </div>
        <p className='text-xs text-gray-700'>
          India's Multi-Brand Education Company · © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
