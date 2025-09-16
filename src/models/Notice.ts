import mongoose, { Document, Schema } from 'mongoose';

export interface INotice extends Document {
  title: string;
  content: string;
  category: 'announcement' | 'maintenance' | 'emergency' | 'event' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  authorId: mongoose.Types.ObjectId;
  isActive: boolean;
  expiryDate?: Date;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const NoticeSchema = new Schema<INotice>({
  title: {
    type: String,
    required: [true, 'Notice title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Notice content is required'],
    maxlength: [2000, 'Content cannot exceed 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['announcement', 'maintenance', 'emergency', 'event', 'general']
  },
  priority: {
    type: String,
    required: [true, 'Priority is required'],
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  authorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author ID is required']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  expiryDate: {
    type: Date,
    default: null
  },
  attachments: [{
    type: String
  }]
}, {
  timestamps: true
});

// Index for efficient querying
NoticeSchema.index({ isActive: 1, priority: -1, createdAt: -1 });
NoticeSchema.index({ category: 1, createdAt: -1 });

export default mongoose.models.Notice || mongoose.model<INotice>('Notice', NoticeSchema);