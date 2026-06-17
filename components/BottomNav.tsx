'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Home, BookOpen, MessageCircle, Plus } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddCharacter: () => void;
}

export default function BottomNav({ activeTab, onTabChange, onAddCharacter }: BottomNavProps) {
  const [isAddHovered, setIsAddHovered] = useState(false);
  const router = useRouter();

  const navItems = [
    { id: 'home', icon: Home, label: '星空大厅', path: '/' },
    { id: 'memory', icon: BookOpen, label: '记忆博物馆', path: '/memory' },
    { id: 'chat', icon: MessageCircle, label: '时空对话', path: '/chat' },
  ];

  const handleTabClick = (item: typeof navItems[0]) => {
    onTabChange(item.id);
    router.push(item.path);
  };

  return (
    <nav className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-1 bg-cosmic-dark/90 backdrop-blur-xl rounded-full px-1 sm:px-2 py-1.5 sm:py-2 border border-cosmic-purple/30 shadow-2xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item)}
              className={`flex flex-col items-center gap-0.5 sm:gap-1 px-3 sm:px-5 py-2 sm:py-3 rounded-full transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-cosmic-purple to-cosmic-blue text-white shadow-lg shadow-cosmic-purple/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-[10px] sm:text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
        
        {/* 新增分身按钮 */}
        <div className="relative mx-0.5 sm:mx-1">
          <button
            onClick={onAddCharacter}
            onMouseEnter={() => setIsAddHovered(true)}
            onMouseLeave={() => setIsAddHovered(false)}
            className={`relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-cosmic-gold to-cosmic-purple text-cosmic-dark font-bold text-base sm:text-lg transition-all duration-300 ${
              isAddHovered ? 'scale-110 shadow-lg shadow-cosmic-gold/50' : 'scale-100'
            }`}
            style={{
              transform: 'translateY(-6px) sm:translateY(-8px)',
              boxShadow: isAddHovered ? '0 0 30px rgba(255, 223, 0, 0.5)' : '0 0 20px rgba(255, 223, 0, 0.3)',
            }}
          >
            <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          
          {/* 悬浮提示 */}
          {isAddHovered && (
            <div className="absolute -top-8 sm:-top-10 left-1/2 -translate-x-1/2 px-2 sm:px-3 py-1 bg-cosmic-dark/95 backdrop-blur-sm rounded-lg text-white text-[10px] sm:text-xs whitespace-nowrap border border-cosmic-purple/30 shadow-lg">
              新增思念对象
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
