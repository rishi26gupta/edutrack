import React from 'react';
import { CheckCircle2, AlertCircle, RotateCcw, MessageSquare, Star } from 'lucide-react';

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  submitted: { label: 'Under Review', bg: '#F0F9FF', color: '#0369A1' },
  graded:    { label: 'Graded',       bg: '#F0FDF4', color: '#15803D' },
  resubmit:  { label: 'Resubmit',    bg: '#FFFBEB', color: '#92400E' },
};

export default function FeedbackPanel({ submission }: { submission: any }) {
  const s = statusConfig[submission.status] ?? statusConfig.submitted;
  const breakdown: string[] = submission.aiBreakdown ?? [];

  return (
    <div
      className='rounded-xl overflow-hidden'
      style={{ background: '#0A0A0A', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      {/* Header */}
      <div
        className='flex items-center justify-between px-5 py-4'
        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
      >
        <p className='text-sm font-semibold text-white'>Evaluation</p>
        <span
          className='text-xs font-semibold px-2.5 py-1 rounded-full capitalize'
          style={{ background: s.bg, color: s.color }}
        >
          {s.label}
        </span>
      </div>

      {/* Overall feedback */}
      {submission.aiFeedback && (
        <div className='px-5 py-4' style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2'>
            Overall Assessment
          </p>
          <p className='text-sm text-gray-300 leading-relaxed'>
            {submission.aiFeedback}
          </p>
        </div>
      )}

      {/* Per-question breakdown */}
      {breakdown.length > 0 && (
        <div className='px-5 py-4' style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3'>
            Question Breakdown
          </p>
          <div className='space-y-2.5'>
            {breakdown.map((line, i) => {
              const isWrong =
                /0\s*(out\s*of|\/)/i.test(line) ||
                /incorrect|wrong|missing|incomplete/i.test(line);
              return (
                <div key={i} className='flex items-start gap-2.5'>
                  {isWrong
                    ? <AlertCircle className='h-3.5 w-3.5 text-red-400 shrink-0 mt-0.5' />
                    : <CheckCircle2 className='h-3.5 w-3.5 text-green-500 shrink-0 mt-0.5' />
                  }
                  <p className='text-sm text-gray-400 leading-relaxed'>{line}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Grade */}
      {submission.grade != null && (
        <div className='px-5 py-4'>
          <div
            className='rounded-xl p-4'
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className='flex items-center justify-between mb-2'>
              <span className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>
                Final Grade
              </span>
              <div className='flex items-center gap-1.5'>
                <Star className='h-4 w-4 text-white fill-white' />
                <span className='text-white font-bold text-xl'>{submission.grade}</span>
                {submission.assignmentId?.maxMarks && (
                  <span className='text-gray-500 text-sm'>/ {submission.assignmentId.maxMarks}</span>
                )}
              </div>
            </div>
            {submission.teacherRemarks && (
              <div
                className='flex gap-2 pt-3'
                style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
              >
                <MessageSquare className='h-3.5 w-3.5 text-gray-500 shrink-0 mt-0.5' />
                <p className='text-sm text-gray-400 leading-relaxed'>{submission.teacherRemarks}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Resubmit notice */}
      {submission.status === 'resubmit' && (
        <div
          className='flex items-center gap-2 mx-5 mb-4 px-4 py-3 rounded-xl'
          style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.18)' }}
        >
          <RotateCcw className='h-3.5 w-3.5 text-amber-400 shrink-0' />
          <p className='text-sm text-amber-300'>
            Your teacher has asked you to resubmit this assignment.
          </p>
        </div>
      )}
    </div>
  );
}
