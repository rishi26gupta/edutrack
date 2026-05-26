import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { getAIFeedback } from '@/lib/groq';

// POST — standalone AI feedback regeneration
export async function POST(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { assignmentTitle, questions, answers, maxMarks } = await req.json();
    if (!assignmentTitle || !questions || !answers) {
      return NextResponse.json(
        { error: 'assignmentTitle, questions and answers are required' },
        { status: 400 }
      );
    }

    const result = await getAIFeedback(assignmentTitle, questions, answers, maxMarks ?? 100);
    return NextResponse.json(result);
  } catch (e) {
    console.error('[AI Feedback Error]', e);
    return NextResponse.json({ error: 'Failed to generate feedback' }, { status: 500 });
  }
}
