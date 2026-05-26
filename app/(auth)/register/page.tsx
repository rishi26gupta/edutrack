'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, ArrowRight, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className='flex items-center gap-1 text-xs text-red-500 mt-1.5'>
      <AlertCircle className='h-3 w-3 shrink-0' />
      {msg}
    </p>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [form,   setForm]   = useState({ name: '', email: '', password: '', role: 'student' });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: typeof errors = {};
    if (!form.name)                    e.name     = 'Full name is required';
    if (!form.email)                   e.email    = 'Email address is required';
    if (!form.password)                e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    return e;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || 'Registration failed'); }
      else { toast.success('Account created! Please sign in.'); router.push('/login'); }
    } catch { toast.error('Something went wrong. Please try again.'); }
    setLoading(false);
  };

  return (
    <div className='bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden'>
      <div className='px-8 py-6' style={{ background: '#0A0A0A' }}>
        <h1 className='text-2xl font-extrabold text-white'>Create account</h1>
        <p className='text-gray-500 text-sm mt-1'>Join EduTrack — powered by House of EdTech</p>
      </div>

      <div className='px-8 py-7'>
        <form onSubmit={handleSubmit} className='space-y-4' noValidate>
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-1.5'>Full Name <span className='text-red-500'>*</span></label>
            <Input
              placeholder='John Doe'
              value={form.name}
              onChange={e => { setForm({ ...form, name: e.target.value }); if (errors.name) setErrors(p => ({ ...p, name: undefined })); }}
              className={`h-11 text-sm bg-gray-50 ${errors.name ? 'border-red-400 focus-visible:ring-red-200' : 'border-gray-200'}`}
            />
            <FieldError msg={errors.name} />
          </div>

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
                placeholder='Min 6 characters'
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

          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-1.5'>I am a <span className='text-red-500'>*</span></label>
            <Select value={form.role} onValueChange={val => setForm({ ...form, role: val ?? 'student' })}>
              <SelectTrigger className='h-11 text-sm border-gray-200 bg-gray-50'>
                <span className='flex-1 text-left text-sm'>
                  {form.role === 'teacher' ? 'Teacher' : 'Student'}
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='student'>Student</SelectItem>
                <SelectItem value='teacher'>Teacher</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type='submit' disabled={loading}
            className='w-full h-11 text-sm font-bold gap-2 mt-1 bg-black hover:bg-gray-900 text-white rounded-xl'>
            {loading
              ? <><Loader2 className='h-4 w-4 animate-spin' />Creating account...</>
              : <><ArrowRight className='h-4 w-4' />Create Account</>}
          </Button>
        </form>

        <p className='text-center text-sm text-gray-500 mt-6 pt-5 border-t border-gray-100'>
          Already have an account?{' '}
          <Link href='/login' className='font-bold text-black hover:underline'>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
