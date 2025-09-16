import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import OTP from '@/models/OTP';
import User from '@/models/User';
import { sendOTP } from '@/lib/sms';
import { generateOTP, isValidBangladeshiPhone, formatBangladeshiPhone } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { phone, purpose } = await request.json();

    // Validate input
    if (!phone || !purpose) {
      return NextResponse.json(
        { success: false, message: 'Phone number and purpose are required' },
        { status: 400 }
      );
    }

    // Format phone number to standard format
    const formattedPhone = formatBangladeshiPhone(phone);

    if (!isValidBangladeshiPhone(formattedPhone)) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid Bangladeshi phone number' },
        { status: 400 }
      );
    }

    if (!['login', 'registration'].includes(purpose)) {
      return NextResponse.json(
        { success: false, message: 'Invalid purpose' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user exists
    const existingUser = await User.findOne({ phone: formattedPhone });

    if (purpose === 'registration' && existingUser) {
      return NextResponse.json(
        { success: false, message: 'User already exists with this phone number' },
        { status: 400 }
      );
    }

    if (purpose === 'login' && !existingUser) {
      return NextResponse.json(
        { success: false, message: 'No account found with this phone number' },
        { status: 404 }
      );
    }

    // Check for existing active OTP
    const existingOTP = await OTP.findOne({
      phone: formattedPhone,
      purpose,
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });

    if (existingOTP) {
      // Check if we can resend (after 1 minute)
      const timeSinceLastOTP = Date.now() - existingOTP.createdAt.getTime();
      if (timeSinceLastOTP < 60000) { // 1 minute
        return NextResponse.json(
          { 
            success: false, 
            message: 'Please wait before requesting another OTP',
            retryAfter: Math.ceil((60000 - timeSinceLastOTP) / 1000)
          },
          { status: 429 }
        );
      }

      // Mark existing OTP as used
      existingOTP.isUsed = true;
      await existingOTP.save();
    }

    // Generate new OTP
    const otp = generateOTP();

    // Save OTP to database
    const newOTP = new OTP({
      phone: formattedPhone,
      otp,
      purpose,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    });

    await newOTP.save();

    // Send OTP via SMS
    const smsResult = await sendOTP(formattedPhone, otp);

    if (!smsResult.success) {
      // If SMS fails, mark OTP as used to prevent abuse
      newOTP.isUsed = true;
      await newOTP.save();

      return NextResponse.json(
        { success: false, message: 'Failed to send OTP. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      expiresIn: 600 // 10 minutes in seconds
    });

  } catch (error: any) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}