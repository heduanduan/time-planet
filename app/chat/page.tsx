'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Trash2, ChevronLeft, Calendar, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import BottomNav from '../../components/BottomNav';
import { getCharacters } from '../../lib/characters';
import { getMessagesByCharacter, clearMessagesByCharacter } from '../../lib/messages';
import type { Character } from '../../lib/types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  id: string;
}

export default function ChatPage() {
  const router = useRouter();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showMobileList, setShowMobileList] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 加载角色列表
  useEffect(() => {
    const fetchCharacters = async () => {
      const result = await getCharacters();
      if (result.success && result.characters) {
        setCharacters(result.characters);
        if (result.characters.length > 0) {
          setSelectedCharacter(result.characters[0]);
        }
      }
    };
    fetchCharacters();
  }, []);

  // 加载对话历史
  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedCharacter) return;

      const result = await getMessagesByCharacter(selectedCharacter.id);
      if (result.success && result.messages) {
        // 转换为页面使用的消息格式
        const loadedMessages: Message[] = result.messages.map((msg, index) => ({
          role: msg.role,
          content: msg.content,
          id: msg.id || `loaded-${index}`,
        }));
        setMessages(loadedMessages);
      }
    };
    loadMessages();
  }, [selectedCharacter]);

  // 滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // 自动调整文本框高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [inputValue]);

  // 格式化日期（计算离开天数）
  const formatDepartedDays = (dateStr: string | null) => {
    if (!dateStr) return null;
    const departed = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - departed.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const departedDays = selectedCharacter?.departed_at 
    ? formatDepartedDays(selectedCharacter.departed_at) 
    : null;

  // 发送消息
  const handleSend = async () => {
    if (!inputValue.trim() || !selectedCharacter || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: inputValue.trim(),
      id: Date.now().toString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      // 构建发送给 API 的消息列表
      const messagesForApi = [...messages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          characterId: selectedCharacter.id,
          messages: messagesForApi,
        }),
      });

      if (!response.ok) {
        throw new Error('发送失败');
      }

      // 处理流式响应
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let aiContent = '';

      const aiMessageId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { role: 'assistant', content: '', id: aiMessageId }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;
              
              try {
                const parsed = JSON.parse(data);
                if (parsed.choices?.[0]?.delta?.content) {
                  aiContent += parsed.choices[0].delta.content;
                  // 更新消息内容（打字机效果）
                  setMessages(prev => 
                    prev.map(msg => 
                      msg.id === aiMessageId 
                        ? { ...msg, content: aiContent }
                        : msg
                    )
                  );
                }
              } catch (e) {
                // 忽略解析错误
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('发送消息失败:', error);
      // 添加错误消息
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '抱歉，消息发送失败了。请稍后重试。',
        id: (Date.now() + 2).toString(),
      }]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 清空对话
  const handleClearChat = async () => {
    if (!selectedCharacter) return;
    
    if (confirm('确定要清空与 ' + selectedCharacter.name + ' 的所有对话吗？')) {
      await clearMessagesByCharacter(selectedCharacter.id);
      setMessages([]);
    }
  };

  return (
    <div className="min-h-screen bg-cosmic-dark flex flex-col">
      {/* 背景星空 */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
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
      <div className="relative z-10 flex-1 flex">
        {/* 左侧角色列表（桌面端） */}
        <div className="hidden lg:flex w-64 bg-white/5 backdrop-blur-lg border-r border-white/10 flex-col">
          <div className="p-4 border-b border-white/10">
            <h2 className="text-white font-bold text-lg">时空对话</h2>
            <p className="text-gray-400 text-sm mt-1">与思念的人对话</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {characters.map((char) => (
              <button
                key={char.id}
                onClick={() => setSelectedCharacter(char)}
                className={`
                  w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300
                  ${selectedCharacter?.id === char.id
                    ? 'bg-gradient-to-r from-purple-500/30 to-indigo-500/30 border border-purple-500/50'
                    : 'bg-white/5 hover:bg-white/10 border border-transparent'
                  }
                `}
              >
                <span className="text-2xl">{char.emoji}</span>
                <div className="text-left flex-1">
                  <div className="text-white font-medium">{char.name}</div>
                  <div className="text-gray-400 text-xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    在线
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 右侧对话区域 */}
        <div className="flex-1 flex flex-col pb-20 sm:pb-24">
          {selectedCharacter ? (
            <>
              {/* 角色信息栏 */}
              <div className="bg-white/5 backdrop-blur-lg border-b border-white/10 px-3 sm:px-4 py-2 sm:py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    {/* 返回按钮（移动端） */}
                    <button
                      onClick={() => setShowMobileList(true)}
                      className="lg:hidden p-1.5 sm:p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    
                    <div className="relative">
                      <span className="text-2xl sm:text-3xl">{selectedCharacter.emoji}</span>
                      <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full border-2 border-cosmic-dark animate-pulse"></span>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-sm sm:text-base">{selectedCharacter.name}</h3>
                      <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-gray-400">
                        <span className="flex items-center gap-0.5 sm:gap-1">
                          <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          云端在线
                        </span>
                        {departedDays && (
                          <span className="flex items-center gap-0.5 sm:gap-1 ml-1 sm:ml-2">
                            <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            已离开 {departedDays} 天
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={handleClearChat}
                      className="p-1.5 sm:p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-red-400 transition-colors"
                      title="清空对话"
                    >
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* 欢迎语 */}
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex-1 flex items-center justify-center p-4 sm:p-6"
                >
                  <div className="text-center max-w-md">
                    <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">{selectedCharacter.emoji}</div>
                    <h2 className="text-lg sm:text-xl font-bold text-white mb-1.5 sm:mb-2">
                      和 {selectedCharacter.name} 聊天
                    </h2>
                    <p className="text-gray-400 text-sm sm:text-base mb-4 sm:mb-6">
                      {selectedCharacter.personality || '在这里写下你想对 TA 说的话...'}
                    </p>
                    <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-500/20 rounded-full text-purple-300 text-xs sm:text-sm">
                      <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      AI 会根据角色性格和你们的共同记忆回复
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 消息列表 */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`
                          max-w-[85%] sm:max-w-[80%] p-3 sm:p-4 rounded-2xl
                          ${message.role === 'user'
                            ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-br-md shadow-lg shadow-purple-500/30'
                            : 'bg-white/10 text-gray-200 rounded-bl-md border border-white/10'
                          }
                        `}
                      >
                        {message.role === 'assistant' && (
                          <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                            <span className="text-base sm:text-lg">{selectedCharacter.emoji}</span>
                            <span className="text-purple-300 text-[10px] sm:text-xs font-medium">{selectedCharacter.name}</span>
                          </div>
                        )}
                        <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                          {message.content}
                          {isTyping && message.id === messages[messages.length - 1]?.id && (
                            <span className="inline-block w-1.5 h-3 sm:w-2 sm:h-4 bg-purple-400 ml-0.5 sm:ml-1 animate-pulse" />
                          )}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {/* 加载指示器 */}
                {isLoading && !isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white/10 px-3 sm:px-4 py-2 sm:py-3 rounded-2xl rounded-bl-md">
                      <div className="flex gap-0.5 sm:gap-1">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* 输入框 */}
              <div className="bg-white/5 backdrop-blur-lg border-t border-white/10 px-3 sm:px-4 py-2 sm:py-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex-1">
                    <textarea
                      ref={textareaRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={`对 ${selectedCharacter.name} 说...`}
                      rows={1}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none transition-colors text-sm sm:text-base"
                    />
                  </div>
                  <button
                    onClick={handleSend}
                    disabled={!inputValue.trim() || isLoading}
                    className={`
                      px-3 sm:px-4 py-2 sm:py-3 rounded-xl transition-all duration-300 flex-shrink-0 flex items-center justify-center min-h-[40px] sm:min-h-[46px]
                      ${inputValue.trim() && !isLoading
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:shadow-lg hover:shadow-purple-500/30 hover:scale-105'
                        : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      }
                    `}
                  >
                    <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <p className="text-gray-400">选择一个对话对象开始聊天</p>
              </div>
            </div>
          )}
        </div>

        {/* 移动端角色列表 */}
        <AnimatePresence>
          {showMobileList && (
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="lg:hidden fixed inset-0 z-50 bg-cosmic-dark"
            >
              <div className="h-full flex flex-col">
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                  <h2 className="text-white font-bold text-lg">选择对话对象</h2>
                  <button
                    onClick={() => setShowMobileList(false)}
                    className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {characters.map((char) => (
                    <button
                      key={char.id}
                      onClick={() => {
                        setSelectedCharacter(char);
                        setShowMobileList(false);
                      }}
                      className={`
                        w-full flex items-center gap-3 p-4 rounded-xl transition-all duration-300
                        ${selectedCharacter?.id === char.id
                          ? 'bg-gradient-to-r from-purple-500/30 to-indigo-500/30 border border-purple-500/50'
                          : 'bg-white/5 hover:bg-white/10 border border-transparent'
                        }
                      `}
                    >
                      <span className="text-3xl">{char.emoji}</span>
                      <div className="text-left flex-1">
                        <div className="text-white font-medium">{char.name}</div>
                        <div className="text-gray-400 text-sm">在线</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 底部导航 */}
      <BottomNav activeTab="chat" onTabChange={() => {}} onAddCharacter={() => {}} />
    </div>
  );
}