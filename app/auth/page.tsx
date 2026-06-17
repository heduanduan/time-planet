'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { login, type LoginResult } from '@/lib/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 页面加载时清除错误提示
    setError(null);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // 表单验证
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

    // 调用登录 API
    const result: LoginResult = await login(email, password);

    if (!result.success) {
      setError(result.message);
    } else {
      // 登录成功，重定向到首页
      window.location.href = '/';
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-cosmic p-4">
      {/* 背景星星效果 */}
      <div className="absolute inset-0 star-field opacity-50" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* 标题区域 */}
        {/* 返回主页按钮 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-4"
        >
          <Link
            href="/"
            className="flex items-center gap-1 text-gray-400 hover:text-[#F3E5F5] transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            返回主页
          </Link>
        </motion.div>

        {/* 标题区域 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            时空星球
          </h1>
          <p className="text-gray-400 text-sm">这是一个连接爱与思念的地方。</p>
        </motion.div>

        {/* 玻璃拟态卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="glass-card p-8"
        >
          <h2 className="text-xl font-semibold text-center mb-6 text-white">
            登录账号
          </h2>

          {/* 错误提示 */}
          <AnimatePresence>
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
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 邮箱输入框 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <label className="block text-sm text-gray-400 mb-2">邮箱地址</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cosmic-purple" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="请输入邮箱"
                  className="input-field w-full pl-12"
                />
              </div>
            </motion.div>

            {/* 密码输入框 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <label className="block text-sm text-gray-400 mb-2">密码</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cosmic-purple" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  className="input-field w-full pl-12 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cosmic-purple transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </motion.div>

            {/* 登录按钮 */}
            <motion.button
              type="submit"
              disabled={isLoading}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="primary-button w-full py-3 px-6 flex items-center justify-center gap-2 font-medium"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : (
                <>
                  登录
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* 链接区域 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="mt-6 space-y-3"
          >
            <div className="flex items-center justify-center">
              <span className="text-gray-500 text-sm">还没有账号？</span>
              <Link
                href="/auth/register"
                className="ml-2 text-cosmic-purple hover:text-cosmic-purple/80 transition-colors text-sm font-medium"
              >
                立即注册
              </Link>
            </div>
            <div className="text-center">
              <Link
                href="/auth/forgot-password"
                className="text-gray-400 hover:text-cosmic-purple transition-colors text-sm"
              >
                忘记密码？
              </Link>
            </div>
          </motion.div>

          {/* 安全提示 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            className="mt-6 pt-6 border-t border-cosmic-border"
          >
            <p className="text-xs text-gray-500 text-center">
              🔒 你的所有数据仅你可见，安全加密存储
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
