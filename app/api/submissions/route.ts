import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Submission from '@/models/Submission';
import Assignment from '@/models/Assignment';
import { verifyToken } from '@/lib/jwt';
import { getAIFeedback } from '@/lib/groq';

function getUser(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  return token ? verifyToken(token) : null;
}

// GET — all submissions (student sees own, teacher sees all)
export async function GET(req: NextRequest) {
  const user = getUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const filter = user.role === 'student' ? { studentId: user.id } : {};
    const submissions = await Submission.find(filter)
      .populate('assignmentId', 'title subject maxMarks dueDate')
      .populate('studentId', 'name email')
      .sort({ createdAt: -1 });
    return NextResponse.json(submissions);
  } catch (e) {
    console.error('[Submissions GET Error]', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST — submit assignment (student only), generates AI feedback
export async function POST(req: NextRequest) {
  const user = getUser(req);
  if (!user || user.role !== 'student') {
    return NextResponse.json({ error: 'Forbidden — students only' }, { status: 403 });
  }

  try {
    const { assignmentId, content, fileUrl } = await req.json();
    if (!assignmentId || !content) {
      return NextResponse.json({ error: 'assignmentId and content are required' }, { status: 400 });
    }

    await connectDB();

    // Check if student already submitted
    const existing = await Submission.findOne({ assignmentId, studentId: user.id });
    if (existing && existing.status !== 'resubmit') {
      return NextResponse.json({ error: 'Already submitted. Wait for teacher to allow resubmission.' }, { status: 400 });
    }

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    // Get AI feedback from Groq
    const aiFeedback = await getAIFeedback(assignment.title, content);

    const submission = await Submission.create({
      assignmentId,
      content,
      fileUrl: fileUrl || undefined,
      studentId: user.id,
      aiFeedback,
      status: 'submitted',
    });

    return NextResponse.json(submission, { status: 201 });
  } catch (e) {
    console.error('[Submissions POST Error]', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
