'use client';

import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export default function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
}: SkeletonProps) {
  const baseClasses = 'bg-gradient-to-r from-white/10 via-white/20 to-white/10';
  
  const variantClasses = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
    rounded: 'rounded-2xl',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: '',
    none: '',
  };

  const style = {
    width: width || '100%',
    height: height || '100%',
  };

  if (animation === 'wave') {
    return (
      <motion.div
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        style={style}
        initial={{ backgroundPosition: '200% 0' }}
        animate={{ backgroundPosition: '-200% 0' }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    );
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
    />
  );
}

// 预定义的骨架屏组件
export function CardSkeleton() {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/10 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="60%" height={16} />
          <Skeleton variant="text" width="40%" height={12} />
        </div>
      </div>
      <Skeleton variant="text" width="100%" height={14} />
      <Skeleton variant="text" width="80%" height={14} />
      <div className="flex gap-2 pt-2">
        <Skeleton variant="rounded" width={60} height={24} />
        <Skeleton variant="rounded" width={60} height={24} />
      </div>
    </div>
  );
}

export function CalendarSkeleton() {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <Skeleton variant="rectangular" width={100} height={24} />
        <div className="flex gap-2">
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton variant="circular" width={32} height={32} />
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-3">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} variant="text" width="100%" height={16} />
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 35 }).map((_, i) => (
          <Skeleton key={i} variant="rounded" width="100%" height={32} />
        ))}
      </div>
    </div>
  );
}

export function CharacterSkeleton() {
  return (
    <div className="bg-white/5 hover:bg-white/10 rounded-xl p-3 border border-transparent">
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" width={32} height={32} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="70%" height={14} />
          <Skeleton variant="text" width="40%" height={12} />
        </div>
      </div>
    </div>
  );
}

export function MessageSkeleton({ isUser = false }: { isUser?: boolean }) {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`
          max-w-[80%] p-4 rounded-2xl space-y-2
          ${isUser
            ? 'bg-gradient-to-r from-purple-500/30 to-indigo-500/30'
            : 'bg-white/10 border border-white/10'
          }
        `}
      >
        {!isUser && (
          <div className="flex items-center gap-2 mb-2">
            <Skeleton variant="circular" width={20} height={20} />
            <Skeleton variant="text" width={60} height={12} />
          </div>
        )}
        <Skeleton variant="text" width="100%" height={14} />
        <Skeleton variant="text" width="90%" height={14} />
        <Skeleton variant="text" width="70%" height={14} />
      </div>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cosmic-dark">
      <div className="text-center space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="text-6xl"
        >
          🪐
        </motion.div>
        <div className="space-y-2">
          <Skeleton variant="text" width={200} height={24} className="mx-auto" />
          <Skeleton variant="text" width={150} height={16} className="mx-auto" />
        </div>
      </div>
    </div>
  );
}