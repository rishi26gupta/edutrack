'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import GradeModal from '@/components/GradeModal';

const statusStyle: Record<string, string> = {
  submitted: 'bg-blue-100 text-blue-700',
  graded:    'bg-green-100 text-green-700',
  resubmit:  'bg-amber-100 text-amber-800',
};

export default function TeacherSubmissionsPage() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading]         = useState(true);
  const [filter, setFilter]           = useState('all');
  const [grading, setGrading]         = useState<any>(null);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/submissions');
      if (res.ok) setSubmissions(await res.json());
    } catch {
      toast.error('Failed to load submissions');
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchSubmissions(); }, [fetchSubmissions]);

  // Build unique assignment options — cast _id to string explicitly
  const assignmentOptions: [string, string][] = Array.from(
    new Map(
      submissions
        .filter(s => s.assignmentId?._id && s.assignmentId?.title)
        .map(s => [String(s.assignmentId._id), String(s.assignmentId.title)])
    ).entries()
  );

  // Filter submissions — compare as strings
  const filtered =
    filter === 'all'
      ? submissions
      : submissions.filter(s => String(s.assignmentId?._id) === filter);

  return (
    <div>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Submissions</h1>
          <p className='text-base text-gray-500 mt-1'>Review and grade student submissions</p>
        </div>

        <Select value={filter} onValueChange={val => setFilter(val ?? 'all')}>
          <SelectTrigger className='w-full sm:w-64 h-11 text-sm border-gray-200'>
            {/* Compute display text directly — Base UI SelectValue can't reliably show label for ObjectId values */}
            <span className='flex-1 text-left text-sm truncate text-gray-700'>
              {filter === 'all'
                ? 'All Assignments'
                : (assignmentOptions.find(([id]) => id === filter)?.[1] ?? 'Selected')}
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Assignments</SelectItem>
            {assignmentOptions.map(([id, title]) => (
              <SelectItem key={id} value={id}>{title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className='space-y-2'>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className='h-14 rounded-lg bg-gray-100 animate-pulse' />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className='text-center py-20 text-gray-400'>
          <p className='text-lg font-semibold'>No submissions yet</p>
          <p className='text-sm mt-1'>Submissions from students will appear here</p>
        </div>
      ) : (
        <div className='rounded-xl border overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow className='bg-gray-50'>
                <TableHead className='font-semibold text-sm'>Student</TableHead>
                <TableHead className='font-semibold text-sm'>Assignment</TableHead>
                <TableHead className='font-semibold text-sm'>Status</TableHead>
                <TableHead className='font-semibold text-sm'>Grade</TableHead>
                <TableHead className='font-semibold text-sm'>Submitted</TableHead>
                <TableHead className='font-semibold text-sm'>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(s => (
                <TableRow key={s._id} className='hover:bg-gray-50'>
                  <TableCell className='font-medium text-gray-800'>
                    <div>{s.studentId?.name}</div>
                    <div className='text-xs text-gray-400'>{s.studentId?.email}</div>
                  </TableCell>
                  <TableCell className='text-gray-600 max-w-[180px] truncate text-sm'>
                    {s.assignmentId?.title}
                  </TableCell>
                  <TableCell>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusStyle[s.status]}`}>
                      {s.status}
                    </span>
                  </TableCell>
                  <TableCell className='font-medium text-gray-700 text-sm'>
                    {s.grade != null ? `${s.grade} / ${s.assignmentId?.maxMarks}` : '—'}
                  </TableCell>
                  <TableCell className='text-gray-500 text-sm'>
                    {new Date(s.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </TableCell>
                  <TableCell>
                    <Button size='sm' onClick={() => setGrading(s)}
                      className='h-9 px-4 text-sm bg-black hover:bg-gray-900 text-white'>
                      Grade
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {grading && (
        <GradeModal
          submission={grading}
          onClose={() => setGrading(null)}
          onSaved={() => {
            toast.success('Grade saved successfully');
            fetchSubmissions();
          }}
        />
      )}
    </div>
  );
}
