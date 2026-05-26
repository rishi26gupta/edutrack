'use client';
import React, { useState } from 'react';
import { Loader2, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogClose, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface GradeModalProps {
  submission: any;
  onClose: () => void;
  onSaved: () => void;
}

export default function GradeModal({ submission, onClose, onSaved }: GradeModalProps) {
  const maxMarks    = submission?.assignmentId?.maxMarks;
  const aiSuggested = submission?.aiSuggestedGrade;
  const aiBreakdown: string[] = submission?.aiBreakdown ?? [];

  const [grade,   setGrade]   = useState<string>(submission?.grade?.toString() ?? '');
  const [remarks, setRemarks] = useState(submission?.teacherRemarks ?? '');
  const [status,  setStatus]  = useState(submission?.status === 'resubmit' ? 'resubmit' : 'graded');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (grade === '' || isNaN(Number(grade))) { toast.error('Please enter a valid grade'); return; }
    if (Number(grade) < 0)                     { toast.error('Grade cannot be negative'); return; }
    if (maxMarks != null && Number(grade) > maxMarks) { toast.error(`Grade cannot exceed ${maxMarks}`); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/submissions/${submission._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grade: Number(grade), teacherRemarks: remarks, status }),
      });
      if (res.ok) { onSaved(); onClose(); }
      else { const d = await res.json(); toast.error(d.error || 'Failed to save grade'); }
    } catch { toast.error('Something went wrong'); }
    setLoading(false);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className='w-[95vw] sm:max-w-2xl max-h-[82vh] p-0 overflow-hidden rounded-2xl gap-0 flex flex-col' showCloseButton={false}>

        <div className='flex items-start justify-between px-7 py-5 shrink-0' style={{ background: '#0A0A0A' }}>
          <div>
            <DialogTitle className='text-white font-bold text-lg'>Grade Submission</DialogTitle>
            <div className='flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-500'>
              {submission.studentId?.name && <span>{submission.studentId.name}</span>}
              {submission.assignmentId?.title && (
                <><span>·</span><span>{submission.assignmentId.title}</span></>
              )}
              {maxMarks && (
                <><span>·</span><span className='text-gray-400 font-medium'>Max {maxMarks} pts</span></>
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

        <div className='flex-1 min-h-0 overflow-y-auto'>
          <div className='px-7 py-6 space-y-5 bg-gray-50'>

            {submission.assignmentId?.questions?.length > 0 && (
              <div>
                <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2'>
                  Student Answers
                </p>
                <div className='space-y-2'>
                  {submission.assignmentId.questions.map((q: any, i: number) => (
                    <div key={i} className='rounded-xl bg-white border border-gray-200 p-4'>
                      <div className='flex items-start gap-2.5 mb-2'>
                        <span className='flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-900 text-white text-xs font-bold mt-0.5'>
                          {i + 1}
                        </span>
                        <p className='text-sm font-medium text-gray-700 leading-snug'>
                          {q.question}
                          <span className='ml-1.5 font-normal text-gray-400'>({q.marks} marks)</span>
                        </p>
                      </div>
                      <p className='text-sm text-gray-600 leading-relaxed whitespace-pre-wrap pl-7'>
                        {submission.answers?.[i]?.answer || '—'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!submission.assignmentId?.questions?.length && (
              <div>
                <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2'>
                  Student Answer
                </p>
                <div className='bg-white rounded-xl p-4 max-h-32 overflow-y-auto text-sm text-gray-700 leading-relaxed whitespace-pre-wrap border border-gray-200'>
                  {submission.content}
                </div>
              </div>
            )}

            {(aiSuggested != null || aiBreakdown.length > 0 || submission.aiFeedback) && (
              <div className='rounded-xl border border-gray-200 bg-white overflow-hidden'>
                <div className='px-4 py-3 border-b border-gray-100 flex items-center justify-between'>
                  <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>
                    Automated Evaluation
                  </p>
                  {aiSuggested != null && (
                    <span className='text-xs font-semibold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-full'>
                      Suggested: {aiSuggested} / {maxMarks}
                    </span>
                  )}
                </div>

                <div className='p-4 space-y-3'>
                  {submission.aiFeedback && (
                    <p className='text-sm text-gray-600 leading-relaxed'>{submission.aiFeedback}</p>
                  )}

                  {aiBreakdown.length > 0 && (
                    <div className='space-y-2 pt-1'>
                      {aiBreakdown.map((line, i) => {
                        const isWrong = /0\s*(out\s*of|\/)/i.test(line) || /incorrect|wrong|missing|incomplete/i.test(line);
                        return (
                          <div key={i} className='flex items-start gap-2'>
                            {isWrong
                              ? <AlertCircle className='h-3.5 w-3.5 text-red-400 shrink-0 mt-0.5' />
                              : <CheckCircle2 className='h-3.5 w-3.5 text-green-500 shrink-0 mt-0.5' />
                            }
                            <p className='text-sm text-gray-600 leading-relaxed'>{line}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {aiSuggested != null && (
                    <button
                      type='button'
                      onClick={() => setGrade(String(aiSuggested))}
                      className='w-full mt-1 h-11 rounded-lg border border-dashed border-gray-300 text-sm font-medium text-gray-500 hover:border-gray-900 hover:text-gray-900 transition-all'
                    >
                      Use suggested grade — {aiSuggested} / {maxMarks}
                    </button>
                  )}
                </div>
              </div>
            )}

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1.5'>
                Final Grade {maxMarks ? `(0 – ${maxMarks})` : ''} <span className='text-red-500'>*</span>
              </label>
              <Input
                type='number'
                placeholder={`Enter marks${maxMarks ? ` out of ${maxMarks}` : ''}`}
                value={grade}
                min={0}
                max={maxMarks}
                onChange={e => setGrade(e.target.value)}
                className='h-12 text-sm border-gray-200 bg-white'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1.5'>
                Remarks <span className='font-normal text-gray-400'>(optional)</span>
              </label>
              <Textarea
                placeholder='Write feedback for the student…'
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
                rows={3}
                className='text-sm border-gray-200 bg-white resize-none'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1.5'>Status</label>
              <Select value={status} onValueChange={v => setStatus(v ?? 'graded')}>
                <SelectTrigger className='h-12 text-sm border-gray-200 bg-white'>
                  <span className='flex-1 text-left text-sm'>
                    {status === 'graded' ? '✅ Graded' : '🔄 Ask to Resubmit'}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='graded'>✅ Graded</SelectItem>
                  <SelectItem value='resubmit'>🔄 Ask to Resubmit</SelectItem>
                </SelectContent>
              </Select>
            </div>

          </div>
        </div>

        <div className='shrink-0 flex gap-3 px-7 py-4 bg-white border-t border-gray-100'>
          <Button variant='outline' className='flex-1 h-12 text-sm' onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading}
            className='flex-1 h-12 font-semibold bg-black hover:bg-gray-900 text-white gap-2 text-sm'
          >
            {loading ? <><Loader2 className='h-4 w-4 animate-spin' />Saving…</> : 'Save Grade'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
