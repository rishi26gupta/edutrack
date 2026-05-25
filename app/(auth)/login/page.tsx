'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      return setError('Please fill in all fields');
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Invalid credentials');
      } else {
        router.push(data.role === 'teacher' ? '/teacher/assignments' : '/student/assignments');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
    setLoading(false);
  };

  return (
    <Card className='shadow-lg border-t-4 border-t-blue-600'>
      <CardHeader>
        <CardTitle className='text-2xl text-center text-blue-700 font-extrabold'>Login to EduTrack</CardTitle>
        <CardDescription className='text-center text-gray-500'>
          Student Assignment Submission & Grading Portal
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <label className='text-sm font-semibold text-gray-700'>Email Address</label>
            <Input
              type='email'
              placeholder='name@example.com'
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className='space-y-2'>
            <label className='text-sm font-semibold text-gray-700'>Password</label>
            <Input
              type='password'
              placeholder='••••••••'
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          {error && <p className='text-red-500 text-sm font-semibold'>{error}</p>}
          <Button type='submit' className='w-full bg-blue-600 hover:bg-blue-700' disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        <p className='text-center text-sm text-gray-600 mt-4'>
          Don't have an account?{' '}
          <Link href='/register' className='text-blue-600 font-semibold hover:underline'>
            Register
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
