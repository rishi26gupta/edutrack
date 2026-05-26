'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutList, Inbox, UserRound, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

const teacherLinks = [
  { name: 'Assignments', href: '/teacher/assignments', icon: LayoutList },
  { name: 'Submissions', href: '/teacher/submissions', icon: Inbox       },
  { name: 'Students',    href: '/teacher/students',    icon: UserRound   },
];

const studentLinks = [
  { name: 'Assignments',    href: '/student/assignments', icon: LayoutList },
  { name: 'My Submissions', href: '/student/submissions', icon: Send        },
];

export default function Sidebar({ role }: { role: 'teacher' | 'student' }) {
  const pathname = usePathname();
  const links = role === 'teacher' ? teacherLinks : studentLinks;

  return (
    <aside
      className='w-64 shrink-0 flex flex-col h-full bg-white'
      style={{ borderRight: '1px solid #EAECF0' }}
    >
      <div className='shrink-0 px-5 pt-6 pb-3'>
        <p className='text-xs font-semibold text-gray-400 uppercase tracking-wide'>
          {role === 'teacher' ? 'Teacher Portal' : 'Student Portal'}
        </p>
      </div>

      <nav className='flex-1 overflow-y-auto px-3 pb-4 space-y-1'>
        {links.map(link => {
          const Icon   = link.icon;
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150',
                active
                  ? 'bg-black text-white'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon className={cn('h-[18px] w-[18px] shrink-0', active ? 'text-white' : 'text-gray-400')} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className='shrink-0 px-5 py-4' style={{ borderTop: '1px solid #F3F4F6' }}>
        <a
          href='https://houseofedtech.in'
          target='_blank'
          rel='noopener noreferrer'
          className='text-xs text-gray-400 hover:text-gray-600 transition-colors leading-relaxed block'
        >
          Powered by{' '}
          <span className='font-semibold text-gray-500'>House of EdTech</span>
        </a>
      </div>
    </aside>
  );
}
