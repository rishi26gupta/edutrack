import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const statusColor: any = {
  submitted: 'bg-blue-100 text-blue-800',
  graded: 'bg-green-100 text-green-800',
  resubmit: 'bg-orange-100 text-orange-800',
};

interface FeedbackPanelProps {
  submission: any;
}

export default function FeedbackPanel({ submission }: FeedbackPanelProps) {
  return (
    <Card className='border-blue-200 bg-blue-50'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-blue-800 text-lg'>
          AI Feedback
          <span className={`text-xs px-2 py-1 rounded-full ${statusColor[submission.status]}`}>
            {submission.status}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-3'>
        <p className='text-sm whitespace-pre-line'>{submission.aiFeedback}</p>
        {submission.grade !== undefined && (
          <div className='bg-white rounded p-3 border'>
            <p className='font-semibold'>Grade: {submission.grade} marks</p>
            {submission.teacherRemarks && (
              <p className='text-sm text-gray-600 mt-1'>{submission.teacherRemarks}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
