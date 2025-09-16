import mongoose, { Document, Schema } from 'mongoose';

export interface IOTP extends Document {
  phone: string;
  otp: string;
  purpose: 'login' | 'registration' | 'password_reset';
  attempts: number;
  isUsed: boolean;
  expiresAt: Date;
  createdAt: Date;
}

const OTPSchema = new Schema<IOTP>({
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^\+8801[3-9]\d{8}$/, 'Please enter a valid Bangladeshi phone number']
  },
  otp: {
    type: String,
    required: [true, 'OTP is required'],
    length: [6, 'OTP must be 6 digits']
  },
  purpose: {
    type: String,
    required: [true, 'OTP purpose is required'],
    enum: ['login', 'registration', 'password_reset']
  },
  attempts: {
    type: Number,
    default: 0,
    max: [3, 'Maximum 3 attempts allowed']
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now
  }
}, {
  timestamps: true
});

// Index for efficient querying and automatic cleanup
OTPSchema.index({ phone: 1, purpose: 1 });
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Auto-delete expired documents

// Prevent multiple active OTPs for same phone and purpose
OTPSchema.index({ phone: 1, purpose: 1, isUsed: 1 }, { 
  unique: true, 
  partialFilterExpression: { isUsed: false } 
});

export default mongoose.models.OTP || mongoose.model<IOTP>('OTP', OTPSchema);