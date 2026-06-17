'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, Sparkles, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { resetPassword, type ResetResult } from '@/lib/auth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
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

    // 调用密码重置 API
    const result: ResetResult = await resetPassword(email);

    if (!result.success) {
      setError(result.message);
    } else {
      setSuccess(true);
    }

    setIsLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-cosmic p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 text-center max-w-sm w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="w-16 h-16 bg-cosmic-green/20 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle className="w-8 h-8 text-cosmic-green" />
          </motion.div>
          <h2 className="text-xl font-semibold text-white mb-2">重置链接已发送</h2>
          <p className="text-gray-400 text-sm mb-6">
            请检查邮箱中的链接以重置密码
          </p>
          <Link
            href="/auth"
            className="primary-button inline-flex items-center gap-2 px-6 py-3"
          >
            <ArrowLeft className="w-4 h-4" />
            返回登录
          </Link>
        </motion.div>
      </div>
    );
  }

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
        {/* 返回按钮 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="mb-6"
        >
          <Link
            href="/auth"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">返回登录</span>
          </Link>
        </motion.div>

        {/* 标题区域 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-white">
              时空星球
            </h1>
          </div>
          <p className="text-gray-400 text-sm">这是一个连接爱与思念的地方。</p>
        </motion.div>

        {/* 玻璃拟态卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="glass-card p-8"
        >
          <h2 className="text-xl font-semibold text-center mb-2 text-white">
            忘记密码
          </h2>
          <p className="text-gray-400 text-sm text-center mb-6">
            输入你的邮箱地址，我们将发送密码重置链接
          </p>

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
              transition={{ delay: 0.35, duration: 0.4 }}
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

            {/* 发送按钮 */}
            <motion.button
              type="submit"
              disabled={isLoading}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="primary-button w-full py-3 px-6 font-medium"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mx-auto"
                />
              ) : (
                '发送重置链接'
              )}
            </motion.button>
          </form>

          {/* 安全提示 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65, duration: 0.4 }}
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
