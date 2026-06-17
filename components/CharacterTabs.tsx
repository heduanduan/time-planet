'use client';

import type { Character } from '../lib/types';

interface CharacterTabsProps {
  characters: Character[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export default function CharacterTabs({ characters, selectedId, onSelect }: CharacterTabsProps) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 shadow-xl border border-white/20">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => onSelect(null)}
          className={`
            flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
            ${selectedId === null
              ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/30'
              : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
            }
          `}
        >
          全部
        </button>
        {characters.map((char) => (
          <button
            key={char.id}
            onClick={() => onSelect(char.id)}
            className={`
              flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
              ${selectedId === char.id
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
  );
}