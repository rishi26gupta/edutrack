'use client';
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  const [grade, setGrade] = useState(submission?.grade || '');
  const [remarks, setRemarks] = useState(submission?.teacherRemarks || '');
  const [status, setStatus] = useState(submission?.status || 'graded');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await fetch(`/api/submissions/${submission._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grade: Number(grade), teacherRemarks: remarks, status }),
      });
      onSaved();
      onClose();
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Grade Submission</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <div>
            <p className='text-sm font-medium mb-1'>Student Answer:</p>
            <p className='text-sm bg-gray-50 p-3 rounded max-h-32 overflow-y-auto whitespace-pre-wrap'>
              {submission.content}
            </p>
          </div>
          <Input
            type='number'
            placeholder='Grade (out of max marks)'
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
          />
          <Textarea
            placeholder='Teacher remarks...'
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
          <div className='flex items-center gap-2'>
            <span className='text-sm font-medium'>Status:</span>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className='w-full'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='graded'>Graded</SelectItem>
                <SelectItem value='resubmit'>Ask to Resubmit</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className='w-full' onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Grade'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
