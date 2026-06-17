'use client';

import type { Character } from '../lib/types';

interface SidebarProps {
  tags: string[];
  characters: Character[];
  memoryCountByCharacter: Record<string, number>;
  monthlyCount: number;
  selectedTag: string | null;
  onTagSelect: (tag: string | null) => void;
}

export default function Sidebar({
  tags,
  characters,
  memoryCountByCharacter,
  monthlyCount,
  selectedTag,
  onTagSelect,
}: SidebarProps) {
  return (
    <div className="space-y-4">
      {/* 当月统计 */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 shadow-xl border border-white/20">
        <h3 className="text-white font-bold mb-3">本月记忆</h3>
        <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          {monthlyCount}
        </div>
        <p className="text-gray-400 text-sm mt-1">个故事</p>
      </div>

      {/* 标签云 */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 shadow-xl border border-white/20">
        <h3 className="text-white font-bold mb-3">标签云</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onTagSelect(null)}
            className={`
              px-3 py-1 rounded-full text-sm transition-all duration-300
              ${selectedTag === null
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }
            `}
          >
            全部
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => onTagSelect(tag)}
              className={`
                px-3 py-1 rounded-full text-sm transition-all duration-300
                ${selectedTag === tag
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }
              `}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* 思念对象列表 */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 shadow-xl border border-white/20">
        <h3 className="text-white font-bold mb-3">思念的人</h3>
        <div className="space-y-2">
          {characters.map((char) => (
            <div
              key={char.id}
              className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{char.emoji}</span>
                <span className="text-white text-sm">{char.name}</span>
              </div>
              <span className="text-purple-400 text-sm font-medium">
                {memoryCountByCharacter[char.id] || 0} 篇
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}