'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, ArrowRight, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className='flex items-center gap-1 text-xs text-red-500 mt-1.5'>
      <AlertCircle className='h-3 w-3 shrink-0' />
      {msg}
    </p>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [form,   setForm]   = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: typeof errors = {};
    if (!form.email)    e.email    = 'Email address is required';
    if (!form.password) e.password = 'Password is required';
    return e;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Invalid credentials');
      } else {
        toast.success(`Welcome back, ${data.name}!`);
        router.push(data.role === 'teacher' ? '/teacher/assignments' : '/student/assignments');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className='bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden'>
      <div className='px-8 py-6' style={{ background: '#0A0A0A' }}>
        <h1 className='text-2xl font-extrabold text-white'>Welcome back</h1>
        <p className='text-gray-500 text-sm mt-1'>Sign in to your EduTrack account</p>
      </div>

      <div className='px-8 py-7'>
        <form onSubmit={handleSubmit} className='space-y-4' noValidate>
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-1.5'>Email Address <span className='text-red-500'>*</span></label>
            <Input
              type='email'
              placeholder='you@example.com'
              value={form.email}
              onChange={e => { setForm({ ...form, email: e.target.value }); if (errors.email) setErrors(p => ({ ...p, email: undefined })); }}
              className={`h-11 text-sm bg-gray-50 ${errors.email ? 'border-red-400 focus-visible:ring-red-200' : 'border-gray-200'}`}
            />
            <FieldError msg={errors.email} />
          </div>

          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-1.5'>Password <span className='text-red-500'>*</span></label>
            <div className='relative'>
              <Input
                type={showPw ? 'text' : 'password'}
                placeholder='Enter your password'
                value={form.password}
                onChange={e => { setForm({ ...form, password: e.target.value }); if (errors.password) setErrors(p => ({ ...p, password: undefined })); }}
                className={`h-11 text-sm pr-10 bg-gray-50 ${errors.password ? 'border-red-400 focus-visible:ring-red-200' : 'border-gray-200'}`}
              />
              <button type='button' onClick={() => setShowPw(!showPw)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'>
                {showPw ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
              </button>
            </div>
            <FieldError msg={errors.password} />
          </div>

          <Button type='submit' disabled={loading}
            className='w-full h-11 text-sm font-bold gap-2 mt-1 bg-black hover:bg-gray-900 text-white rounded-xl'>
            {loading
              ? <><Loader2 className='h-4 w-4 animate-spin' />Signing in...</>
              : <><ArrowRight className='h-4 w-4' />Sign In</>}
          </Button>
        </form>

        <p className='text-center text-sm text-gray-500 mt-6 pt-5 border-t border-gray-100'>
          Don't have an account?{' '}
          <Link href='/register' className='font-bold text-black hover:underline'>Create account</Link>
        </p>
      </div>
    </div>
  );
}
