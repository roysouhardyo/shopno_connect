import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET!;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

export interface TokenPayload {
  userId: string;
  phone: string;
  role: 'user' | 'admin';
  iat?: number;
  exp?: number;
}

export function generateToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function getTokenFromRequest(request: NextRequest): string | null {
  // Check Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Check cookies
  const token = request.cookies.get('auth-token')?.value;
  return token || null;
}

export function getUserFromRequest(request: NextRequest): TokenPayload | null {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  
  return verifyToken(token);
}

// Admin middleware function
export function requireAdmin(tokenPayload: TokenPayload | null): boolean {
  return tokenPayload?.role === 'admin';
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function formatBangladeshiPhone(phone: string): string {
  // Remove any spaces, dashes, or other non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // If it starts with 88, add +
  if (cleanPhone.startsWith('88')) {
    return '+' + cleanPhone;
  }
  
  // If it starts with 01, replace with +8801
  if (cleanPhone.startsWith('01')) {
    return '+88' + cleanPhone;
  }
  
  // If it's just the 10 digits without 01 prefix, add +8801
  if (cleanPhone.length === 10 && /^1[3-9]\d{8}$/.test(cleanPhone)) {
    return '+880' + cleanPhone;
  }
  
  // Return as is if already formatted or invalid
  return phone;
}

export function isValidBangladeshiPhone(phone: string): boolean {
  const phoneRegex = /^\+8801[3-9]\d{8}$/;
  return phoneRegex.test(phone);
}
