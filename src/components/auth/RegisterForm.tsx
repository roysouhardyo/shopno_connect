'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Building, Home, Shield, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Card from '../ui/Card';
import { toast } from 'react-hot-toast';

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onSwitchToLogin }) => {
  const { sendOTP, register, loading } = useAuth();
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    building: '',
    flat: ''
  });
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(0);

  // Building options (1-10)
  const buildingOptions = Array.from({ length: 10 }, (_, i) => ({
    value: `Building ${i + 1}`,
    label: `Building ${i + 1}`
  }));

  // Flat options (A1-H1 to A13-H13)
  const flatOptions = [];
  for (let letter = 'A'; letter <= 'H'; letter = String.fromCharCode(letter.charCodeAt(0) + 1)) {
    for (let number = 1; number <= 13; number++) {
      flatOptions.push({
        value: `${letter}${number}`,
        label: `${letter}${number}`
      });
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (!formData.phone.trim()) {
      toast.error('Please enter your phone number');
      return;
    }
    if (!formData.building.trim()) {
      toast.error('Please enter your building');
      return;
    }
    if (!formData.flat.trim()) {
      toast.error('Please enter your flat number');
      return;
    }

    try {
      const result = await sendOTP(formData.phone, 'registration');
      
      if (result.success) {
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
      } else {
        toast.error(result.message || 'Failed to send OTP');
      }
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
      const result = await register(formData.phone, otp, {
        name: formData.name,
        building: formData.building,
        flat: formData.flat
      });
      
      if (result.success) {
        toast.success('Registration successful!');
        onSuccess?.();
      } else {
        toast.error(result.message || 'Registration failed');
      }
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    
    try {
      const result = await sendOTP(formData.phone, 'registration');
      
      if (result.success) {
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
      } else {
        toast.error(result.message || 'Failed to resend OTP');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to resend OTP');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Join Our Community
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {step === 'details' 
            ? 'Fill in your details to get started' 
            : 'Enter the OTP sent to your phone'
          }
        </p>
      </div>

      {step === 'details' ? (
        <motion.form
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onSubmit={handleSendOTP}
          className="space-y-4"
        >
          <Input
            type="text"
            label="Full Name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            icon={User}
            fullWidth
            required
          />

          <Input
            type="tel"
            label="Phone Number"
            placeholder="01XXXXXXXXX"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            icon={Phone}
            fullWidth
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Building"
              value={formData.building}
              onChange={(value) => handleInputChange('building', value)}
              options={buildingOptions}
              placeholder="Select building"
              icon={Building}
              required
            />

            <Select
              label="Flat Number"
              value={formData.flat}
              onChange={(value) => handleInputChange('flat', value)}
              options={flatOptions}
              placeholder="Select flat"
              icon={Home}
              required
            />
          </div>
          
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
              OTP sent to <span className="font-medium">{formData.phone}</span>
            </p>
            <button
              type="button"
              onClick={() => setStep('details')}
              className="text-emerald-600 dark:text-emerald-400 text-sm hover:underline"
            >
              Change details
            </button>
          </div>

          <Input
            type="text"
            label="Enter OTP"
            placeholder="6-digit code"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            icon={Shield}
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
            Verify & Register
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
          Already have an account?{' '}
          <button 
            onClick={onSwitchToLogin}
            className="text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Login here
          </button>
        </p>
      </div>
    </Card>
  );
};

export default RegisterForm;