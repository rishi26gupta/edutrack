'use client';
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface AssignmentFormProps {
  initial?: any;
  onSuccess: () => void;
}

export default function AssignmentForm({ initial, onSuccess }: AssignmentFormProps) {
  const [form, setForm] = useState(
    initial || {
      title: '',
      description: '',
      subject: '',
      dueDate: '',
      maxMarks: '',
    }
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const method = initial ? 'PUT' : 'POST';
    const url = initial ? `/api/assignments/${initial._id}` : '/api/assignments';
    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          maxMarks: Number(form.maxMarks),
        }),
      });
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
    onSuccess();
  };

  return (
    <div className='space-y-3'>
      <Input
        placeholder='Title'
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <Textarea
        placeholder='Description'
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <Input
        placeholder='Subject'
        value={form.subject}
        onChange={(e) => setForm({ ...form, subject: e.target.value })}
      />
      <Input
        type='date'
        value={form.dueDate ? form.dueDate.split('T')[0] : ''}
        onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
      />
      <Input
        type='number'
        placeholder='Max Marks'
        value={form.maxMarks}
        onChange={(e) => setForm({ ...form, maxMarks: e.target.value })}
      />
      <Button className='w-full' onClick={handleSubmit} disabled={loading}>
        {loading ? 'Saving...' : initial ? 'Update' : 'Create'}
      </Button>
    </div>
  );
}
