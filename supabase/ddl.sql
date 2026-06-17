-- ============================================================
-- 《时空星球》数据库 DDL
-- 版本: v1.0
-- 创建日期: 2026-06-14
-- 说明: 所有表启用 Row Level Security (RLS)，确保数据隔离
-- ============================================================

-- ========== 1. 用户表 ==========
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  nickname TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ========== 2. 角色/分身表 ==========
CREATE TABLE IF NOT EXISTS characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  emoji TEXT DEFAULT '🌟',
  relation TEXT,
  personality TEXT,
  avatar_url TEXT,
  departed_at DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ========== 3. 记忆故事表 ==========
CREATE TABLE IF NOT EXISTS memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ========== 4. 对话历史表 ==========
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ========== 5. 索引 ==========
-- 角色查询加速
CREATE INDEX IF NOT EXISTS idx_characters_user_id ON characters(user_id);

-- 记忆查询加速
CREATE INDEX IF NOT EXISTS idx_memories_character_id ON memories(character_id);
CREATE INDEX IF NOT EXISTS idx_memories_created_at ON memories(created_at DESC);

-- 对话查询加速
CREATE INDEX IF NOT EXISTS idx_chat_messages_character_id ON chat_messages(character_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at ASC);

-- ========== 6. 启用 RLS ==========
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- ========== 7. RLS 策略 ==========
-- profiles: 用户只能查看/修改自己的资料
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile on signup"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- characters: 用户只能查看/修改自己的分身
CREATE POLICY "Users can view their own characters"
  ON characters FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own characters"
  ON characters FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own characters"
  ON characters FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own characters"
  ON characters FOR DELETE
  USING (auth.uid() = user_id);

-- memories: 用户只能查看/修改自己的记忆
CREATE POLICY "Users can view their own memories"
  ON memories FOR SELECT
  USING (character_id IN (SELECT id FROM characters WHERE user_id = auth.uid()));

CREATE POLICY "Users can create their own memories"
  ON memories FOR INSERT
  WITH CHECK (character_id IN (SELECT id FROM characters WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their own memories"
  ON memories FOR UPDATE
  USING (character_id IN (SELECT id FROM characters WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete their own memories"
  ON memories FOR DELETE
  USING (character_id IN (SELECT id FROM characters WHERE user_id = auth.uid()));

-- chat_messages: 用户只能查看/修改自己的对话
CREATE POLICY "Users can view their own chat messages"
  ON chat_messages FOR SELECT
  USING (character_id IN (SELECT id FROM characters WHERE user_id = auth.uid()));

CREATE POLICY "Users can create their own chat messages"
  ON chat_messages FOR INSERT
  WITH CHECK (character_id IN (SELECT id FROM characters WHERE user_id = auth.uid()));