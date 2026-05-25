'use client';
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Edit, Trash2 } from 'lucide-react';

interface AssignmentCardProps {
  assignment: any;
  role?: 'teacher' | 'student';
  onEdit?: () => void;
  onDelete?: () => void;
  onSubmit?: () => void;
  hasSubmitted?: boolean;
}

export default function AssignmentCard({
  assignment,
  role = 'teacher',
  onEdit,
  onDelete,
  onSubmit,
  hasSubmitted = false,
}: AssignmentCardProps) {
  const isPastDue = new Date(assignment.dueDate) < new Date();

  return (
    <Card className='flex flex-col h-full hover:shadow-md transition-shadow'>
      <CardHeader className='pb-2'>
        <div className='flex justify-between items-start gap-2 mb-1'>
          <Badge variant='outline' className='bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200 capitalize'>
            {assignment.subject}
          </Badge>
          <span className='text-xs text-gray-500 font-medium'>
            Max: {assignment.maxMarks} marks
          </span>
        </div>
        <CardTitle className='text-lg font-bold leading-tight text-gray-800 line-clamp-1'>
          {assignment.title}
        </CardTitle>
        <CardDescription className='flex items-center gap-1.5 text-xs text-gray-500 mt-1'>
          <Calendar className='h-3.5 w-3.5' />
          Due: {new Date(assignment.dueDate).toLocaleDateString()}
          {isPastDue && (
            <Badge variant='destructive' className='text-[10px] px-1 py-0 h-4'>
              Past Due
            </Badge>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className='flex-1 py-2'>
        <p className='text-sm text-gray-600 line-clamp-3 leading-relaxed whitespace-pre-wrap'>
          {assignment.description}
        </p>
      </CardContent>
      <CardFooter className='border-t pt-3 pb-3 flex justify-between gap-2 bg-gray-50/50 rounded-b-lg'>
        {role === 'teacher' ? (
          <>
            <Button variant='outline' size='sm' className='flex-1 gap-1.5 text-gray-600' onClick={onEdit}>
              <Edit className='h-3.5 w-3.5' />
              Edit
            </Button>
            <Button variant='destructive' size='sm' className='flex-1 gap-1.5' onClick={onDelete}>
              <Trash2 className='h-3.5 w-3.5' />
              Delete
            </Button>
          </>
        ) : (
          <Button
            className='w-full'
            size='sm'
            onClick={onSubmit}
            disabled={hasSubmitted || isPastDue}
          >
            {hasSubmitted ? 'Submitted' : 'Submit Answer'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
