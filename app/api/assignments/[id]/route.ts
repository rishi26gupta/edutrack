import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Assignment from '@/models/Assignment';
import { verifyToken } from '@/lib/jwt';

function getUser(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  return token ? verifyToken(token) : null;
}

// GET single assignment
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = getUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    await connectDB();
    const assignment = await Assignment.findById(id);
    if (!assignment) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(assignment);
  } catch (e) {
    console.error('[Assignment GET by ID Error]', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// PUT — update assignment (teacher, own only)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = getUser(req);
  if (!user || user.role !== 'teacher') {
    return NextResponse.json({ error: 'Forbidden — teachers only' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    await connectDB();
    const assignment = await Assignment.findOneAndUpdate(
      { _id: id, teacherId: user.id },
      body,
      { new: true, runValidators: true }
    );
    if (!assignment) {
      return NextResponse.json({ error: 'Not found or forbidden' }, { status: 404 });
    }
    return NextResponse.json(assignment);
  } catch (e) {
    console.error('[Assignment PUT Error]', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE — delete assignment (teacher, own only)
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
    const assignment = await Assignment.findOneAndDelete({ _id: id, teacherId: user.id });
    if (!assignment) {
      return NextResponse.json({ error: 'Not found or forbidden' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (e) {
    console.error('[Assignment DELETE Error]', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
