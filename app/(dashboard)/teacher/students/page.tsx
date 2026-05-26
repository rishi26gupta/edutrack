'use client';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Users } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function TeacherStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/users')
      .then(r => r.json())
      .then(data => setStudents(Array.isArray(data) ? data : []))
      .catch(() => toast.error('Failed to load students'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold text-gray-900'>Students</h1>
        <p className='text-base text-gray-500 mt-1'>All registered students in the portal</p>
      </div>

      {loading ? (
        <div className='space-y-2'>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className='h-12 rounded-lg bg-gray-100 animate-pulse' />
          ))}
        </div>
      ) : students.length === 0 ? (
        <div className='text-center py-20 text-gray-400'>
          <Users className='h-10 w-10 mx-auto mb-3 opacity-40' />
          <p className='text-lg font-semibold'>No students registered yet</p>
          <p className='text-sm mt-1'>Students will appear here once they sign up</p>
        </div>
      ) : (
        <div className='rounded-lg border overflow-hidden'>
          <Table>
            <TableHeader>
              <TableRow className='bg-gray-50'>
                <TableHead className='font-semibold'>Name</TableHead>
                <TableHead className='font-semibold'>Email</TableHead>
                <TableHead className='font-semibold'>Role</TableHead>
                <TableHead className='font-semibold'>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map(s => (
                <TableRow key={s._id} className='hover:bg-gray-50'>
                  <TableCell className='font-medium text-gray-800'>{s.name}</TableCell>
                  <TableCell className='text-gray-500'>{s.email}</TableCell>
                  <TableCell>
                    <Badge variant='outline' className='bg-blue-50 text-blue-700 border-blue-200'>
                      Student
                    </Badge>
                  </TableCell>
                  <TableCell className='text-gray-500 text-sm'>
                    {new Date(s.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
