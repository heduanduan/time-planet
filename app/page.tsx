'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Scene3D from '../components/Scene3D';
import BottomNav from '../components/BottomNav';
import AddCharacterModal, { CharacterFormData } from '../components/AddCharacterModal';
import AuthButton from '../components/AuthButton';
import { getCharacters, createCharacter } from '../lib/characters';
import type { Character } from '../lib/types';

// 预设颜色列表
const COLORS = [
  '#a855f7', // 紫色
  '#3b82f6', // 蓝色
  '#f59e0b', // 金色
  '#ec4899', // 粉色
  '#10b981', // 绿色
  '#8b5cf6', // 深紫
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCharacter, setHoveredCharacter] = useState<(Character & { color?: string }) | null>(null);

  // 加载角色列表
  useEffect(() => {
    const fetchCharacters = async () => {
      setLoading(true);
      const result = await getCharacters();
      if (result.success && result.characters) {
        setCharacters(result.characters);
      }
      setLoading(false);
    };

    fetchCharacters();
  }, []);

  // 创建新角色
  const handleCreateCharacter = async (data: CharacterFormData) => {
    const result = await createCharacter({
      name: data.name,
      emoji: data.emoji,
      relationship: data.relationship,
      personality: data.personality,
      hobbies: data.hobbies || undefined,
      notes: data.notes || undefined,
      leave_date: data.leaveDate || undefined,
    });

    if (result.success && result.character) {
      setCharacters(prev => [result.character!, ...prev]);
    }
  };

  // 处理角色点击
  const handleCharacterClick = (id: string) => {
    // 跳转到对话页面
    window.location.href = `/chat/${id}`;
  };

  // 转换角色数据格式供3D场景使用
  const sceneCharacters = characters.map((char, index) => ({
    ...char,
    color: COLORS[index % COLORS.length],
  }));

  // 处理角色双击
  const handleCharacterDoubleClick = (id: string) => {
    window.location.href = `/chat/${id}`;
  };

  // 处理角色悬停
  const handleCharacterHover = (character: (Character & { color?: string }) | null) => {
    setHoveredCharacter(character);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-cosmic-dark">
      {/* 背景星空 */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 100 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
            animate={{
              opacity: [Math.random() * 0.3 + 0.2, Math.random() * 0.8 + 0.5, Math.random() * 0.3 + 0.2],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* 星云光效 */}
      <div className="pointer-events-none absolute left-0 top-20 h-[400px] w-[400px] rounded-full opacity-20">
        <motion.div
          className="w-full h-full rounded-full"
          style={{ background: 'radial-gradient(circle, #a855f7 0%, transparent 70%)', filter: 'blur(60px)' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>
      <div className="pointer-events-none absolute right-0 top-1/3 h-[350px] w-[350px] rounded-full opacity-15">
        <motion.div
          className="w-full h-full rounded-full"
          style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)', filter: 'blur(50px)' }}
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </div>

      {/* 标题区域 */}
      <div className="absolute top-12 sm:top-16 left-1/2 -translate-x-1/2 z-20 text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-2xl sm:text-4xl font-bold text-white mb-2 sm:mb-4 drop-shadow-lg"
        >
          时空星球
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-gray-300 text-sm sm:text-lg max-w-md leading-relaxed drop-shadow-md"
        >
          这是一个连接爱与思念的地方。
          <br />
          他们从未离开，只是去往了另一个星球。
        </motion.p>
      </div>

      {/* 右上角登录/注册按钮 */}
      <AuthButton />

      {/* 角色悬停信息卡片 - 移动端隐藏 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: hoveredCharacter ? 1 : 0, y: hoveredCharacter ? 0 : 20 }}
        transition={{ duration: 0.3 }}
        className="hidden sm:block absolute top-24 right-6 z-30 w-80"
      >
        {hoveredCharacter && (
          <div className="bg-cosmic-dark/95 backdrop-blur-xl rounded-2xl p-4 border border-cosmic-purple/30 shadow-2xl shadow-cosmic-purple/20">
            {/* 头部 */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cosmic-purple to-cosmic-blue flex items-center justify-center text-2xl">
                {hoveredCharacter.emoji}
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">{hoveredCharacter.name}</h3>
                <p className="text-gray-400 text-sm">
                  {hoveredCharacter.relation || '未知关系'}
                </p>
              </div>
            </div>

            {/* 分隔线 */}
            <div className="h-px bg-cosmic-purple/30 mb-3" />

            {/* 详细信息 */}
            <div className="space-y-2 text-sm">
              {hoveredCharacter.personality && (
                <div>
                  <span className="text-cosmic-purple font-medium">性格：</span>
                  <span className="text-gray-300">{hoveredCharacter.personality}</span>
                </div>
              )}
              {hoveredCharacter.hobbies && (
                <div>
                  <span className="text-cosmic-blue font-medium">爱好：</span>
                  <span className="text-gray-300">{hoveredCharacter.hobbies}</span>
                </div>
              )}
              {hoveredCharacter.departed_at && (
                <div>
                  <span className="text-cosmic-gold font-medium">离开日期：</span>
                  <span className="text-gray-300">{hoveredCharacter.departed_at}</span>
                </div>
              )}
            </div>

            {/* 提示 */}
            <div className="mt-4 pt-3 border-t border-cosmic-purple/20">
              <p className="text-xs text-gray-500 text-center">双击进入时空对话</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* 3D场景容器 */}
      <div className="relative z-10 h-[calc(100vh-80px)]">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <motion.div
              className="text-cosmic-purple"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <span className="text-5xl">🪐</span>
            </motion.div>
          </div>
        ) : (
          <Scene3D
            characters={sceneCharacters}
            onCharacterClick={handleCharacterClick}
            onCharacterDoubleClick={handleCharacterDoubleClick}
            onCharacterHover={handleCharacterHover}
          />
        )}
      </div>

      {/* 底部导航 */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddCharacter={() => setIsModalOpen(true)}
      />

      {/* 新增分身弹窗 */}
      <AddCharacterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateCharacter}
      />
    </div>
  );
}
