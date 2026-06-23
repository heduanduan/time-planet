import { supabase } from './supabase';
import type { Character } from './types';

export interface CreateCharacterData {
  name: string;
  emoji: string;
  relationship: string;
  personality: string;
  hobbies?: string;
  notes?: string;
  leave_date?: string;
}

// 创建新角色
export async function createCharacter(data: CreateCharacterData): Promise<{ success: boolean; message: string; character?: Character }> {
  try {
    // 获取当前用户信息
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, message: '请先登录' };
    }

    const { data: character, error } = await supabase
      .from('characters')
      .insert([{
        user_id: user.id,
        name: data.name,
        emoji: data.emoji,
        relation: data.relationship,
        personality: data.personality,
        hobbies: data.hobbies || null,
        notes: data.notes || null,
        departed_at: data.leave_date || null,
      }])
      .select()
      .single();

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: '创建成功', character };
  } catch (error) {
    return { success: false, message: '创建失败，请重试' };
  }
}

// 获取当前用户的所有角色
export async function getCharacters(): Promise<{ success: boolean; message: string; characters?: Character[] }> {
  try {
    // 先检查用户是否登录
    const { data: { user } } = await supabase.auth.getUser();
    
    // 如果未登录，返回示例数据
    if (!user) {
      const demoCharacters: Character[] = [
        {
          id: 'demo-1',
          user_id: 'demo',
          name: '奶奶',
          emoji: '👵',
          relation: '奶奶',
          personality: '慈祥温和，喜欢给孩子们讲故事，擅长做各种传统美食',
          hobbies: '种花、包饺子、听戏曲',
          notes: '最喜欢的是红烧肉和孩子们的笑声',
          avatar_url: null,
          departed_at: '2024-06-15',
          created_at: '2024-06-15T10:00:00Z',
        },
        {
          id: 'demo-2',
          user_id: 'demo',
          name: '小狗布丁',
          emoji: '🐕',
          relation: '宠物',
          personality: '活泼可爱，喜欢追球和撒娇，是家里的开心果',
          hobbies: '追球、撒娇、晒太阳',
          notes: '最喜欢吃鸡肉干，会握手和转圈',
          avatar_url: null,
          departed_at: '2023-12-20',
          created_at: '2023-12-20T15:30:00Z',
        },
        {
          id: 'demo-3',
          user_id: 'demo',
          name: '外公',
          emoji: '👴',
          relation: '外公',
          personality: '博学多才，喜欢下棋和讲历史故事，总是笑眯眯的',
          hobbies: '下棋、钓鱼、讲历史故事',
          notes: '年轻时当过兵，有着丰富的人生阅历',
          avatar_url: null,
          departed_at: '2022-09-01',
          created_at: '2022-09-01T09:00:00Z',
        },
        {
          id: 'demo-4',
          user_id: 'demo',
          name: '守护星',
          emoji: '🌟',
          relation: '其他',
          personality: '神秘的守护者，带来温暖和希望',
          hobbies: '守护、指引方向',
          notes: '来自遥远的星辰，带来无尽的希望',
          avatar_url: null,
          departed_at: null,
          created_at: '2024-01-01T00:00:00Z',
        },
      ];
      return { success: true, message: '获取成功（演示数据）', characters: demoCharacters };
    }

    const { data: characters, error } = await supabase
      .from('characters')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: '获取成功', characters };
  } catch (error) {
    return { success: false, message: '获取失败，请重试' };
  }
}

// 获取单个角色
export async function getCharacter(id: string): Promise<{ success: boolean; message: string; character?: Character }> {
  try {
    const { data: character, error } = await supabase
      .from('characters')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: '获取成功', character };
  } catch (error) {
    return { success: false, message: '获取失败，请重试' };
  }
}

// 更新角色信息
export async function updateCharacter(id: string, data: Partial<CreateCharacterData>): Promise<{ success: boolean; message: string }> {
  try {
    const { error } = await supabase
      .from('characters')
      .update({
        name: data.name,
        emoji: data.emoji,
        relation: data.relationship,
        personality: data.personality,
        hobbies: data.hobbies || null,
        notes: data.notes || null,
        departed_at: data.leave_date || null,
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

// 删除角色
export async function deleteCharacter(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const { error } = await supabase
      .from('characters')
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
