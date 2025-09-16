'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Shield, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import LoadingSpinner from '../ui/LoadingSpinner';
import { toast } from 'react-hot-toast';

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onSwitchToRegister }) => {
  const { sendOTP, login, loading } = useAuth();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone.trim()) {
      toast.error('Please enter your phone number');
      return;
    }

    try {
      await sendOTP(phone, 'login');
      setOtpSent(true);
      setStep('otp');
      setCountdown(60);
      
      // Start countdown
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      toast.success('OTP sent successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send OTP');
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp.trim()) {
      toast.error('Please enter the OTP');
      return;
    }

    try {
      const result = await login(phone, otp);
      if (result.success) {
        toast.success('Login successful!');
        onSuccess?.();
      } else {
        toast.error(result.message || 'Invalid OTP');
      }
    } catch (error: any) {
      toast.error(error.message || 'Invalid OTP');
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    
    try {
      await sendOTP(phone, 'login');
      setCountdown(60);
      
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      toast.success('OTP resent successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to resend OTP');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome Back
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {step === 'phone' 
            ? 'Enter your phone number to continue' 
            : 'Enter the OTP sent to your phone'
          }
        </p>
      </div>

      {step === 'phone' ? (
        <motion.form
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onSubmit={handleSendOTP}
          className="space-y-4"
        >
          <Input
            type="tel"
            label="Phone Number"
            placeholder="01XXXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            icon={Phone}
            fullWidth
            required
          />
          
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            icon={ArrowRight}
            iconPosition="right"
          >
            Send OTP
          </Button>
        </motion.form>
      ) : (
        <motion.form
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          onSubmit={handleVerifyOTP}
          className="space-y-4"
        >
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              OTP sent to <span className="font-medium">{phone}</span>
            </p>
            <button
              type="button"
              onClick={() => setStep('phone')}
              className="text-emerald-600 dark:text-emerald-400 text-sm hover:underline"
            >
              Change number
            </button>
          </div>

          <Input
            type="text"
            label="Enter OTP"
            placeholder="6-digit code"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            maxLength={6}
            fullWidth
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
          >
            Verify & Login
          </Button>

          <div className="text-center">
            {countdown > 0 ? (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Resend OTP in {countdown}s
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResendOTP}
                className="text-emerald-600 dark:text-emerald-400 text-sm hover:underline"
              >
                Resend OTP
              </button>
            )}
          </div>
        </motion.form>
      )}

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <button 
            onClick={onSwitchToRegister}
            className="text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Register here
          </button>
        </p>
      </div>
    </Card>
  );
};

export default LoginForm;