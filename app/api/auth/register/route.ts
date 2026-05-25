import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { signToken } from '@/lib/jwt';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role } = await req.json();
    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 });
    }

    await connectDB();
    const exists = await User.findOne({ email });
    if (exists) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashed, role });

    const token = signToken({ id: user._id, role: user.role });
    const res = NextResponse.json({ message: 'Registered successfully', role: user.role }, { status: 201 });
    res.cookies.set('token', token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
      sameSite: 'lax',
    });

    return res;
  } catch (e) {
    console.error('[Register Error]', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
