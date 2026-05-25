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
    const { assignmentTitle, content } = await req.json();
    if (!assignmentTitle || !content) {
      return NextResponse.json({ error: 'assignmentTitle and content are required' }, { status: 400 });
    }

    const aiFeedback = await getAIFeedback(assignmentTitle, content);
    return NextResponse.json({ aiFeedback });
  } catch (e) {
    console.error('[AI Feedback Error]', e);
    return NextResponse.json({ error: 'Failed to generate AI feedback' }, { status: 500 });
  }
}
