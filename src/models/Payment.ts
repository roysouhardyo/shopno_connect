import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  billType: 'water' | 'electricity' | 'maintenance' | 'gas' | 'internet';
  billMonth: string;
  billYear: number;
  paymentMethod: 'rupantorpay';
  transactionId: string;
  rupantorpayPaymentId?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  receiptUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [1, 'Amount must be greater than 0']
  },
  billType: {
    type: String,
    required: [true, 'Bill type is required'],
    enum: ['water', 'electricity', 'maintenance', 'gas', 'internet']
  },
  billMonth: {
    type: String,
    required: [true, 'Bill month is required'],
    enum: ['January', 'February', 'March', 'April', 'May', 'June',
           'July', 'August', 'September', 'October', 'November', 'December']
  },
  billYear: {
    type: Number,
    required: [true, 'Bill year is required'],
    min: [2020, 'Year must be 2020 or later'],
    max: [new Date().getFullYear() + 1, 'Year cannot be more than next year']
  },
  paymentMethod: {
    type: String,
    default: 'rupantorpay',
    enum: ['rupantorpay']
  },
  transactionId: {
    type: String,
    required: [true, 'Transaction ID is required'],
    unique: true
  },
  rupantorpayPaymentId: {
    type: String,
    sparse: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  receiptUrl: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Create compound index to prevent duplicate payments for same bill
PaymentSchema.index({ userId: 1, billType: 1, billMonth: 1, billYear: 1 }, { unique: true });

export default mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);