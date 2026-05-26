'use client';
import React from 'react';
import { Calendar, Clock, FileText, Award, X } from 'lucide-react';
import { Dialog, DialogContent, DialogClose, DialogTitle } from '@/components/ui/dialog';

interface AssignmentViewModalProps {
  assignment: any;
  onClose: () => void;
}

export default function AssignmentViewModal({ assignment, onClose }: AssignmentViewModalProps) {
  const dueDate   = new Date(assignment.dueDate);
  const now       = new Date();
  const isPastDue = dueDate < now;
  const daysLeft  = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const questions: { question: string; marks: number }[] = assignment.questions ?? [];

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className='w-[95vw] sm:max-w-2xl max-h-[82vh] p-0 overflow-hidden rounded-2xl gap-0' showCloseButton={false}>

        {/* Dark header */}
        <div className='flex items-start justify-between px-7 py-5' style={{ background: '#0A0A0A' }}>
          <div>
            <DialogTitle className='text-white font-bold text-lg leading-snug'>
              {assignment.title}
            </DialogTitle>
            <div className='flex flex-wrap items-center gap-2.5 mt-2.5'>
              <span className='text-xs font-semibold text-gray-400 bg-white/10 px-2.5 py-1 rounded-full uppercase tracking-wide'>
                {assignment.subject}
              </span>
              <span className='flex items-center gap-1 text-xs text-gray-500'>
                <Award className='h-3.5 w-3.5' />
                {assignment.maxMarks} marks total
              </span>
              {isPastDue ? (
                <span className='flex items-center gap-1 text-xs text-red-400 font-medium'>
                  <Clock className='h-3.5 w-3.5' />
                  Closed · {dueDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              ) : (
                <span className='flex items-center gap-1 text-xs text-gray-500'>
                  <Calendar className='h-3.5 w-3.5' />
                  Due {dueDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  <span className='font-semibold text-gray-400'>· {daysLeft}d left</span>
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors mt-0.5'
          >
            <X className='h-4 w-4' />
          </button>
        </div>

        {/* Scrollable body */}
        <div className='overflow-y-auto max-h-[calc(82vh-96px)]'>
          <div className='px-7 py-6 bg-gray-50 space-y-4'>

            {/* Questions */}
            {questions.length > 0 ? (
              <div>
                <div className='flex items-center gap-1.5 mb-3'>
                  <FileText className='h-3.5 w-3.5 text-gray-400' />
                  <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>
                    Questions · {questions.length} total
                  </p>
                </div>
                <div className='space-y-3'>
                  {questions.map((q, i) => (
                    <div key={i} className='rounded-xl bg-white border border-gray-200 p-4'>
                      <div className='flex items-start gap-3'>
                        <span className='flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black text-white text-xs font-bold mt-0.5'>
                          {i + 1}
                        </span>
                        <div className='flex-1'>
                          <p className='text-sm font-medium text-gray-800 leading-snug'>
                            {q.question}
                          </p>
                          <p className='text-xs text-gray-400 mt-2 font-semibold'>
                            {q.marks} {q.marks === 1 ? 'mark' : 'marks'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : assignment.description ? (
              <div>
                <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2'>Description</p>
                <div className='rounded-xl bg-white border border-gray-200 p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap'>
                  {assignment.description}
                </div>
              </div>
            ) : null}

            {/* Summary bar */}
            <div className='rounded-xl bg-white border border-gray-200 px-5 py-3 flex items-center justify-between'>
              <span className='text-sm text-gray-500'>
                {questions.length > 0
                  ? `${questions.length} question${questions.length !== 1 ? 's' : ''}`
                  : 'Open answer'}
              </span>
              <span className='text-sm font-bold text-gray-900'>
                Total: {assignment.maxMarks} marks
              </span>
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
