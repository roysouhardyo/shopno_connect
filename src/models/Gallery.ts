import mongoose, { Document, Schema } from 'mongoose';

export interface IGallery extends Document {
  title: string;
  description?: string;
  imageUrl: string;
  category: 'events' | 'facilities' | 'achievements' | 'community' | 'maintenance' | 'other';
  tags: string[];
  uploadedBy: mongoose.Types.ObjectId;
  isPublic: boolean;
  likes: mongoose.Types.ObjectId[];
  likesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const GallerySchema = new Schema<IGallery>({
  title: {
    type: String,
    required: [true, 'Image title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: ''
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['events', 'facilities', 'achievements', 'community', 'maintenance', 'other']
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Uploader ID is required']
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  likesCount: {
    type: Number,
    default: 0,
    min: [0, 'Likes count cannot be negative']
  }
}, {
  timestamps: true
});

// Index for efficient querying
GallerySchema.index({ isPublic: 1, createdAt: -1 });
GallerySchema.index({ category: 1, createdAt: -1 });
GallerySchema.index({ tags: 1 });

// Update likes count when likes array changes
GallerySchema.pre('save', function(next) {
  this.likesCount = this.likes.length;
  next();
});

export default mongoose.models.Gallery || mongoose.model<IGallery>('Gallery', GallerySchema);