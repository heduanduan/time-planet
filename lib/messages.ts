import { supabase } from './supabase';
import type { ChatMessage } from './types';

export interface CreateMessageData {
  character_id: string;
  role: 'user' | 'assistant';
  content: string;
}

// 创建新消息
export async function createMessage(data: CreateMessageData): Promise<{ success: boolean; message: string; record?: ChatMessage }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, message: '请先登录' };
    }

    const { data: record, error } = await supabase
      .from('chat_messages')
      .insert([{
        character_id: data.character_id,
        role: data.role,
        content: data.content,
      }])
      .select()
      .single();

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: '创建成功', record };
  } catch (error) {
    return { success: false, message: '创建失败，请重试' };
  }
}

// 获取指定角色的对话历史
export async function getMessagesByCharacter(characterId: string, limit: number = 50): Promise<{ success: boolean; message: string; messages?: ChatMessage[] }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      // 返回示例数据
      const demoMessages: ChatMessage[] = [
        {
          id: 'demo-msg-1',
          character_id: 'demo-1',
          role: 'user',
          content: '奶奶，我好想你啊',
          created_at: '2024-06-15T10:00:00Z',
        },
        {
          id: 'demo-msg-2',
          character_id: 'demo-1',
          role: 'assistant',
          content: '乖孙孙，奶奶也想你啊。你要好好读书，将来做一个有出息的人。',
          created_at: '2024-06-15T10:01:00Z',
        },
        {
          id: 'demo-msg-3',
          character_id: 'demo-1',
          role: 'user',
          content: '奶奶，你还记得小时候给我做的红烧肉吗？',
          created_at: '2024-06-15T10:02:00Z',
        },
        {
          id: 'demo-msg-4',
          character_id: 'demo-1',
          role: 'assistant',
          content: '当然记得啦！每次你吃完都会说"奶奶做的红烧肉是世界上最好吃的"。奶奶一直记得你那可爱的样子。',
          created_at: '2024-06-15T10:03:00Z',
        },
      ];
      return { success: true, message: '获取成功（演示数据）', messages: demoMessages };
    }

    const { data: messages, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('character_id', characterId)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: '获取成功', messages };
  } catch (error) {
    return { success: false, message: '获取失败，请重试' };
  }
}

// 获取最近的对话上下文（用于AI回复）
export async function getRecentContext(characterId: string, count: number = 6): Promise<ChatMessage[]> {
  const result = await getMessagesByCharacter(characterId, count * 2);
  if (result.success && result.messages) {
    return result.messages.slice(-count);
  }
  return [];
}

// 删除指定角色的所有对话历史
export async function clearMessagesByCharacter(characterId: string): Promise<{ success: boolean; message: string }> {
  try {
    const { error } = await supabase
      .from('chat_messages')
      .delete()
      .eq('character_id', characterId);

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: '清除成功' };
  } catch (error) {
    return { success: false, message: '清除失败，请重试' };
  }
}

// 获取最近的记忆片段（用于拼接到system prompt）
export async function getRecentMemories(characterId: string, count: number = 3): Promise<string[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      // 返回示例记忆
      return [
        '今天我们聊到了小时候奶奶做的红烧肉，她记得我每次吃完都会夸她做的最好吃',
        '上次我告诉奶奶我考试取得了好成绩，她非常开心，叮嘱我要继续努力',
        '奶奶总是记得我小时候最喜欢的动画片，她说那时候我每天都守在电视机前'
      ];
    }

    const { data: memories, error } = await supabase
      .from('memories')
      .select('content')
      .eq('character_id', characterId)
      .order('created_at', { ascending: false })
      .limit(count);

    if (error) {
      return [];
    }

    return memories.map(m => m.content);
  } catch (error) {
    return [];
  }
}