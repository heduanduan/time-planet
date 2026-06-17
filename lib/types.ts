// ============================================================
// 《时空星球》类型定义
// ============================================================

// ========== 用户 ==========
export interface Profile {
  id: string;
  email: string;
  nickname: string | null;
  avatar_url: string | null;
  created_at: string;
}

// ========== 角色/数字分身 ==========
export interface Character {
  id: string;
  user_id: string;
  name: string;
  emoji: string;
  relation: string | null;
  personality: string | null;
  hobbies: string | null;
  notes: string | null;
  avatar_url: string | null;
  departed_at: string | null;
  created_at: string;
}

// 创建角色的表单类型
export interface CharacterForm {
  name: string;
  emoji: string;
  relation: string;
  personality: string;
  departed_at: string;
}

// ========== 记忆故事 ==========
export interface Memory {
  id: string;
  character_id: string;
  content: string;
  image_url: string | null;
  tags: string[];
  created_at: string;
}

// 创建记忆的表单类型
export interface MemoryForm {
  content: string;
  image_url: string | null;
  tags: string[];
}

// ========== 对话消息 ==========
export interface ChatMessage {
  id: string;
  character_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

// ========== API 相关 ==========
export interface ChatRequest {
  messages: { role: string; content: string }[];
  personality?: string;
  memories?: string[];
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}