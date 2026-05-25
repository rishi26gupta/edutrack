import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Assignment from '@/models/Assignment';
import { verifyToken } from '@/lib/jwt';

function getUser(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  return token ? verifyToken(token) : null;
}

// GET — all assignments (teacher sees own, student sees all)
export async function GET(req: NextRequest) {
  const user = getUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const filter = user.role === 'teacher' ? { teacherId: user.id } : {};
    const assignments = await Assignment.find(filter).sort({ createdAt: -1 });
    return NextResponse.json(assignments);
  } catch (e) {
    console.error('[Assignments GET Error]', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST — create assignment (teacher only)
export async function POST(req: NextRequest) {
  const user = getUser(req);
  if (!user || user.role !== 'teacher') {
    return NextResponse.json({ error: 'Forbidden — teachers only' }, { status: 403 });
  }

  try {
    const { title, description, subject, dueDate, maxMarks } = await req.json();
    if (!title || !description || !subject || !dueDate || !maxMarks) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 });
    }

    await connectDB();
    const assignment = await Assignment.create({
      title,
      description,
      subject,
      dueDate,
      maxMarks: Number(maxMarks),
      teacherId: user.id,
    });
    return NextResponse.json(assignment, { status: 201 });
  } catch (e) {
    console.error('[Assignments POST Error]', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
