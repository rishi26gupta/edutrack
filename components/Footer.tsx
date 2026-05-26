import React from 'react';
import { ExternalLink } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className='w-full bg-white border-t border-gray-200'>
      <div className='flex flex-col sm:flex-row items-center justify-between gap-4 px-8 py-4'>

        {/* Left — Brand */}
        <div className='flex items-center gap-2.5'>
          <img
            src='/icon.svg'
            alt='House of EdTech'
            className='h-7 w-7 rounded-lg object-cover'
          />
          <span className='text-gray-900 font-bold text-sm'>EduTrack</span>
          <span className='text-gray-300 text-sm'>·</span>
          <a
            href='https://houseofedtech.in'
            target='_blank'
            rel='noopener noreferrer'
            className='text-xs text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-1'
          >
            House of EdTech
            <ExternalLink className='h-3 w-3' />
          </a>
        </div>

        {/* Right — Developer details */}
        <div className='flex items-center gap-4'>
          <span className='text-sm font-semibold text-gray-700'>Built by Your Name</span>
          <a
            href='https://github.com/yourusername'
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 transition-colors font-medium'
          >
            <FaGithub className='h-4 w-4' />
            GitHub
          </a>
          <a
            href='https://linkedin.com/in/yourusername'
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 transition-colors font-medium'
          >
            <FaLinkedin className='h-4 w-4' />
            LinkedIn
          </a>
        </div>

      </div>
    </footer>
  );
}
