'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Calendar } from 'lucide-react';

import type { Character } from '../lib/types';

interface AddCharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CharacterFormData) => void;
  editCharacter?: Character | null;
}

export interface CharacterFormData {
  name: string;
  emoji: string;
  relationship: string;
  personality: string;
  hobbies: string;
  notes: string;
  leaveDate: string;
}

// 预设表情选项
const emojiOptions = [
  '👵', '👴', '👩', '👨', '👧', '👦', '👪', '🐕', '🐈', '🐱',
  '🦋', '🌸', '🌺', '🌟', '⭐', '🌈', '🦄', '🐬', '🦋', '🦢'
];

// 关系选项
const relationshipOptions = [
  '外婆', '外公', '奶奶', '爷爷', '妈妈', '爸爸',
  '姐姐', '哥哥', '妹妹', '弟弟', '朋友', '宠物',
  '老师', '其他亲人', '其他'
];

export default function AddCharacterModal({ isOpen, onClose, onSubmit, editCharacter }: AddCharacterModalProps) {
  const [formData, setFormData] = useState<CharacterFormData>(() => {
    if (editCharacter) {
      return {
        name: editCharacter.name,
        emoji: editCharacter.emoji,
        relationship: editCharacter.relation || '',
        personality: editCharacter.personality || '',
        hobbies: editCharacter.hobbies || '',
        notes: editCharacter.notes || '',
        leaveDate: editCharacter.departed_at || '',
      };
    }
    return {
      name: '',
      emoji: '👵',
      relationship: '',
      personality: '',
      hobbies: '',
      notes: '',
      leaveDate: '',
    };
  });

  useEffect(() => {
    if (editCharacter) {
      setFormData({
        name: editCharacter.name,
        emoji: editCharacter.emoji,
        relationship: editCharacter.relation || '',
        personality: editCharacter.personality || '',
        hobbies: editCharacter.hobbies || '',
        notes: editCharacter.notes || '',
        leaveDate: editCharacter.departed_at || '',
      });
    } else {
      setFormData({
        name: '',
        emoji: '👵',
        relationship: '',
        personality: '',
        hobbies: '',
        notes: '',
        leaveDate: '',
      });
    }
  }, [editCharacter, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 表单验证
    if (!formData.name.trim()) {
      alert('请输入称呼');
      return;
    }
    if (!formData.relationship) {
      alert('请选择关系');
      return;
    }
    if (!formData.personality.trim()) {
      alert('请描述性格特点');
      return;
    }

    onSubmit(formData);
    setFormData({
      name: '',
      emoji: '👵',
      relationship: '',
      personality: '',
      hobbies: '',
      notes: '',
      leaveDate: '',
    });
    onClose();
  };

  const handleEmojiSelect = (emoji: string) => {
    setFormData(prev => ({ ...prev, emoji }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* 弹窗内容 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-2 sm:top-4 bottom-2 sm:bottom-4 w-full max-w-md z-50"
            style={{ transform: 'translateX(-50%)' }}
          >
            <div className="h-full max-h-[calc(100vh-1rem)] sm:max-h-[calc(100vh-2rem)] overflow-y-auto bg-cosmic-deep/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-cosmic-purple/30 shadow-2xl shadow-cosmic-purple/20">
              {/* 头部 */}
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-cosmic-purple to-cosmic-blue flex items-center justify-center">
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-white">{editCharacter ? '编辑思念对象' : '新增思念对象'}</h3>
                    <p className="text-[10px] sm:text-xs text-gray-400">{editCharacter ? '修改分身信息' : '创建一个新的分身'}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                {/* 表情选择 */}
                <div>
                  <label className="block text-xs sm:text-sm text-gray-400 mb-2">选择头像</label>
                  <div className="grid grid-cols-8 sm:grid-cols-10 gap-1.5 sm:gap-2">
                    {emojiOptions.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => handleEmojiSelect(emoji)}
                        className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-lg sm:text-xl transition-all ${
                          formData.emoji === emoji
                            ? 'bg-cosmic-purple/30 ring-2 ring-cosmic-purple scale-110'
                            : 'bg-white/5 hover:bg-white/10 hover:scale-105'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 称呼输入 */}
                <div>
                  <label className="block text-xs sm:text-sm text-gray-400 mb-2">称呼</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="例如：外婆、小狗布丁"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/5 border border-cosmic-purple/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cosmic-purple/60 focus:ring-1 focus:ring-cosmic-purple/60 transition-all text-sm sm:text-base"
                    maxLength={10}
                  />
                </div>

                {/* 关系选择 */}
                <div>
                  <label className="block text-xs sm:text-sm text-gray-400 mb-2">关系</label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 sm:gap-2">
                    {relationshipOptions.map((rel) => (
                      <button
                        key={rel}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, relationship: rel }))}
                        className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm transition-all ${
                          formData.relationship === rel
                            ? 'bg-cosmic-purple text-white'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {rel}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 性格描述 */}
                <div>
                  <label className="block text-xs sm:text-sm text-gray-400 mb-2">性格特点</label>
                  <textarea
                    value={formData.personality}
                    onChange={(e) => setFormData(prev => ({ ...prev, personality: e.target.value }))}
                    placeholder="描述一下Ta的性格特点，让对话更真实..."
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/5 border border-cosmic-purple/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cosmic-purple/60 focus:ring-1 focus:ring-cosmic-purple/60 transition-all resize-none text-sm sm:text-base"
                    rows={2}
                    maxLength={100}
                  />
                </div>

                {/* 爱好 */}
                <div>
                  <label className="block text-xs sm:text-sm text-gray-400 mb-2">爱好</label>
                  <textarea
                    value={formData.hobbies}
                    onChange={(e) => setFormData(prev => ({ ...prev, hobbies: e.target.value }))}
                    placeholder="Ta喜欢做什么？比如：养花、下棋、听音乐..."
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/5 border border-cosmic-purple/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cosmic-purple/60 focus:ring-1 focus:ring-cosmic-purple/60 transition-all resize-none text-sm sm:text-base"
                    rows={2}
                    maxLength={100}
                  />
                </div>

                {/* 备注 */}
                <div>
                  <label className="block text-xs sm:text-sm text-gray-400 mb-2">备注</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="其他想要记录的信息..."
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/5 border border-cosmic-purple/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cosmic-purple/60 focus:ring-1 focus:ring-cosmic-purple/60 transition-all resize-none text-sm sm:text-base"
                    rows={2}
                    maxLength={100}
                  />
                </div>

                {/* 离开日期（可选） */}
                <div>
                  <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-400 mb-2">
                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    离开日期（可选）
                  </label>
                  <input
                    type="date"
                    value={formData.leaveDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, leaveDate: e.target.value }))}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/5 border border-cosmic-purple/30 rounded-xl text-white focus:outline-none focus:border-cosmic-purple/60 focus:ring-1 focus:ring-cosmic-purple/60 transition-all text-sm sm:text-base [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert(1)"
                  />
                </div>

                {/* 提交按钮 */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-cosmic-purple to-cosmic-blue text-white font-medium rounded-xl shadow-lg shadow-cosmic-purple/30 hover:shadow-cosmic-purple/50 transition-all text-sm sm:text-base"
                >
                  {editCharacter ? '保存修改' : '创建分身'}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
