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
    const body = await req.json();
    const { title, subject, dueDate, questions } = body;

    if (!title || !subject || !dueDate) {
      return NextResponse.json({ error: 'title, subject and dueDate are required' }, { status: 400 });
    }
    const today = new Date().toISOString().split('T')[0];
    if (dueDate < today) {
      return NextResponse.json({ error: 'Due date cannot be in the past' }, { status: 400 });
    }
    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({ error: 'At least one question is required' }, { status: 400 });
    }
    for (const q of questions) {
      if (!q.question?.trim()) return NextResponse.json({ error: 'All questions must have text' }, { status: 400 });
      if (!q.marks || Number(q.marks) < 1) return NextResponse.json({ error: 'All questions need marks ≥ 1' }, { status: 400 });
    }

    const maxMarks = questions.reduce((sum: number, q: any) => sum + Number(q.marks), 0);

    await connectDB();
    const assignment = await Assignment.create({
      title: title.trim(),
      subject: subject.trim(),
      dueDate,
      questions: questions.map((q: any) => ({ question: q.question.trim(), marks: Number(q.marks) })),
      maxMarks,
      teacherId: user.id,
    });
    return NextResponse.json(assignment, { status: 201 });
  } catch (e) {
    console.error('[Assignments POST Error]', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
