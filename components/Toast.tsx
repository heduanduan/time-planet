'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onClose: (id: string) => void;
}

function ToastItem({ toast, onClose }: ToastProps) {
  useEffect(() => {
    if (toast.duration !== 0) {
      const timer = setTimeout(() => {
        onClose(toast.id);
      }, toast.duration || 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-400" />,
    error: <AlertCircle className="w-5 h-5 text-red-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
  };

  const bgColors = {
    success: 'bg-green-500/10 border-green-500/30',
    error: 'bg-red-500/10 border-red-500/30',
    info: 'bg-blue-500/10 border-blue-500/30',
    warning: 'bg-yellow-500/10 border-yellow-500/30',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, y: 0 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, x: 100, y: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className={`
        relative flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-xl
        ${bgColors[toast.type]}
      `}
    >
      {icons[toast.type]}
      <p className="flex-1 text-sm text-white">{toast.message}</p>
      <button
        onClick={() => onClose(toast.id)}
        className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onClose: (id: string) => void;
}

export default function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={onClose} />
        ))}
      </AnimatePresence>
    </div>
  );
}

// Toast Hook
interface UseToastReturn {
  toasts: Toast[];
  addToast: (type: ToastType, message: string, duration?: number) => void;
  removeToast: (id: string) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
}

export function useToast(): UseToastReturn {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (type: ToastType, message: string, duration?: number) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, type, message, duration }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const success = (message: string, duration?: number) => addToast('success', message, duration);
  const error = (message: string, duration?: number) => addToast('error', message, duration);
  const info = (message: string, duration?: number) => addToast('info', message, duration);
  const warning = (message: string, duration?: number) => addToast('warning', message, duration);

  return { toasts, addToast, removeToast, success, error, info, warning };
}

// 确认对话框组件
interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = '确认',
  cancelText = '取消',
  type = 'info',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const typeStyles = {
    danger: {
      confirmBg: 'bg-red-500 hover:bg-red-600',
      icon: <AlertCircle className="w-12 h-12 text-red-400" />,
    },
    warning: {
      confirmBg: 'bg-yellow-500 hover:bg-yellow-600',
      icon: <AlertTriangle className="w-12 h-12 text-yellow-400" />,
    },
    info: {
      confirmBg: 'bg-blue-500 hover:bg-blue-600',
      icon: <Info className="w-12 h-12 text-blue-400" />,
    },
  };

  const style = typeStyles[type];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-cosmic-deep/95 backdrop-blur-xl rounded-2xl p-6 max-w-md w-full border border-cosmic-purple/30 shadow-2xl"
      >
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">{style.icon}</div>
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-gray-300">{message}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2 text-white rounded-xl transition-colors ${style.confirmBg}`}
          >
            {confirmText}
          </button>
        </div>
      </motion.div>
    </div>
  );
}