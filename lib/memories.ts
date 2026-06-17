import { supabase } from './supabase';
import type { Memory } from './types';

export interface CreateMemoryData {
  character_id: string;
  content: string;
  image_url?: string | null;
  tags?: string[];
}

export interface UpdateMemoryData {
  content?: string;
  image_url?: string | null;
  tags?: string[];
}

// 创建新记忆
export async function createMemory(data: CreateMemoryData): Promise<{ success: boolean; message: string; memory?: Memory }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, message: '请先登录' };
    }

    const { data: memory, error } = await supabase
      .from('memories')
      .insert([{
        character_id: data.character_id,
        content: data.content,
        image_url: data.image_url || null,
        tags: data.tags || [],
      }])
      .select()
      .single();

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: '创建成功', memory };
  } catch (error) {
    return { success: false, message: '创建失败，请重试' };
  }
}

// 获取指定角色的记忆列表
export async function getMemoriesByCharacter(characterId: string): Promise<{ success: boolean; message: string; memories?: Memory[] }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, message: '请先登录' };
    }

    const { data: memories, error } = await supabase
      .from('memories')
      .select('*')
      .eq('character_id', characterId)
      .order('created_at', { ascending: false });

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: '获取成功', memories };
  } catch (error) {
    return { success: false, message: '获取失败，请重试' };
  }
}

// 获取用户所有记忆（按日期分组）
export async function getAllMemories(): Promise<{ success: boolean; message: string; memories?: Memory[] }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      // 返回示例数据
      const demoMemories: Memory[] = [
        {
          id: 'demo-1',
          character_id: 'demo-1',
          content: '今天奶奶给我讲了她年轻时在乡下的故事，那时候生活虽然艰苦，但大家都很快乐。她还提到了村口的那棵老槐树...',
          image_url: null,
          tags: ['故事', '回忆'],
          created_at: '2024-06-15T10:30:00Z',
        },
        {
          id: 'demo-2',
          character_id: 'demo-2',
          content: '布丁今天特别调皮，把沙发上的抱枕都弄下来了。不过它看到我生气的样子，马上跑过来蹭我的腿撒娇，真是拿它没办法。',
          image_url: null,
          tags: ['日常', '可爱'],
          created_at: '2024-06-14T15:20:00Z',
        },
        {
          id: 'demo-3',
          character_id: 'demo-1',
          content: '记得小时候，奶奶每天都会给我做早餐。最喜欢她做的豆浆油条，那味道至今难忘。',
          image_url: null,
          tags: ['美食', '童年'],
          created_at: '2024-06-12T08:00:00Z',
        },
        {
          id: 'demo-4',
          character_id: 'demo-3',
          content: '外公教我下棋的情景还历历在目。他总是让我先走，然后耐心地给我讲解每一步的道理。',
          image_url: null,
          tags: ['下棋', '教导'],
          created_at: '2024-06-10T14:30:00Z',
        },
        {
          id: 'demo-5',
          character_id: 'demo-2',
          content: '布丁第一次学会握手的那天，全家人都开心极了。它摇着尾巴，眼睛亮晶晶的，好像知道自己做了件了不起的事。',
          image_url: null,
          tags: ['成长', '感动'],
          created_at: '2024-06-08T18:45:00Z',
        },
        {
          id: 'demo-6',
          character_id: 'demo-1',
          content: '奶奶的手很巧，会做各种针线活。她给我缝的布娃娃，我一直珍藏着。',
          image_url: null,
          tags: ['手工', '礼物'],
          created_at: '2024-06-05T11:00:00Z',
        },
      ];
      return { success: true, message: '获取成功（演示数据）', memories: demoMemories };
    }

    const { data: memories, error } = await supabase
      .from('memories')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: '获取成功', memories };
  } catch (error) {
    return { success: false, message: '获取失败，请重试' };
  }
}

// 获取单个记忆
export async function getMemory(id: string): Promise<{ success: boolean; message: string; memory?: Memory }> {
  try {
    const { data: memory, error } = await supabase
      .from('memories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: '获取成功', memory };
  } catch (error) {
    return { success: false, message: '获取失败，请重试' };
  }
}

// 更新记忆
export async function updateMemory(id: string, data: UpdateMemoryData): Promise<{ success: boolean; message: string }> {
  try {
    const { error } = await supabase
      .from('memories')
      .update({
        content: data.content,
        image_url: data.image_url,
        tags: data.tags,
      })
      .eq('id', id);

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: '更新成功' };
  } catch (error) {
    return { success: false, message: '更新失败，请重试' };
  }
}

// 删除记忆
export async function deleteMemory(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const { error } = await supabase
      .from('memories')
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: '删除成功' };
  } catch (error) {
    return { success: false, message: '删除失败，请重试' };
  }
}

// 获取所有标签
export async function getTags(): Promise<{ success: boolean; message: string; tags?: string[] }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      // 返回示例标签
      return { success: true, message: '获取成功（演示数据）', tags: ['故事', '回忆', '日常', '可爱', '美食', '童年', '下棋', '教导', '成长', '感动', '手工', '礼物'] };
    }

    const { data: memories, error } = await supabase
      .from('memories')
      .select('tags');

    if (error) {
      return { success: false, message: error.message };
    }

    // 提取所有标签并去重
    const allTags = new Set<string>();
    memories.forEach(memory => {
      if (memory.tags && Array.isArray(memory.tags)) {
        memory.tags.forEach(tag => allTags.add(tag));
      }
    });

    return { success: true, message: '获取成功', tags: Array.from(allTags) };
  } catch (error) {
    return { success: false, message: '获取失败，请重试' };
  }
}

// 获取指定月份的记忆统计
export async function getMonthlyStats(year: number, month: number): Promise<{ success: boolean; message: string; count?: number; dates?: string[] }> {
  try {
    const result = await getAllMemories();
    const memories = result.memories;
    
    if (!memories) {
      return { success: true, message: '获取成功', count: 0, dates: [] };
    }

    const filtered = memories.filter(memory => {
      const date = new Date(memory.created_at);
      return date.getFullYear() === year && date.getMonth() === month;
    });

    const dateSet = new Set<string>();
    filtered.forEach(memory => {
      const date = new Date(memory.created_at);
      dateSet.add(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`);
    });
    const dates = Array.from(dateSet);

    return { success: true, message: '获取成功', count: filtered.length, dates };
  } catch (error) {
    return { success: false, message: '获取失败，请重试' };
  }
}