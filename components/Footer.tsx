import React from 'react';

export default function Footer() {
  return (
    <footer className='border-t bg-gray-50 py-4 px-6 text-center text-sm text-gray-500 w-full'>
      Built by <strong>EduTrack Team</strong> |{' '}
      <a
        href='https://github.com'
        target='_blank'
        rel='noopener noreferrer'
        className='text-blue-600 hover:underline mx-1'
      >
        GitHub
      </a>{' '}
      |{' '}
      <a
        href='https://linkedin.com'
        target='_blank'
        rel='noopener noreferrer'
        className='text-blue-600 hover:underline mx-1'
      >
        LinkedIn
      </a>
    </footer>
  );
}
