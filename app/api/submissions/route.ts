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

// GET — submissions scoped by role
export async function GET(req: NextRequest) {
  const user = getUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();

    let filter: Record<string, any>;
    if (user.role === 'student') {
      // Student sees only their own submissions
      filter = { studentId: user.id };
    } else {
      // Teacher sees only submissions for assignments THEY created
      const ownAssignments = await Assignment.find({ teacherId: user.id }, '_id');
      filter = { assignmentId: { $in: ownAssignments.map(a => a._id) } };
    }

    const submissions = await Submission.find(filter)
      .populate('assignmentId', 'title subject maxMarks dueDate questions')
      .populate('studentId', 'name email')
      .sort({ createdAt: -1 });
    return NextResponse.json(submissions);
  } catch (e) {
    console.error('[Submissions GET Error]', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST — submit assignment (student only)
export async function POST(req: NextRequest) {
  const user = getUser(req);
  if (!user || user.role !== 'student') {
    return NextResponse.json({ error: 'Forbidden — students only' }, { status: 403 });
  }

  try {
    const { assignmentId, answers, fileUrl } = await req.json();

    if (!assignmentId || !Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json(
        { error: 'assignmentId and answers array are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if student already submitted (and not asked to resubmit)
    const existing = await Submission.findOne({ assignmentId, studentId: user.id });
    if (existing && existing.status !== 'resubmit') {
      return NextResponse.json(
        { error: 'Already submitted. Wait for teacher to allow resubmission.' },
        { status: 400 }
      );
    }

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    // Build questions list — fall back to single synthetic question if old format
    const questions =
      assignment.questions?.length > 0
        ? assignment.questions.map((q) => ({ question: q.question, marks: q.marks }))
        : [{ question: assignment.description ?? assignment.title, marks: assignment.maxMarks }];

    // Build content string (concatenation of all answers for backward compat)
    const content =
      answers.map((a: { answer: string }, i: number) => `Q${i + 1}: ${a.answer}`).join('\n\n') ||
      ' ';

    // Get AI evaluation
    const aiResult = await getAIFeedback(
      assignment.title,
      questions,
      answers,
      assignment.maxMarks
    );

    const payload = {
      assignmentId,
      studentId: user.id,
      content,
      answers,
      fileUrl: fileUrl || undefined,
      aiFeedback: aiResult.feedback,
      aiSuggestedGrade: aiResult.suggestedGrade,
      aiBreakdown: aiResult.breakdown,
      status: 'submitted' as const,
    };

    let submission;
    if (existing && existing.status === 'resubmit') {
      // Overwrite the existing resubmit record
      submission = await Submission.findByIdAndUpdate(existing._id, payload, { new: true })
        .populate('assignmentId', 'title subject maxMarks questions');
    } else {
      const created = await Submission.create(payload);
      submission = await Submission.findById(created._id)
        .populate('assignmentId', 'title subject maxMarks questions');
    }

    return NextResponse.json(submission, { status: 201 });
  } catch (e) {
    console.error('[Submissions POST Error]', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
