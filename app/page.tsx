import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_APP_URL));
  }

  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_APP_URL));
  }

  if (payload.role === 'teacher') {
    return NextResponse.redirect(new URL('/teacher/assignments', process.env.NEXT_PUBLIC_APP_URL));
  }

  return NextResponse.redirect(new URL('/student/assignments', process.env.NEXT_PUBLIC_APP_URL));
}
