import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const payload = token ? verifyToken(token) : null;
  if (!payload || payload.role !== 'teacher') {
    return NextResponse.json({ error: 'Forbidden — teachers only' }, { status: 403 });
  }

  try {
    await connectDB();
    const students = await User.find({ role: 'student' })
      .select('-password')
      .sort({ createdAt: -1 });
    return NextResponse.json(students);
  } catch (e) {
    console.error('[Users GET Error]', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
