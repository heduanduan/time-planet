'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import MemoryCalendar from '../../components/MemoryCalendar';
import CharacterTabs from '../../components/CharacterTabs';
import CharacterDetail from '../../components/CharacterDetail';
import MemoryCard from '../../components/MemoryCard';
import MemoryEditor from '../../components/MemoryEditor';
import AddCharacterModal from '../../components/AddCharacterModal';
import Sidebar from '../../components/Sidebar';
import BottomNav from '../../components/BottomNav';
import { CardSkeleton, CalendarSkeleton, CharacterSkeleton } from '../../components/Skeleton';
import { getAllMemories, createMemory, updateMemory, deleteMemory, getTags } from '../../lib/memories';
import { getCharacters, updateCharacter, deleteCharacter } from '../../lib/characters';
import type { CharacterFormData } from '../../components/AddCharacterModal';
import type { Memory } from '../../lib/types';
import type { Character } from '../../lib/types';

export default function MemoryPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [memories, setMemories] = useState<Memory[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 筛选状态
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  
  // 编辑器状态
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  
  // 角色编辑状态
  const [isCharacterEditOpen, setIsCharacterEditOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // 加载数据
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      const [memoriesResult, charactersResult, tagsResult] = await Promise.all([
        getAllMemories(),
        getCharacters(),
        getTags(),
      ]);

      if (memoriesResult.success && memoriesResult.memories) {
        setMemories(memoriesResult.memories);
      }
      
      if (charactersResult.success && charactersResult.characters) {
        setCharacters(charactersResult.characters);
      }
      
      if (tagsResult.success && tagsResult.tags) {
        setTags(tagsResult.tags);
      }
      
      setLoading(false);
    };

    fetchData();
  }, []);

  // 获取高亮日期
  const highlightedDates = useMemo(() => {
    return memories
      .filter((m) => {
        const date = new Date(m.created_at);
        return date.getFullYear() === year && date.getMonth() === month;
      })
      .map((m) => {
        const date = new Date(m.created_at);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      });
  }, [memories, year, month]);

  // 筛选记忆
  const filteredMemories = useMemo(() => {
    let result = [...memories];

    // 按角色筛选
    if (selectedCharacterId) {
      result = result.filter((m) => m.character_id === selectedCharacterId);
    }

    // 按标签筛选
    if (selectedTag) {
      result = result.filter((m) => m.tags && m.tags.includes(selectedTag));
    }

    // 按日期筛选
    if (selectedDate) {
      result = result.filter((m) => {
        const date = new Date(m.created_at);
        const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        return dateStr === selectedDate;
      });
    }

    // 按创建时间排序
    result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return result;
  }, [memories, selectedCharacterId, selectedTag, selectedDate]);

  // 计算各角色的记忆数量
  const memoryCountByCharacter = useMemo(() => {
    const count: Record<string, number> = {};
    memories.forEach((m) => {
      count[m.character_id] = (count[m.character_id] || 0) + 1;
    });
    return count;
  }, [memories]);

  // 计算当月记忆数量
  const monthlyCount = useMemo(() => {
    return memories.filter((m) => {
      const date = new Date(m.created_at);
      return date.getFullYear() === year && date.getMonth() === month;
    }).length;
  }, [memories, year, month]);

  // 处理日期点击
  const handleDateClick = (date: string) => {
    setSelectedDate(selectedDate === date ? null : date);
  };

  // 处理添加/编辑记忆
  const handleSubmitMemory = async (data: { content: string; tags: string[]; characterId: string }) => {
    if (editingMemory) {
      // 更新记忆
      const result = await updateMemory(editingMemory.id, {
        content: data.content,
        tags: data.tags,
      });
      if (result.success) {
        setMemories((prev) =>
          prev.map((m) =>
            m.id === editingMemory.id
              ? { ...m, content: data.content, tags: data.tags }
              : m
          )
        );
      }
    } else {
      // 创建新记忆
      const result = await createMemory({
        character_id: data.characterId,
        content: data.content,
        tags: data.tags,
      });
      if (result.success && result.memory) {
        setMemories((prev) => [result.memory!, ...prev]);
      }
    }
    setIsEditorOpen(false);
    setEditingMemory(null);
  };

  // 处理编辑记忆
  const handleEditMemory = (memory: Memory) => {
    setEditingMemory(memory);
    setIsEditorOpen(true);
  };

  // 处理删除记忆
  const handleDeleteMemory = async (id: string) => {
    if (confirm('确定要删除这段记忆吗？')) {
      const result = await deleteMemory(id);
      if (result.success) {
        setMemories((prev) => prev.filter((m) => m.id !== id));
      }
    }
  };

  // 获取角色信息
  const getCharacterById = (id: string) => {
    return characters.find((c) => c.id === id);
  };

  // 处理编辑角色
  const handleEditCharacter = (character: Character) => {
    setEditingCharacter(character);
    setIsCharacterEditOpen(true);
  };

  // 处理保存角色编辑
  const handleSaveCharacterEdit = async (data: CharacterFormData) => {
    if (!editingCharacter) return;
    
    console.log('保存编辑数据:', data);
    
    const result = await updateCharacter(editingCharacter.id, {
      ...data,
      leave_date: data.leaveDate,
    });
    if (result.success) {
      setCharacters((prev) =>
        prev.map((c) =>
          c.id === editingCharacter.id
            ? {
                ...c,
                name: data.name,
                emoji: data.emoji,
                relation: data.relationship,
                personality: data.personality,
                hobbies: data.hobbies || null,
                notes: data.notes || null,
                departed_at: data.leaveDate || null,
              }
            : c
        )
      );
    }
    setIsCharacterEditOpen(false);
    setEditingCharacter(null);
  };

  // 处理删除角色
  const handleDeleteCharacter = async (id: string) => {
    const character = getCharacterById(id);
    if (!character) return;
    
    if (confirm(`确定要删除"${character.name}"吗？这将同时删除所有相关的记忆和对话。`)) {
      const result = await deleteCharacter(id);
      if (result.success) {
        setCharacters((prev) => prev.filter((c) => c.id !== id));
        setMemories((prev) => prev.filter((m) => m.character_id !== id));
        if (selectedCharacterId === id) {
          setSelectedCharacterId(null);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-cosmic-dark">
      {/* 背景星空 */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.2,
            }}
            animate={{
              opacity: [Math.random() * 0.2 + 0.1, Math.random() * 0.6 + 0.3, Math.random() * 0.2 + 0.1],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* 主内容 */}
      <div className="relative z-10 container mx-auto px-4 py-6">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h1 className="text-3xl font-bold text-white">记忆博物馆</h1>
            <p className="text-gray-400 mt-1">记录与TA的美好时光</p>
          </div>
          <button
            onClick={() => {
              setEditingMemory(null);
              setIsEditorOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            添加记忆
          </button>
        </motion.div>

        {/* 主布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 左侧：日历和角色标签 */}
          <div className="lg:col-span-1 space-y-4 order-2 lg:order-1">
            {loading ? (
              <>
                <CalendarSkeleton />
                <div className="space-y-2">
                  <CharacterSkeleton />
                  <CharacterSkeleton />
                  <CharacterSkeleton />
                </div>
              </>
            ) : (
              <>
                <MemoryCalendar
                  year={year}
                  month={month}
                  highlightedDates={highlightedDates}
                  onMonthChange={(y, m) => setCurrentDate(new Date(y, m))}
                  onDateClick={handleDateClick}
                />
                
                {characters.length > 0 && (
                  <CharacterTabs
                    characters={characters}
                    selectedId={selectedCharacterId}
                    onSelect={setSelectedCharacterId}
                  />
                )}
                
                {/* 角色详情卡片 */}
                {selectedCharacterId && !loading && (
                  <CharacterDetail
                    character={getCharacterById(selectedCharacterId)!}
                    onEdit={() => handleEditCharacter(getCharacterById(selectedCharacterId)!)}
                    onDelete={() => handleDeleteCharacter(selectedCharacterId)}
                  />
                )}
              </>
            )}
          </div>

          {/* 中间：故事列表 */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            {loading ? (
              <div className="space-y-4">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </div>
            ) : filteredMemories.length > 0 ? (
              <div className="space-y-4">
                {filteredMemories.map((memory) => (
                  <MemoryCard
                    key={memory.id}
                    memory={memory}
                    character={getCharacterById(memory.character_id)}
                    onEdit={handleEditMemory}
                    onDelete={handleDeleteMemory}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🌌</div>
                <p className="text-gray-400">暂无记忆记录</p>
                <p className="text-gray-500 text-sm mt-1">点击右上角添加你的第一条记忆</p>
              </div>
            )}
          </div>

          {/* 右侧：信息栏 - 移动端隐藏 */}
          <div className="hidden lg:block lg:col-span-1 order-3">
            <Sidebar
              tags={tags}
              characters={characters}
              memoryCountByCharacter={memoryCountByCharacter}
              monthlyCount={monthlyCount}
              selectedTag={selectedTag}
              onTagSelect={setSelectedTag}
            />
          </div>
        </div>
      </div>

      {/* 底部导航 */}
      <BottomNav activeTab="memory" onTabChange={() => {}} onAddCharacter={() => {}} />

      {/* 记忆编辑器 */}
      <MemoryEditor
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingMemory(null);
        }}
        onSubmit={handleSubmitMemory}
        editMemory={editingMemory}
        characters={characters}
      />

      {/* 角色编辑模态框 */}
      <AddCharacterModal
        isOpen={isCharacterEditOpen}
        onClose={() => {
          setIsCharacterEditOpen(false);
          setEditingCharacter(null);
        }}
        onSubmit={handleSaveCharacterEdit}
        editCharacter={editingCharacter}
      />
    </div>
  );
}