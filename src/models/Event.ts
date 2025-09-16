import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  eventDate: Date;
  endDate?: Date;
  location: string;
  category: 'cultural' | 'sports' | 'meeting' | 'celebration' | 'maintenance' | 'other';
  organizer: string;
  maxParticipants?: number;
  currentParticipants: number;
  isPublic: boolean;
  imageUrl?: string;
  authorId: mongoose.Types.ObjectId;
  participants: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  eventDate: {
    type: Date,
    required: [true, 'Event date is required'],
    validate: {
      validator: function(date: Date) {
        return date > new Date();
      },
      message: 'Event date must be in the future'
    }
  },
  endDate: {
    type: Date,
    validate: {
      validator: function(this: IEvent, endDate: Date) {
        return !endDate || endDate > this.eventDate;
      },
      message: 'End date must be after event date'
    }
  },
  location: {
    type: String,
    required: [true, 'Event location is required'],
    maxlength: [200, 'Location cannot exceed 200 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['cultural', 'sports', 'meeting', 'celebration', 'maintenance', 'other']
  },
  organizer: {
    type: String,
    required: [true, 'Organizer name is required'],
    maxlength: [100, 'Organizer name cannot exceed 100 characters']
  },
  maxParticipants: {
    type: Number,
    min: [1, 'Maximum participants must be at least 1']
  },
  currentParticipants: {
    type: Number,
    default: 0,
    min: [0, 'Current participants cannot be negative']
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  imageUrl: {
    type: String,
    default: ''
  },
  authorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author ID is required']
  },
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Index for efficient querying
EventSchema.index({ eventDate: 1, isPublic: 1 });
EventSchema.index({ category: 1, eventDate: 1 });

export default mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);