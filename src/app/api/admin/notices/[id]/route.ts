import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Notice from '@/models/Notice';
import { getUserFromRequest, requireAdmin } from '@/lib/auth';

// PUT - Update notice (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getUserFromRequest(request);
    
    if (!user || !requireAdmin(user)) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { title, content, priority, category, isActive } = await request.json();
    const { id } = await params;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    await connectDB();
    
    const notice = await Notice.findByIdAndUpdate(
      id,
      {
        title,
        content,
        priority: priority || 'medium',
        category: category || 'general',
        isActive: isActive !== undefined ? isActive : true,
        updatedAt: new Date()
      },
      { new: true }
    ).populate('createdBy', 'name phone');

    if (!notice) {
      return NextResponse.json(
        { error: 'Notice not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'Notice updated successfully',
      notice 
    });
  } catch (error) {
    console.error('Error updating notice:', error);
    return NextResponse.json(
      { error: 'Failed to update notice' },
      { status: 500 }
    );
  }
}

// DELETE - Delete notice (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getUserFromRequest(request);
    
    if (!user || !requireAdmin(user)) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { id } = await params;

    await connectDB();
    
    const notice = await Notice.findByIdAndDelete(id);

    if (!notice) {
      return NextResponse.json(
        { error: 'Notice not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'Notice deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting notice:', error);
    return NextResponse.json(
      { error: 'Failed to delete notice' },
      { status: 500 }
    );
  }
}