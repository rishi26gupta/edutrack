'use client';
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import FeedbackPanel from './FeedbackPanel';

interface SubmissionFormProps {
  assignmentId: string;
}

export default function SubmissionForm({ assignmentId }: SubmissionFormProps) {
  const [content, setContent] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);

  const handleSubmit = async () => {
    if (content.length < 10) return alert('Content too short');
    setLoading(true);
    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignmentId, content, fileUrl }),
      });
      const data = await res.json();
      if (res.ok) setFeedback(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className='space-y-4'>
      <Textarea
        rows={6}
        placeholder='Write your answer here...'
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <Input
        placeholder='File URL (optional — Google Drive, GitHub link)'
        value={fileUrl}
        onChange={(e) => setFileUrl(e.target.value)}
      />
      <Button className='w-full' onClick={handleSubmit} disabled={loading}>
        {loading ? 'Submitting & getting AI feedback...' : 'Submit Assignment'}
      </Button>
      {feedback && <FeedbackPanel submission={feedback} />}
    </div>
  );
}
