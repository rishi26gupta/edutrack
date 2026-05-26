'use client';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, SendHorizonal, Link2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import FeedbackPanel from './FeedbackPanel';

interface SubmissionFormProps {
  assignment: any;
  onSuccess?: () => void;
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className='flex items-center gap-1 text-xs text-red-500 mt-1.5'>
      <AlertCircle className='h-3 w-3 shrink-0' />
      {msg}
    </p>
  );
}

export default function SubmissionForm({ assignment, onSuccess }: SubmissionFormProps) {
  const questions: { question: string; marks: number }[] =
    assignment?.questions?.length > 0
      ? assignment.questions
      : [{ question: assignment?.description ?? 'Write your answer below.', marks: assignment?.maxMarks ?? 0 }];

  const [answers,      setAnswers]      = useState<string[]>(questions.map(() => ''));
  const [fileUrl,      setFileUrl]      = useState('');
  const [answerErrors, setAnswerErrors] = useState<(string | undefined)[]>(questions.map(() => undefined));
  const [loading,      setLoading]      = useState(false);
  const [submission,   setSubmission]   = useState<any>(null);

  const setAnswer = (i: number, val: string) => {
    setAnswers(p => p.map((a, idx) => (idx === i ? val : a)));
    if (answerErrors[i]) {
      setAnswerErrors(p => p.map((e, idx) => (idx === i ? undefined : e)));
    }
  };

  const handleSubmit = async () => {
    const errs = answers.map(a =>
      a.trim().length === 0
        ? 'This field is required'
        : a.trim().length < 5
        ? 'Answer must be at least 5 characters'
        : undefined
    );

    if (errs.some(Boolean)) {
      setAnswerErrors(errs);
      return;
    }

    setAnswerErrors(questions.map(() => undefined));
    setLoading(true);
    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentId: assignment._id,
          answers: answers.map(a => ({ answer: a.trim() })),
          fileUrl: fileUrl.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmission(data);
        onSuccess?.();
      } else {
        toast.error(data.error || 'Submission failed. Please try again.');
      }
    } catch {
      toast.error('Something went wrong. Please check your connection.');
    }
    setLoading(false);
  };

  /* ── Success state ── */
  if (submission) {
    return (
      <div className='space-y-4'>
        <div className='flex items-center gap-3 rounded-xl bg-green-50 border border-green-200 px-5 py-4'>
          <CheckCircle2 className='h-5 w-5 text-green-500 shrink-0' />
          <p className='text-sm font-medium text-green-800'>
            Submitted successfully! Your evaluation is ready below.
          </p>
        </div>
        <FeedbackPanel submission={submission} />
      </div>
    );
  }

  /* ── Form ── */
  return (
    <div className='space-y-5'>
      {questions.map((q, idx) => (
        <div
          key={idx}
          className={`rounded-2xl overflow-hidden transition-colors ${
            answerErrors[idx] ? 'border border-red-300' : 'border border-gray-200'
          } bg-gray-50`}
        >
          {/* Question header */}
          <div className='flex items-start gap-3 px-5 py-4 bg-white border-b border-gray-100'>
            <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white text-xs font-bold mt-0.5 ${answerErrors[idx] ? 'bg-red-500' : 'bg-black'}`}>
              {idx + 1}
            </span>
            <div className='flex-1'>
              <p className='text-sm font-semibold text-gray-800 leading-snug'>{q.question}</p>
              <p className='text-xs text-gray-400 mt-1'>{q.marks} marks</p>
            </div>
          </div>

          {/* Answer */}
          <div className='p-5'>
            <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5'>
              Your Answer <span className='text-red-500'>*</span>
            </label>
            <Textarea
              rows={5}
              placeholder={`Write your answer for question ${idx + 1}…`}
              value={answers[idx]}
              onChange={e => setAnswer(idx, e.target.value)}
              className={`resize-none text-sm leading-relaxed w-full bg-white ${
                answerErrors[idx]
                  ? 'border-red-400 focus-visible:ring-red-200'
                  : 'border-gray-200 focus-visible:ring-gray-900/20'
              }`}
            />
            <div className='flex items-center justify-between mt-1'>
              <FieldError msg={answerErrors[idx]} />
              <p className='text-xs text-gray-400 text-right ml-auto'>
                {answers[idx].length} chars
                {answers[idx].length > 0 && answers[idx].length < 5 ? ' — need 5+' : ''}
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* Attachment */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1.5'>
          Attachment Link <span className='font-normal text-gray-400'>(optional)</span>
        </label>
        <div className='relative'>
          <Link2 className='absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400' />
          <Input
            placeholder='Google Drive, GitHub or any public link'
            value={fileUrl}
            onChange={e => setFileUrl(e.target.value)}
            className='pl-10 text-sm border-gray-200 h-12'
          />
        </div>
      </div>

      {/* Submit */}
      <Button
        className='w-full h-13 bg-black hover:bg-gray-900 text-white font-semibold gap-2 text-base rounded-xl transition-colors'
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <><Loader2 className='h-4 w-4 animate-spin' />Submitting & evaluating…</>
        ) : (
          <><SendHorizonal className='h-4 w-4' />Submit Assignment</>
        )}
      </Button>
    </div>
  );
}
