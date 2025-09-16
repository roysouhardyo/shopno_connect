import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import OTP from '@/models/OTP';
import User from '@/models/User';
import { generateToken, isValidBangladeshiPhone, formatBangladeshiPhone } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { phone, otp, purpose, userData } = await request.json();

    // Validate input
    if (!phone || !otp || !purpose) {
      return NextResponse.json(
        { success: false, message: 'Phone number, OTP, and purpose are required' },
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

    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { success: false, message: 'OTP must be 6 digits' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find and validate OTP
    const otpRecord = await OTP.findOne({
      phone: formattedPhone,
      purpose,
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    // Check attempts
    if (otpRecord.attempts >= 3) {
      otpRecord.isUsed = true;
      await otpRecord.save();
      return NextResponse.json(
        { success: false, message: 'Too many failed attempts. Please request a new OTP.' },
        { status: 429 }
      );
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid OTP',
          attemptsLeft: 3 - otpRecord.attempts
        },
        { status: 400 }
      );
    }

    // Mark OTP as used
    otpRecord.isUsed = true;
    await otpRecord.save();

    let user;

    if (purpose === 'registration') {
      // Validate registration data
      if (!userData || !userData.name || !userData.building || !userData.flat) {
        return NextResponse.json(
          { success: false, message: 'Name, building, and flat are required for registration' },
          { status: 400 }
        );
      }

      // Check if building and flat combination is already taken
      const existingFlatUser = await User.findOne({
        building: userData.building,
        flat: userData.flat
      });

      if (existingFlatUser) {
        return NextResponse.json(
          { success: false, message: 'This flat is already registered to another user' },
          { status: 400 }
        );
      }

      // Create new user
      user = new User({
        name: userData.name.trim(),
        phone: formattedPhone,
        building: userData.building,
        flat: userData.flat,
        isVerified: true,
        role: 'user'
      });

      await user.save();
    } else if (purpose === 'login') {
      // Find existing user
      user = await User.findOne({ phone: formattedPhone });
      
      if (!user) {
        return NextResponse.json(
          { success: false, message: 'User not found' },
          { status: 404 }
        );
      }

      // Update verification status
      if (!user.isVerified) {
        user.isVerified = true;
        await user.save();
      }
    }

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      phone: user.phone,
      role: user.role
    });

    // Create response
    const response = NextResponse.json({
      success: true,
      message: purpose === 'registration' ? 'Account created successfully' : 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        building: user.building,
        flat: user.flat,
        role: user.role,
        profilePicture: user.profilePicture
      },
      token
    });

    // Set HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;

  } catch (error: any) {
    console.error('Verify OTP error:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      if (error.keyPattern?.phone) {
        return NextResponse.json(
          { success: false, message: 'Phone number already registered' },
          { status: 400 }
        );
      }
      if (error.keyPattern?.building && error.keyPattern?.flat) {
        return NextResponse.json(
          { success: false, message: 'This flat is already registered' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}