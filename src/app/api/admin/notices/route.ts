import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Notice from '@/models/Notice';
import { getUserFromRequest, requireAdmin } from '@/lib/auth';

// GET - Get all notices for admin management
export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    
    if (!user || !requireAdmin(user)) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    await connectDB();
    const notices = await Notice.find({})
      .populate('createdBy', 'name phone')
      .sort({ createdAt: -1 });

    return NextResponse.json({ notices });
  } catch (error) {
    console.error('Error fetching notices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notices' },
      { status: 500 }
    );
  }
}

// POST - Create new notice (admin only)
export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    
    if (!user || !requireAdmin(user)) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { title, content, priority, category } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    await connectDB();
    
    const notice = new Notice({
      title,
      content,
      priority: priority || 'medium',
      category: category || 'general',
      createdBy: user.userId,
      isActive: true
    });

    await notice.save();
    await notice.populate('createdBy', 'name phone');

    return NextResponse.json({ 
      message: 'Notice created successfully',
      notice 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating notice:', error);
    return NextResponse.json(
      { error: 'Failed to create notice' },
      { status: 500 }
    );
  }
}