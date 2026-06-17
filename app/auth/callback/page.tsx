'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function CallbackPage() {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // 模拟验证处理
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2000);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-cosmic p-4">
      {/* 背景星星效果 */}
      <div className="absolute inset-0 star-field opacity-50" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 glass-card p-8 text-center max-w-sm w-full"
      >
        {/* 标题 */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-[#F3E5F5]">
            时空星球
          </h1>
        </div>

        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 border-2 border-cosmic-purple/30 border-t-cosmic-purple rounded-full mx-auto"
            />
            <p className="text-gray-400">正在验证邮箱...</p>
          </motion.div>
        ) : success ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="w-16 h-16 bg-cosmic-green/20 rounded-full flex items-center justify-center mx-auto"
            >
              <CheckCircle className="w-8 h-8 text-cosmic-green" />
            </motion.div>
            <h2 className="text-xl font-semibold text-white">邮箱验证成功</h2>
            <p className="text-gray-400 text-sm">你可以登录账号了</p>
            <Link
              href="/auth"
              className="primary-button inline-flex items-center gap-2 px-6 py-3 mt-4"
            >
              返回登录
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
              <Loader2 className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">验证失败</h2>
            <p className="text-gray-400 text-sm">链接无效或已过期</p>
            <Link
              href="/auth"
              className="primary-button inline-flex items-center gap-2 px-6 py-3 mt-4"
            >
              返回登录
            </Link>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
