'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Home, 
  Bell, 
  Calendar, 
  Image, 
  CreditCard, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Sun, 
  Moon,
  User,
  Shield
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Modal from '../ui/Modal';
import RegisterForm from '../auth/RegisterForm';
import LoginForm from '../auth/LoginForm';

const Header = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const router = useRouter();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Notices', href: '/notices', icon: Bell },
    { name: 'Events', href: '/events', icon: Calendar },
    { name: 'Gallery', href: '/gallery', icon: Image },
    { name: 'Payments', href: '/payments', icon: CreditCard },
  ];

  const handleNavigation = (href: string) => {
    router.push(href);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    router.push('/');
  };

  const handleAuthSuccess = () => {
    setShowRegisterModal(false);
    setShowLoginModal(false);
  };

  const handleSwitchToLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  const handleSwitchToRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  return (
    <>
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-b border-white/20 dark:border-slate-700/50 shadow-lg"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-indigo-500/5"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-3 cursor-pointer"
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">SC</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                  Shopno Connect
                </span>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Community Portal
                </div>
              </div>
            </motion.div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            {navigation.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={item.href}>
                  <Button
                    variant="ghost"
                    size="md"
                    icon={item.icon}
                    className="relative group px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-all duration-300"
                  >
                    <span className="relative z-10">{item.name}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Button>
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="sm"
                icon={theme === 'dark' ? Sun : Moon}
                onClick={toggleTheme}
                className="relative p-3 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 bg-gradient-to-r from-transparent to-transparent hover:from-emerald-500/10 hover:to-teal-500/10 rounded-xl transition-all duration-300"
              >
                <span className="sr-only">Toggle theme</span>
              </Button>
            </motion.div>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-3 text-gray-600 dark:text-gray-300 p-2 rounded-xl hover:bg-gradient-to-r hover:from-emerald-500/10 hover:to-teal-500/10 transition-all duration-300"
                  >
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
                        {user.profilePicture ? (
                          <img
                            src={user.profilePicture}
                            alt={user.name}
                            className="w-10 h-10 rounded-xl object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-white dark:border-slate-900"></div>
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Online</div>
                    </div>
                    {user.role === 'admin' && (
                      <Badge variant="info" size="sm" className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0">
                        Admin
                      </Badge>
                    )}
                  </Button>
                </motion.div>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute right-0 mt-3 w-64 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 py-2 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5"></div>
                    <div className="relative px-4 py-3 border-b border-gray-200/50 dark:border-gray-700/50">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user.phone}
                      </p>
                    </div>
                    
                    <div className="relative py-1">
                      {user.role === 'admin' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Shield}
                          onClick={() => {
                            router.push('/admin');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full justify-start px-4 py-3 text-indigo-600 dark:text-indigo-400 hover:bg-gradient-to-r hover:from-indigo-500/10 hover:to-purple-500/10 transition-all duration-200"
                        >
                          Admin Dashboard
                        </Button>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Settings}
                        className="w-full justify-start px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-emerald-500/10 hover:to-teal-500/10 transition-all duration-200"
                      >
                        Settings & Privacy
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={LogOut}
                        onClick={handleLogout}
                        className="w-full justify-start px-4 py-3 text-red-600 dark:text-red-400 hover:bg-gradient-to-r hover:from-red-500/10 hover:to-pink-500/10 transition-all duration-200"
                      >
                        Sign Out
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="primary" 
                  size="md"
                  onClick={() => setShowRegisterModal(true)}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Get Started
                </Button>
              </motion.div>
            )}

            {/* Mobile Menu Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="lg:hidden"
            >
              <Button
                variant="ghost"
                size="sm"
                icon={isMobileMenuOpen ? X : Menu}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-3 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gradient-to-r hover:from-emerald-500/10 hover:to-teal-500/10 rounded-xl transition-all duration-300"
              >
                <span className="sr-only">Toggle mobile menu</span>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="lg:hidden border-t border-white/20 dark:border-slate-700/50 py-6 bg-gradient-to-b from-white/50 to-transparent dark:from-slate-900/50"
            >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-indigo-500/5"></div>
            <nav className="relative flex flex-col space-y-2 px-2">
              {navigation.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Button
                    variant="ghost"
                    size="md"
                    icon={item.icon}
                    onClick={() => handleNavigation(item.href)}
                    className="w-full justify-start text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gradient-to-r hover:from-emerald-500/10 hover:to-teal-500/10 rounded-xl py-3 px-4 font-medium transition-all duration-300"
                  >
                    {item.name}
                  </Button>
                </motion.div>
              ))}
              
              {!user && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: navigation.length * 0.1 }}
                  className="pt-4 border-t border-white/20 dark:border-slate-700/50 mt-4"
                >
                  <Button 
                    variant="primary" 
                    size="md"
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium py-3 rounded-xl shadow-lg transition-all duration-300"
                  >
                    Get Started
                  </Button>
                </motion.div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </motion.header>

    {/* Registration Modal */}
    <Modal
      isOpen={showRegisterModal}
      onClose={() => setShowRegisterModal(false)}
      title="Create Account"
      showCloseButton={true}
    >
      <RegisterForm 
        onSuccess={handleAuthSuccess} 
        onSwitchToLogin={handleSwitchToLogin}
      />
    </Modal>

    {/* Login Modal */}
    <Modal
      isOpen={showLoginModal}
      onClose={() => setShowLoginModal(false)}
      title="Sign In"
      showCloseButton={true}
    >
      <LoginForm 
        onSuccess={handleAuthSuccess} 
        onSwitchToRegister={handleSwitchToRegister}
      />
    </Modal>
  </>
  );
};

export default Header;