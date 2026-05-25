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

// GET single submission
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = getUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    await connectDB();
    const submission = await Submission.findById(id)
      .populate('assignmentId', 'title subject maxMarks')
      .populate('studentId', 'name email');
    if (!submission) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(submission);
  } catch (e) {
    console.error('[Submission GET by ID Error]', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// PUT — teacher grades OR student resubmits
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = getUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json();
    await connectDB();

    if (user.role === 'teacher') {
      // Teacher grades the submission
      const { grade, teacherRemarks, status } = body;
      const submission = await Submission.findByIdAndUpdate(
        id,
        { grade, teacherRemarks, status },
        { new: true, runValidators: true }
      );
      if (!submission) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      return NextResponse.json(submission);
    } else {
      // Student resubmits — only allowed if status is 'resubmit'
      const submission = await Submission.findOne({ _id: id, studentId: user.id });
      if (!submission) return NextResponse.json({ error: 'Not found or forbidden' }, { status: 404 });
      if (submission.status !== 'resubmit') {
        return NextResponse.json({ error: 'Resubmission not allowed at this time' }, { status: 400 });
      }

      const { content, fileUrl } = body;
      const assignment = await Assignment.findById(submission.assignmentId);
      const aiFeedback = await getAIFeedback(assignment!.title, content);

      const updated = await Submission.findByIdAndUpdate(
        id,
        { content, fileUrl, aiFeedback, status: 'submitted' },
        { new: true }
      );
      return NextResponse.json(updated);
    }
  } catch (e) {
    console.error('[Submission PUT Error]', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE — teacher only
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = getUser(req);
  if (!user || user.role !== 'teacher') {
    return NextResponse.json({ error: 'Forbidden — teachers only' }, { status: 403 });
  }

  try {
    const { id } = await params;
    await connectDB();
    const submission = await Submission.findByIdAndDelete(id);
    if (!submission) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (e) {
    console.error('[Submission DELETE Error]', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
