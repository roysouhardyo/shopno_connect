'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Zap, Droplets, Wrench, Wifi, Calendar, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import LoginForm from '@/components/auth/LoginForm';

interface BillType {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  averageAmount: string;
  dueDate: string;
  color: string;
}

const PaymentsPage: React.FC = () => {
  const { user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const billTypes: BillType[] = [
    {
      id: 'electricity',
      name: 'Electricity Bill',
      icon: Zap,
      description: 'Monthly electricity consumption charges',
      averageAmount: 'Rs.2,500 - Rs.4,000',
      dueDate: '5th of every month',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'water',
      name: 'Water Bill',
      icon: Droplets,
      description: 'Monthly water supply and usage charges',
      averageAmount: 'Rs.800 - Rs.1,200',
      dueDate: '10th of every month',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'maintenance',
      name: 'Maintenance Fee',
      icon: Wrench,
      description: 'Monthly building maintenance and common area charges',
      averageAmount: 'Rs.3,000 - Rs.5,000',
      dueDate: '1st of every month',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'internet',
      name: 'Internet Bill',
      icon: Wifi,
      description: 'High-speed internet and cable TV charges',
      averageAmount: 'Rs.1,500 - Rs.2,500',
      dueDate: '15th of every month',
      color: 'from-purple-500 to-indigo-500'
    }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'Bank-grade security with encrypted transactions'
    },
    {
      icon: CheckCircle,
      title: 'Instant Confirmation',
      description: 'Get immediate payment confirmation and receipts'
    },
    {
      icon: Calendar,
      title: 'Payment History',
      description: 'Track all your payments and download receipts anytime'
    },
    {
      icon: AlertCircle,
      title: 'Due Date Reminders',
      description: 'Never miss a payment with automatic reminders'
    }
  ];

  const handleAuthSuccess = () => {
    setShowLoginModal(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50 dark:from-slate-900 dark:via-slate-800 dark:to-green-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-200/50 dark:border-green-700/50 backdrop-blur-sm mb-6">
              <CreditCard className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
              <span className="text-green-600 dark:text-green-400 font-semibold text-sm">
                Bill Payments
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Pay Your Bills
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
              Convenient and secure online bill payment system for all your utility bills
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="p-8 max-w-md mx-auto">
                <div className="text-center">
                  <CreditCard className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Login Required
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Please sign in to access the bill payment system and view your payment history.
                  </p>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => setShowLoginModal(true)}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  >
                    Sign In to Continue
                  </Button>
                </div>
              </Card>
            </motion.div>
          </motion.div>

          {/* Bill Types Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-16"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Available Bill Types
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Pay all your utility bills in one convenient location
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {billTypes.map((bill, index) => (
                <motion.div
                  key={bill.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                >
                  <Card hover className="h-full">
                    <div className="p-6 text-center">
                      <div className={`w-16 h-16 bg-gradient-to-r ${bill.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                        <bill.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {bill.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                        {bill.description}
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Average:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{bill.averageAmount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Due Date:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{bill.dueDate}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Why Choose Our Payment System?
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Experience the convenience and security of digital bill payments
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                >
                  <Card className="p-6 text-center h-full">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="mt-16 text-center"
          >
            <Card className="p-8 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-200/50 dark:border-green-700/50">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Ready to Get Started?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                Join hundreds of residents who have already switched to our convenient digital payment system. 
                Pay your bills anytime, anywhere with complete security and peace of mind.
              </p>
              <Button
                variant="primary"
                size="lg"
                onClick={() => setShowLoginModal(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                Sign In to Start Paying Bills
              </Button>
            </Card>
          </motion.div>
        </div>

        {/* Login Modal */}
        <Modal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          title="Sign In"
        >
          <LoginForm onSuccess={handleAuthSuccess} />
        </Modal>
      </div>
    );
  }

  // Authenticated user view would go here
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50 dark:from-slate-900 dark:via-slate-800 dark:to-green-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Payment Dashboard
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Welcome back! Your payment dashboard will be implemented here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;