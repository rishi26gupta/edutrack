'use client';
import React from 'react';
import { Calendar, Clock, Edit, Trash2, SendHorizonal, CheckCircle2, FileText, Eye, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AssignmentCardProps {
  assignment: any;
  role?: 'teacher' | 'student';
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onSubmit?: () => void;
  hasSubmitted?: boolean;
  needsResubmit?: boolean;
}

export default function AssignmentCard({
  assignment, role = 'teacher', onView, onEdit, onDelete, onSubmit, hasSubmitted = false, needsResubmit = false,
}: AssignmentCardProps) {
  const dueDate   = new Date(assignment.dueDate);
  const now       = new Date();
  const isPastDue = dueDate < now;
  const daysLeft  = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const qCount    = assignment.questions?.length ?? 0;

  return (
    <div
      className='group bg-white rounded-xl flex flex-col overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5'
      style={{ border: '1px solid #E5E7EB' }}
    >
      {/* Top accent */}
      <div className='h-[2px] w-full bg-black' />

      <div className='p-5 flex flex-col flex-1'>
        {/* Subject + marks */}
        <div className='flex items-center justify-between mb-3'>
          <span className='text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full uppercase tracking-wide'>
            {assignment.subject}
          </span>
          <span className='text-sm font-semibold text-gray-400'>
            {assignment.maxMarks} pts
          </span>
        </div>

        {/* Title */}
        <h3 className='font-bold text-gray-900 text-lg leading-snug mb-2 line-clamp-2'>
          {assignment.title}
        </h3>

        {/* Question count or description */}
        {qCount > 0 ? (
          <div className='flex items-center gap-1.5 mb-4'>
            <FileText className='h-4 w-4 text-gray-400 shrink-0' />
            <p className='text-sm text-gray-500'>
              {qCount} question{qCount !== 1 ? 's' : ''}
            </p>
          </div>
        ) : (
          <p className='text-sm text-gray-500 leading-relaxed line-clamp-2 flex-1 mb-4'>
            {assignment.description ?? 'No description provided.'}
          </p>
        )}

        <div className='flex-1' />

        {/* Due date */}
        <div className='mb-4'>
          {isPastDue ? (
            <span className='inline-flex items-center gap-1.5 text-sm font-semibold text-red-500'>
              <Clock className='h-4 w-4' />
              Closed · {dueDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </span>
          ) : (
            <span className='inline-flex items-center gap-1.5 text-sm text-gray-500'>
              <Calendar className='h-4 w-4' />
              Due {dueDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              <span className='font-bold text-gray-800'> · {daysLeft}d left</span>
            </span>
          )}
        </div>

        {/* Actions */}
        <div className='pt-3 mt-auto' style={{ borderTop: '1px solid #F3F4F6' }}>
          {role === 'teacher' ? (
            <div className='flex flex-col gap-2'>
              {/* View */}
              <Button variant='outline' size='sm' onClick={onView}
                className='w-full h-9 text-sm gap-2 text-gray-600 hover:text-gray-900 hover:border-gray-400 border-gray-200'>
                <Eye className='h-3.5 w-3.5' /> View Assignment
              </Button>
              {/* Edit + Delete */}
              <div className='flex gap-2'>
                <Button size='sm' onClick={onEdit}
                  className='flex-1 h-10 text-sm gap-1.5 bg-black hover:bg-gray-800 text-white border-0'>
                  <Edit className='h-3.5 w-3.5' /> Edit
                </Button>
                <Button variant='outline' size='sm' onClick={onDelete}
                  className='flex-1 h-10 text-sm gap-1.5 text-red-500 hover:bg-red-50 hover:border-red-300 border-red-200'>
                  <Trash2 className='h-3.5 w-3.5' /> Delete
                </Button>
              </div>
            </div>
          ) : hasSubmitted ? (
            <div className='flex flex-col gap-2'>
              <Button variant='outline' size='sm' onClick={onView}
                className='w-full h-9 text-sm gap-2 text-gray-600 hover:text-gray-900 hover:border-gray-400 border-gray-200'>
                <Eye className='h-3.5 w-3.5' /> View Details
              </Button>
              <div className='flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gray-50 text-sm text-gray-600 font-medium'>
                <CheckCircle2 className='h-4 w-4 text-green-500' /> Submitted
              </div>
            </div>
          ) : (
            <div className='flex flex-col gap-2'>
              {needsResubmit && (
                <div className='flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200'>
                  <RotateCcw className='h-3.5 w-3.5 text-amber-500 shrink-0' />
                  <p className='text-xs font-semibold text-amber-700'>Resubmission Required</p>
                </div>
              )}
              <Button variant='outline' size='sm' onClick={onView}
                className='w-full h-9 text-sm gap-2 text-gray-600 hover:text-gray-900 hover:border-gray-400 border-gray-200'>
                <Eye className='h-3.5 w-3.5' /> View Details
              </Button>
              <Button size='sm' onClick={onSubmit} disabled={isPastDue}
                className={`w-full h-11 text-sm gap-2 font-semibold text-white rounded-lg disabled:opacity-40 ${
                  needsResubmit
                    ? 'bg-amber-500 hover:bg-amber-600'
                    : 'bg-black hover:bg-gray-900'
                }`}>
                <SendHorizonal className='h-4 w-4' />
                {isPastDue ? 'Deadline Passed' : needsResubmit ? 'Resubmit Now' : 'Submit Assignment'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
