import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  phone: string;
  building: string;
  flat: string;
  profilePicture?: string;
  role: 'user' | 'admin';
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    match: [/^\+8801[3-9]\d{8}$/, 'Please enter a valid Bangladeshi phone number']
  },
  building: {
    type: String,
    required: [true, 'Building number is required'],
    enum: ['Building 1', 'Building 2', 'Building 3', 'Building 4', 'Building 5', 
           'Building 6', 'Building 7', 'Building 8', 'Building 9', 'Building 10']
  },
  flat: {
    type: String,
    required: [true, 'Flat number is required'],
    match: [/^[A-H](1[0-3]|[1-9])$/, 'Please enter a valid flat number (A1-H13)']
  },
  profilePicture: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Create compound index for building and flat to ensure uniqueness
UserSchema.index({ building: 1, flat: 1 }, { unique: true });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);