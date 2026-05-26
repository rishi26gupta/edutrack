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
      .populate('assignmentId', 'title subject maxMarks questions')
      .populate('studentId', 'name email');
    if (!submission) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(submission);
  } catch (e) {
    console.error('[Submission GET by ID Error]', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

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
      const { grade, teacherRemarks, status } = body;

      const sub = await Submission.findById(id)
        .populate('assignmentId', 'teacherId maxMarks');
      if (!sub) return NextResponse.json({ error: 'Not found' }, { status: 404 });

      const assignmentTeacherId = String((sub.assignmentId as any)?.teacherId);
      if (assignmentTeacherId !== String(user.id)) {
        return NextResponse.json({ error: 'Forbidden — not your assignment' }, { status: 403 });
      }

      const maxMarks: number = (sub.assignmentId as any)?.maxMarks ?? 0;
      if (grade != null) {
        if (Number(grade) < 0) {
          return NextResponse.json({ error: 'Grade cannot be negative' }, { status: 400 });
        }
        if (Number(grade) > maxMarks) {
          return NextResponse.json(
            { error: `Grade cannot exceed ${maxMarks} (total marks for this assignment)` },
            { status: 400 }
          );
        }
      }

      const updated = await Submission.findByIdAndUpdate(
        id,
        { grade, teacherRemarks, status },
        { new: true, runValidators: true }
      );
      return NextResponse.json(updated);
    } else {
      const submission = await Submission.findOne({ _id: id, studentId: user.id });
      if (!submission) return NextResponse.json({ error: 'Not found or forbidden' }, { status: 404 });
      if (submission.status !== 'resubmit') {
        return NextResponse.json({ error: 'Resubmission not allowed at this time' }, { status: 400 });
      }

      const { answers, fileUrl } = body;
      const assignment = await Assignment.findById(submission.assignmentId);
      if (!assignment) return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });

      const questions =
        assignment.questions?.length > 0
          ? assignment.questions.map((q) => ({ question: q.question, marks: q.marks }))
          : [{ question: assignment.description ?? assignment.title, marks: assignment.maxMarks }];

      const content =
        (answers as { answer: string }[])
          .map((a, i) => `Q${i + 1}: ${a.answer}`)
          .join('\n\n') || ' ';

      const aiResult = await getAIFeedback(assignment.title, questions, answers, assignment.maxMarks);

      const updated = await Submission.findByIdAndUpdate(
        id,
        {
          answers,
          content,
          fileUrl,
          aiFeedback: aiResult.feedback,
          aiSuggestedGrade: aiResult.suggestedGrade,
          aiBreakdown: aiResult.breakdown,
          status: 'submitted',
        },
        { new: true }
      ).populate('assignmentId', 'title subject maxMarks questions');

      return NextResponse.json(updated);
    }
  } catch (e) {
    console.error('[Submission PUT Error]', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

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

    const submission = await Submission.findById(id).populate('assignmentId', 'teacherId');
    if (!submission) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const assignmentTeacherId = String((submission.assignmentId as any)?.teacherId);
    if (assignmentTeacherId !== String(user.id)) {
      return NextResponse.json({ error: 'Forbidden — not your assignment' }, { status: 403 });
    }

    await Submission.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (e) {
    console.error('[Submission DELETE Error]', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
