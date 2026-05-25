'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Users, ClipboardCheck, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  role: 'teacher' | 'student';
}

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  const links = role === 'teacher'
    ? [
        { name: 'Assignments', href: '/teacher/assignments', icon: BookOpen },
        { name: 'Submissions', href: '/teacher/submissions', icon: ClipboardCheck },
        { name: 'Students', href: '/teacher/students', icon: Users },
      ]
    : [
        { name: 'All Assignments', href: '/student/assignments', icon: BookOpen },
        { name: 'My Submissions', href: '/student/submissions', icon: GraduationCap },
      ];

  return (
    <aside className='w-64 border-r bg-gray-50/50 min-h-[calc(100vh-57px)] flex flex-col p-4 space-y-2 select-none'>
      <div className='px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider'>
        {role === 'teacher' ? 'Teacher Portal' : 'Student Portal'}
      </div>
      <nav className='flex-1 space-y-1'>
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <Icon className={cn('h-4 w-4', isActive ? 'text-blue-700' : 'text-gray-400')} />
              {link.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
