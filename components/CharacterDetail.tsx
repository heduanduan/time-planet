'use client';

import { motion } from 'framer-motion';
import { Edit2, Trash2, Calendar, Heart, Star } from 'lucide-react';
import type { Character } from '../lib/types';

interface CharacterDetailProps {
  character: Character;
  onEdit: () => void;
  onDelete: () => void;
}

export default function CharacterDetail({ character, onEdit, onDelete }: CharacterDetailProps) {
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 shadow-xl border border-white/20"
    >
      {/* 头部：头像和名字 */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cosmic-purple/30 to-cosmic-blue/30 flex items-center justify-center text-2xl border border-cosmic-purple/30">
          {character.emoji}
        </div>
        <div className="flex-1">
          <h3 className="text-white font-semibold text-lg">{character.name}</h3>
          <p className="text-gray-400 text-sm">{character.relation}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            title="编辑"
          >
            <Edit2 className="w-4 h-4 text-gray-400" />
          </button>
          <button
            onClick={onDelete}
            className="w-8 h-8 rounded-full bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center transition-colors"
            title="删除"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
          </button>
        </div>
      </div>

      {/* 详细信息 */}
      <div className="space-y-3">
        {/* 性格特点 */}
        {character.personality && (
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-lg bg-cosmic-purple/20 flex items-center justify-center flex-shrink-0">
              <Star className="w-3.5 h-3.5 text-cosmic-purple" />
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-0.5">性格特点</p>
              <p className="text-white text-sm">{character.personality}</p>
            </div>
          </div>
        )}

        {/* 爱好 */}
        {character.hobbies && (
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-lg bg-cosmic-blue/20 flex items-center justify-center flex-shrink-0">
              <Heart className="w-3.5 h-3.5 text-cosmic-blue" />
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-0.5">爱好</p>
              <p className="text-white text-sm">{character.hobbies}</p>
            </div>
          </div>
        )}

        {/* 备注 */}
        {character.notes && (
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <Heart className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-0.5">备注</p>
              <p className="text-white text-sm">{character.notes}</p>
            </div>
          </div>
        )}

        {/* 离开日期 */}
        {character.departed_at && (
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-lg bg-gray-500/20 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-0.5">离开日期</p>
              <p className="text-white text-sm">{formatDate(character.departed_at)}</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}