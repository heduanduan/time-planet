'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, X, UserPlus } from 'lucide-react';
import { login, signup, logout, getCurrentUser } from '../lib/auth';

export default function AuthButton() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 检查登录状态
  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser();
      setIsLoggedIn(!!user);
    };
    checkAuth();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!email) {
      setError('请输入邮箱地址');
      setIsLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('请输入有效的邮箱地址');
      setIsLoading(false);
      return;
    }

    if (!password) {
      setError('请输入密码');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('密码长度至少为6位');
      setIsLoading(false);
      return;
    }

    if (isLoginMode) {
      const result = await login(email, password);
      if (!result.success) {
        setError(result.message);
      } else {
        setIsLoggedIn(true);
        setIsModalOpen(false);
        window.location.reload();
      }
    } else {
      const result = await signup(email, password);
      if (!result.success) {
        setError(result.message);
      } else {
        setError('注册成功，请检查邮箱验证链接');
        setIsLoginMode(true);
        setEmail('');
        setPassword('');
      }
    }

    setIsLoading(false);
  };

  const handleLogout = async () => {
    await logout();
    setIsLoggedIn(false);
    window.location.reload();
  };

  return (
    <>
      {/* 登录/注册按钮 */}
      <div className="absolute top-6 right-6 z-30">
        {isLoggedIn ? (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full text-white text-sm font-medium hover:bg-white/20 transition-colors"
          >
            退出登录
          </motion.button>
        ) : (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-cosmic-purple to-cosmic-blue text-white text-sm font-medium rounded-full shadow-lg shadow-cosmic-purple/30 hover:shadow-cosmic-purple/50 transition-all"
          >
            登录 / 注册
          </motion.button>
        )}
      </div>

      {/* 登录/注册弹窗 */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-cosmic-dark/95 backdrop-blur-xl border border-cosmic-purple/30 rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* 弹窗头部 */}
              <div className="p-6 border-b border-cosmic-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isLoginMode ? (
                      <div className="p-2 bg-cosmic-purple/20 rounded-lg">
                        <Mail className="w-5 h-5 text-cosmic-purple" />
                      </div>
                    ) : (
                      <div className="p-2 bg-cosmic-blue/20 rounded-lg">
                        <UserPlus className="w-5 h-5 text-cosmic-blue" />
                      </div>
                    )}
                    <h2 className="text-xl font-bold text-white">
                      {isLoginMode ? '登录账号' : '注册账号'}
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  {isLoginMode 
                    ? '欢迎回来，继续探索时空星球' 
                    : '创建账号，开始你的旅程'
                  }
                </p>
              </div>

              {/* 表单内容 */}
              <div className="p-6">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* 邮箱输入框 */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">邮箱地址</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cosmic-purple" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="请输入邮箱"
                        className="w-full px-4 py-3 pl-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* 密码输入框 */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">密码</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cosmic-purple" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="请输入密码"
                        className="w-full px-4 py-3 pl-12 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cosmic-purple transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* 提交按钮 */}
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 px-6 bg-gradient-to-r from-cosmic-purple to-cosmic-blue text-white font-medium rounded-xl flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                    ) : (
                      <>
                        {isLoginMode ? '登录' : '注册'}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </form>

                {/* 切换模式链接 */}
                <div className="mt-4 text-center">
                  <span className="text-gray-400 text-sm">
                    {isLoginMode ? '还没有账号？' : '已有账号？'}
                  </span>
                  <button
                    onClick={() => {
                      setIsLoginMode(!isLoginMode);
                      setError(null);
                    }}
                    className="ml-2 text-cosmic-purple hover:text-cosmic-purple/80 transition-colors text-sm font-medium"
                  >
                    {isLoginMode ? '立即注册' : '立即登录'}
                  </button>
                </div>

                {/* 忘记密码链接（登录模式下显示） */}
                {isLoginMode && (
                  <div className="mt-3 text-center">
                    <a
                      href="/auth/forgot-password"
                      className="text-gray-400 hover:text-cosmic-purple transition-colors text-sm"
                    >
                      忘记密码？
                    </a>
                  </div>
                )}
              </div>

              {/* 底部安全提示 */}
              <div className="px-6 py-4 bg-white/5 border-t border-cosmic-border">
                <p className="text-xs text-gray-500 text-center">
                  🔒 你的所有数据仅你可见，安全加密存储
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}