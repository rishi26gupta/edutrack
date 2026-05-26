'use client';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ChevronDown, ChevronUp } from 'lucide-react';
import FeedbackPanel from '@/components/FeedbackPanel';

const statusStyle: Record<string, string> = {
  submitted: 'bg-blue-100 text-blue-700',
  graded: 'bg-green-100 text-green-700',
  resubmit: 'bg-amber-100 text-amber-800',
};

export default function StudentSubmissionsPage() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/submissions')
      .then(r => r.json())
      .then(data => setSubmissions(Array.isArray(data) ? data : []))
      .catch(() => toast.error('Failed to load submissions'))
      .finally(() => setLoading(false));
  }, []);

  const toggle = (id: string) => setExpanded(prev => prev === id ? null : id);

  return (
    <div>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold text-gray-900'>My Submissions</h1>
        <p className='text-base text-gray-500 mt-1'>Track your submitted assignments, grades and evaluations</p>
      </div>

      {loading ? (
        <div className='space-y-3'>
          {[1, 2, 3].map(i => (
            <div key={i} className='h-16 rounded-lg bg-gray-100 animate-pulse' />
          ))}
        </div>
      ) : submissions.length === 0 ? (
        <div className='text-center py-20 text-gray-400'>
          <p className='text-lg font-semibold'>No submissions yet</p>
          <p className='text-sm mt-1'>Go to Assignments to submit your work</p>
        </div>
      ) : (
        <div className='space-y-3'>
          {submissions.map(s => {
            const isOpen = expanded === s._id;
            return (
              <div key={s._id} className='border rounded-lg overflow-hidden bg-white shadow-sm'>
                <button
                  className='w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors text-left'
                  onClick={() => toggle(s._id)}
                >
                  <div className='min-w-0 flex-1'>
                    <p className='font-semibold text-gray-800 truncate'>{s.assignmentId?.title}</p>
                    <p className='text-xs text-gray-400 mt-0.5'>
                      {s.assignmentId?.subject} · Submitted {new Date(s.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className='flex items-center gap-3 ml-4 shrink-0'>
                    {s.grade != null && (
                      <span className='text-sm font-bold text-green-700'>
                        {s.grade} / {s.assignmentId?.maxMarks}
                      </span>
                    )}
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${statusStyle[s.status]}`}>
                      {s.status}
                    </span>
                    {isOpen
                      ? <ChevronUp className='h-4 w-4 text-gray-400' />
                      : <ChevronDown className='h-4 w-4 text-gray-400' />
                    }
                  </div>
                </button>

                {isOpen && (
                  <div className='border-t px-4 pb-4 pt-3 bg-gray-50 space-y-3'>
                    <div>
                      <p className='text-xs font-semibold text-gray-500 uppercase mb-1'>Your Answers</p>

                      {/* Per-question answers (new format) */}
                      {s.answers?.length > 0 ? (
                        <div className='space-y-2'>
                          {s.answers.map((a: { answer: string }, i: number) => {
                            const q = s.assignmentId?.questions?.[i];
                            return (
                              <div key={i} className='rounded-lg bg-white border border-gray-200 p-3'>
                                {q && (
                                  <div className='flex items-start gap-2 mb-1.5'>
                                    <span className='flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-900 text-white text-xs font-bold mt-0.5'>
                                      {i + 1}
                                    </span>
                                    <p className='text-xs font-medium text-gray-500 leading-snug'>
                                      {q.question}
                                      <span className='ml-1 text-gray-400 font-normal'>({q.marks} marks)</span>
                                    </p>
                                  </div>
                                )}
                                <p className='text-sm text-gray-700 leading-relaxed whitespace-pre-wrap pl-7'>
                                  {a.answer || '—'}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        /* Fallback for old single-answer submissions */
                        <p className='text-sm text-gray-700 whitespace-pre-wrap leading-relaxed'>{s.content}</p>
                      )}
                    </div>
                    <FeedbackPanel submission={s} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
