'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit2, Trash2, Calendar } from 'lucide-react';
import Image from 'next/image';
import type { Memory } from '../lib/types';
import type { Character } from '../lib/types';

interface MemoryCardProps {
  memory: Memory;
  character?: Character;
  onEdit: (memory: Memory) => void;
  onDelete: (id: string) => void;
}

export default function MemoryCard({ memory, character, onEdit, onDelete }: MemoryCardProps) {
  const [showDetail, setShowDetail] = useState(false);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  };

  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + '...';
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        onClick={() => setShowDetail(true)}
        className="bg-white/10 backdrop-blur-lg rounded-xl p-4 cursor-pointer hover:bg-white/20 transition-all duration-300 border border-white/10 hover:border-purple-500/30 group"
      >
        {/* 头部：角色和日期 */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {character && (
              <>
                <span className="text-xl">{character.emoji}</span>
                <span className="text-white font-medium text-sm">{character.name}</span>
              </>
            )}
            {!character && (
              <span className="text-white/70 text-sm">未知角色</span>
            )}
          </div>
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(memory.created_at)}</span>
          </div>
        </div>

        {/* 内容 */}
        <p className="text-gray-200 text-sm leading-relaxed mb-3">
          {truncateContent(memory.content)}
        </p>

        {/* 标签 */}
        {memory.tags && memory.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {memory.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* 操作按钮（hover时显示） */}
        <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(memory);
            }}
            className="flex-1 px-3 py-1.5 bg-white/10 rounded-lg text-gray-300 text-xs hover:bg-purple-500/30 hover:text-white transition-colors"
          >
            <Edit2 className="w-3 h-3 inline mr-1" />
            编辑
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(memory.id);
            }}
            className="flex-1 px-3 py-1.5 bg-white/10 rounded-lg text-gray-300 text-xs hover:bg-red-500/30 hover:text-red-300 transition-colors"
          >
            <Trash2 className="w-3 h-3 inline mr-1" />
            删除
          </button>
        </div>
      </motion.div>

      {/* 详情弹窗 */}
      <AnimatePresence>
        {showDetail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDetail(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-gray-900/95 to-purple-900/95 rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-white/20"
            >
              {/* 头部 */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {character && (
                    <>
                      <span className="text-2xl">{character.emoji}</span>
                      <div>
                        <h3 className="text-white font-bold">{character.name}</h3>
                        <div className="flex items-center gap-1 text-gray-400 text-xs">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(memory.created_at)} {formatTime(memory.created_at)}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <button
                  onClick={() => setShowDetail(false)}
                  className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 内容 */}
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-200 leading-relaxed text-base whitespace-pre-wrap">
                  {memory.content}
                </p>
              </div>

              {/* 图片 */}
              {memory.image_url && (
                <div className="mt-4 rounded-xl overflow-hidden relative">
                  <Image
                    src={memory.image_url}
                    alt="记忆图片"
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* 标签 */}
              {memory.tags && memory.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {memory.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* 操作按钮 */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    onEdit(memory);
                    setShowDetail(false);
                  }}
                  className="flex-1 px-4 py-2 bg-purple-500/20 text-purple-300 rounded-xl hover:bg-purple-500/30 transition-colors"
                >
                  <Edit2 className="w-4 h-4 inline mr-2" />
                  编辑
                </button>
                <button
                  onClick={() => {
                    onDelete(memory.id);
                    setShowDetail(false);
                  }}
                  className="flex-1 px-4 py-2 bg-red-500/20 text-red-300 rounded-xl hover:bg-red-500/30 transition-colors"
                >
                  <Trash2 className="w-4 h-4 inline mr-2" />
                  删除
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}