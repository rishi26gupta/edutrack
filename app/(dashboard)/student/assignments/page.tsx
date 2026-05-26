'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { BookOpen } from 'lucide-react';
import { Dialog, DialogContent, DialogClose, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AssignmentCard from '@/components/AssignmentCard';
import SubmissionForm from '@/components/SubmissionForm';
import AssignmentViewModal from '@/components/AssignmentViewModal';

export default function StudentAssignmentsPage() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading]         = useState(true);
  const [submitting, setSubmitting]   = useState<any>(null);
  const [viewing, setViewing]         = useState<any>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [aRes, sRes] = await Promise.all([
        fetch('/api/assignments'),
        fetch('/api/submissions'),
      ]);
      if (aRes.ok) setAssignments(await aRes.json());
      if (sRes.ok) setSubmissions(await sRes.json());
    } catch {
      toast.error('Failed to load data');
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const submittedIds = new Set(
    submissions
      .filter(s => s.status !== 'resubmit')
      .map(s => (s.assignmentId?._id ?? s.assignmentId)?.toString())
  );

  const resubmitIds = new Set(
    submissions
      .filter(s => s.status === 'resubmit')
      .map(s => (s.assignmentId?._id ?? s.assignmentId)?.toString())
  );

  const pending   = assignments.filter(a => !submittedIds.has(a._id?.toString()));
  const submitted = assignments.filter(a =>  submittedIds.has(a._id?.toString()));

  return (
    <div>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>Assignments</h1>
        <p className='text-base text-gray-500 mt-1'>View your assignments and submit your answers</p>
      </div>

      {loading ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
          {[1, 2, 3].map(i => (
            <div key={i} className='h-64 rounded-xl bg-gray-100 animate-pulse' />
          ))}
        </div>
      ) : assignments.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-24 text-center'>
          <div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 border border-gray-200 mb-4'>
            <BookOpen className='h-8 w-8 text-gray-400' />
          </div>
          <h3 className='text-lg font-bold text-gray-800 mb-1'>No assignments yet</h3>
          <p className='text-sm text-gray-500 max-w-xs'>
            Your teacher hasn't posted any assignments yet. Check back soon.
          </p>
        </div>
      ) : (
        <div className='space-y-8'>
          {pending.length > 0 && (
            <section>
              <div className='flex items-center gap-2 mb-4'>
                <span className='h-2 w-2 rounded-full bg-gray-400' />
                <h2 className='text-sm font-bold text-gray-700 uppercase tracking-wider'>
                  Pending · {pending.length}
                </h2>
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
                {pending.map(a => (
                  <AssignmentCard
                    key={a._id}
                    assignment={a}
                    role='student'
                    hasSubmitted={false}
                    needsResubmit={resubmitIds.has(a._id?.toString())}
                    onView={() => setViewing(a)}
                    onSubmit={() => setSubmitting(a)}
                  />
                ))}
              </div>
            </section>
          )}

          {submitted.length > 0 && (
            <section>
              <div className='flex items-center gap-2 mb-4'>
                <span className='h-2 w-2 rounded-full bg-green-400' />
                <h2 className='text-sm font-bold text-gray-700 uppercase tracking-wider'>
                  Submitted · {submitted.length}
                </h2>
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
                {submitted.map(a => (
                  <AssignmentCard
                    key={a._id}
                    assignment={a}
                    role='student'
                    hasSubmitted={true}
                    onView={() => setViewing(a)}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* View modal */}
      {viewing && (
        <AssignmentViewModal assignment={viewing} onClose={() => setViewing(null)} />
      )}

      {/* Submission dialog */}
      <Dialog
        open={!!submitting}
        onOpenChange={open => { if (!open) { setSubmitting(null); fetchData(); } }}
      >
        <DialogContent className='w-[95vw] sm:max-w-3xl max-h-[82vh] overflow-y-auto p-0 gap-0' showCloseButton={false}>
          {/* Sticky header */}
          <div className='sticky top-0 z-10 flex items-start justify-between px-8 py-5 bg-white border-b border-gray-100'>
            <div>
              <DialogTitle className='text-lg font-extrabold text-gray-900 leading-snug'>
                {submitting?.title}
              </DialogTitle>
              <p className='text-sm text-gray-400 mt-0.5'>
                {submitting?.subject}
                {' · '}
                {submitting?.questions?.length ?? 1} question{(submitting?.questions?.length ?? 1) !== 1 ? 's' : ''}
                {' · '}
                {submitting?.maxMarks} marks total
              </p>
            </div>
            <DialogClose
              className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors mt-0.5'
            >
              <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'><path d='M18 6 6 18'/><path d='m6 6 12 12'/></svg>
            </DialogClose>
          </div>
          <div className='px-8 py-6'>
            {submitting && <SubmissionForm assignment={submitting} />}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
