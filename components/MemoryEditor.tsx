'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Tag } from 'lucide-react';
import type { Memory } from '../lib/types';
import type { Character } from '../lib/types';

interface MemoryEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { content: string; tags: string[]; characterId: string }) => void;
  editMemory?: Memory | null;
  characters: Character[];
}

export default function MemoryEditor({
  isOpen,
  onClose,
  onSubmit,
  editMemory,
  characters,
}: MemoryEditorProps) {
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [selectedCharacterId, setSelectedCharacterId] = useState('');

  useEffect(() => {
    if (editMemory) {
      setContent(editMemory.content);
      setTags(editMemory.tags || []);
      setSelectedCharacterId(editMemory.character_id);
    } else {
      setContent('');
      setTags([]);
      setSelectedCharacterId(characters[0]?.id || '');
    }
  }, [editMemory, characters]);

  const handleAddTag = () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = () => {
    if (content.trim() && selectedCharacterId) {
      onSubmit({
        content: content.trim(),
        tags,
        characterId: selectedCharacterId,
      });
      handleReset();
    }
  };

  const handleReset = () => {
    setContent('');
    setTags([]);
    setSelectedCharacterId(characters[0]?.id || '');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (e.target instanceof HTMLInputElement) {
        handleAddTag();
      } else {
        handleSubmit();
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-gray-900/95 to-purple-900/95 rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-white/20"
          >
            {/* 头部 */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                {editMemory ? '编辑记忆' : '添加新记忆'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 选择角色 */}
            <div className="mb-4">
              <label className="block text-gray-400 text-sm mb-2">选择思念的人</label>
              <div className="flex gap-2 flex-wrap">
                {characters.map((char) => (
                  <button
                    key={char.id}
                    onClick={() => setSelectedCharacterId(char.id)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                      ${selectedCharacterId === char.id
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/30'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                      }
                    `}
                  >
                    <span className="text-lg">{char.emoji}</span>
                    <span>{char.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 内容输入 */}
            <div className="mb-4">
              <label className="block text-gray-400 text-sm mb-2">写下你的记忆</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="在这里记录你和TA的美好回忆..."
                className="w-full h-32 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>

            {/* 标签 */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 text-purple-400" />
                <label className="text-gray-400 text-sm">添加标签</label>
              </div>
              
              {/* 标签列表 */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full"
                    >
                      #{tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-purple-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* 添加标签输入 */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  placeholder="输入标签后按回车添加"
                  className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500"
                />
                <button
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-xl hover:bg-purple-500/30 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  handleReset();
                  onClose();
                }}
                className="flex-1 px-4 py-2 bg-white/10 text-gray-300 rounded-xl hover:bg-white/20 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSubmit}
                disabled={!content.trim() || !selectedCharacterId}
                className={`
                  flex-1 px-4 py-2 rounded-xl font-medium transition-all duration-300
                  ${content.trim() && selectedCharacterId
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                {editMemory ? '保存修改' : '保存记忆'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}