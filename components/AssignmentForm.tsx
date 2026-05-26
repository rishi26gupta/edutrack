'use client';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Plus, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface Question {
  question: string;
  marks: number | '';
}

type QError = { question?: string; marks?: string };

type FormErrors = {
  title?: string;
  subject?: string;
  dueDate?: string;
  questions?: QError[];
};

interface AssignmentFormProps {
  initial?: any;
  onSuccess: () => void;
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

export default function AssignmentForm({ initial, onSuccess }: AssignmentFormProps) {
  const [title,     setTitle]     = useState(initial?.title   ?? '');
  const [subject,   setSubject]   = useState(initial?.subject ?? '');
  const [dueDate,   setDueDate]   = useState(
    initial?.dueDate ? initial.dueDate.split('T')[0] : ''
  );
  const [questions, setQuestions] = useState<Question[]>(
    initial?.questions?.length > 0
      ? initial.questions.map((q: any) => ({ question: q.question, marks: q.marks }))
      : [{ question: '', marks: '' }]
  );
  const [errors,  setErrors]  = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const today      = new Date().toISOString().split('T')[0];
  const totalMarks = questions.reduce((s, q) => s + (Number(q.marks) || 0), 0);

  // ── helpers ──────────────────────────────────────────────────────────
  const clearFieldError = (field: keyof FormErrors) =>
    setErrors(p => ({ ...p, [field]: undefined }));

  const clearQError = (idx: number, field: keyof QError) =>
    setErrors(p => {
      if (!p.questions) return p;
      const qs = [...p.questions];
      qs[idx] = { ...qs[idx], [field]: undefined };
      return { ...p, questions: qs };
    });

  const addQuestion = () =>
    setQuestions(p => [...p, { question: '', marks: '' }]);

  const removeQuestion = (i: number) => {
    if (questions.length === 1) {
      toast.error('At least one question is required');
      return;
    }
    setQuestions(p => p.filter((_, idx) => idx !== i));
    setErrors(p => {
      if (!p.questions) return p;
      return { ...p, questions: p.questions.filter((_, idx) => idx !== i) };
    });
  };

  const updateQ = (i: number, field: 'question' | 'marks', val: string) => {
    setQuestions(p =>
      p.map((q, idx) =>
        idx !== i
          ? q
          : { ...q, [field]: field === 'marks' ? (val === '' ? '' : Number(val)) : val }
      )
    );
    clearQError(i, field);
  };

  // ── validation ───────────────────────────────────────────────────────
  const validate = (): FormErrors => {
    const e: FormErrors = {};

    if (!title.trim())   e.title   = 'Assignment title is required';
    if (!subject.trim()) e.subject = 'Subject is required';
    if (!dueDate)        e.dueDate = 'Due date is required';
    else if (dueDate < today) e.dueDate = 'Due date cannot be in the past';

    const qErrors: QError[] = questions.map(q => {
      const qe: QError = {};
      if (!q.question.trim())           qe.question = 'Question text is required';
      if (!q.marks || Number(q.marks) < 1) qe.marks = 'Marks must be at least 1';
      return qe;
    });

    if (qErrors.some(qe => qe.question || qe.marks)) e.questions = qErrors;

    return e;
  };

  const hasErrors = (e: FormErrors) =>
    e.title || e.subject || e.dueDate || e.questions?.some(qe => qe.question || qe.marks);

  // ── submit ───────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    const e = validate();
    if (hasErrors(e)) {
      setErrors(e);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const method = initial ? 'PUT' : 'POST';
      const url    = initial ? `/api/assignments/${initial._id}` : '/api/assignments';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title:   title.trim(),
          subject: subject.trim(),
          dueDate,
          questions: questions.map(q => ({
            question: (q.question as string).trim(),
            marks:    Number(q.marks),
          })),
          maxMarks: totalMarks,
        }),
      });
      if (res.ok) {
        onSuccess();
      } else {
        const d = await res.json();
        toast.error(d.error || 'Failed to save assignment');
      }
    } catch {
      toast.error('Something went wrong');
    }
    setLoading(false);
  };

  // ── render ───────────────────────────────────────────────────────────
  return (
    <div className='space-y-7'>

      {/* ── Assignment Details ── */}
      <div className='space-y-4'>
        <p className='text-xs font-semibold text-gray-400 uppercase tracking-wide'>
          Assignment Details
        </p>

        {/* Title */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1.5'>Title <span className='text-red-500'>*</span></label>
          <Input
            placeholder='e.g. Chapter 3 — Laws of Motion'
            value={title}
            onChange={e => { setTitle(e.target.value); clearFieldError('title'); }}
            className={`h-12 text-sm bg-white ${errors.title ? 'border-red-400 focus-visible:ring-red-200' : 'border-gray-200'}`}
          />
          <FieldError msg={errors.title} />
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          {/* Subject */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1.5'>Subject <span className='text-red-500'>*</span></label>
            <Input
              placeholder='e.g. Physics'
              value={subject}
              onChange={e => { setSubject(e.target.value); clearFieldError('subject'); }}
              className={`h-12 text-sm bg-white ${errors.subject ? 'border-red-400 focus-visible:ring-red-200' : 'border-gray-200'}`}
            />
            <FieldError msg={errors.subject} />
          </div>

          {/* Due Date */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1.5'>Due Date <span className='text-red-500'>*</span></label>
            <Input
              type='date'
              value={dueDate}
              min={today}
              onChange={e => { setDueDate(e.target.value); clearFieldError('dueDate'); }}
              className={`h-12 text-sm bg-white ${errors.dueDate ? 'border-red-400 focus-visible:ring-red-200' : 'border-gray-200'}`}
            />
            <FieldError msg={errors.dueDate} />
          </div>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className='border-t border-gray-100' />

      {/* ── Questions ── */}
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-xs font-semibold text-gray-400 uppercase tracking-wide'>Questions</p>
            <p className='text-sm text-gray-500 mt-0.5'>
              {questions.length} question{questions.length !== 1 ? 's' : ''} ·{' '}
              <span className='font-semibold text-gray-700'>{totalMarks} marks total</span>
            </p>
          </div>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={addQuestion}
            className='h-10 px-5 text-sm gap-1.5 border-dashed border-gray-300 hover:border-gray-900 text-gray-500 hover:text-gray-900 transition-colors'
          >
            <Plus className='h-4 w-4' />
            Add Question
          </Button>
        </div>

        <div className='space-y-4'>
          {questions.map((q, idx) => {
            const qErr = errors.questions?.[idx];
            return (
              <div
                key={idx}
                className={`q-enter rounded-2xl bg-gray-50 overflow-hidden transition-colors ${
                  qErr?.question || qErr?.marks
                    ? 'border border-red-300'
                    : 'border border-gray-200'
                }`}
              >
                {/* Card header */}
                <div className='flex items-center justify-between px-5 py-3 bg-white border-b border-gray-100'>
                  <div className='flex items-center gap-2.5'>
                    <span className={`flex h-6 w-6 items-center justify-center rounded-full text-white text-xs font-bold ${qErr?.question || qErr?.marks ? 'bg-red-500' : 'bg-black'}`}>
                      {idx + 1}
                    </span>
                    <span className='text-sm font-medium text-gray-600'>Question {idx + 1}</span>
                  </div>
                  {questions.length > 1 && (
                    <button
                      type='button'
                      onClick={() => removeQuestion(idx)}
                      className='flex h-7 w-7 items-center justify-center rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors'
                    >
                      <Trash2 className='h-4 w-4' />
                    </button>
                  )}
                </div>

                {/* Card body */}
                <div className='p-5 space-y-3'>
                  <div>
                    <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5'>
                      Question Text <span className='text-red-500'>*</span>
                    </label>
                    <Textarea
                      placeholder='Type the question here…'
                      value={q.question}
                      onChange={e => updateQ(idx, 'question', e.target.value)}
                      rows={3}
                      className={`resize-none text-sm bg-white leading-relaxed w-full ${
                        qErr?.question
                          ? 'border-red-400 focus-visible:ring-red-200'
                          : 'border-gray-200 focus-visible:ring-gray-900/20'
                      }`}
                    />
                    <FieldError msg={qErr?.question} />
                  </div>

                  <div className='flex items-center gap-3'>
                    <label className='text-sm font-medium text-gray-600 shrink-0'>Marks <span className='text-red-500'>*</span></label>
                    <div>
                      <Input
                        type='number'
                        min={1}
                        max={200}
                        placeholder='10'
                        value={q.marks}
                        onChange={e => updateQ(idx, 'marks', e.target.value)}
                        className={`h-10 w-28 text-sm bg-white text-center ${
                          qErr?.marks
                            ? 'border-red-400 focus-visible:ring-red-200'
                            : 'border-gray-200'
                        }`}
                      />
                      <FieldError msg={qErr?.marks} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {questions.length > 1 && (
          <div className='flex items-center justify-between rounded-xl bg-gray-50 border border-gray-200 px-5 py-3'>
            <span className='text-sm text-gray-500'>{questions.length} questions combined</span>
            <span className='text-sm font-bold text-gray-900'>Total: {totalMarks} marks</span>
          </div>
        )}
      </div>

      {/* ── Submit ── */}
      <Button
        onClick={handleSubmit}
        disabled={loading}
        className='w-full h-13 bg-black hover:bg-gray-900 text-white font-semibold text-base rounded-xl gap-2 transition-colors'
      >
        {loading
          ? <><Loader2 className='h-4 w-4 animate-spin' />Saving…</>
          : initial ? 'Update Assignment' : 'Create Assignment'}
      </Button>
    </div>
  );
}
