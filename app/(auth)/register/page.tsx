'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.role) {
      return setError('Please fill in all fields');
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Registration failed');
      } else {
        router.push('/login');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
    setLoading(false);
  };

  return (
    <Card className='shadow-lg border-t-4 border-t-blue-600'>
      <CardHeader>
        <CardTitle className='text-2xl text-center text-blue-700 font-extrabold'>Create Account</CardTitle>
        <CardDescription className='text-center text-gray-500'>
          Join EduTrack to submit or grade assignments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <label className='text-sm font-semibold text-gray-700'>Full Name</label>
            <Input
              placeholder='John Doe'
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
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
              placeholder='Min 6 characters'
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <div className='space-y-2'>
            <label className='text-sm font-semibold text-gray-700'>Your Role</label>
            <Select value={form.role} onValueChange={(val) => setForm({ ...form, role: val })}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Select Role' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='student'>Student</SelectItem>
                <SelectItem value='teacher'>Teacher</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {error && <p className='text-red-500 text-sm font-semibold'>{error}</p>}
          <Button type='submit' className='w-full bg-blue-600 hover:bg-blue-700' disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </Button>
        </form>
        <p className='text-center text-sm text-gray-600 mt-4'>
          Already have an account?{' '}
          <Link href='/login' className='text-blue-600 font-semibold hover:underline'>
            Login
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
