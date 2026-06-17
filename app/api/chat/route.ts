import { NextRequest } from 'next/server';
import { createServerClient } from '../../../lib/supabase';
import { getCharacter } from '../../../lib/characters';
import { getRecentMemories, getRecentContext } from '../../../lib/messages';

// 获取 DeepSeek API Key
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const { characterId, messages } = await request.json();

    if (!characterId) {
      return new Response(JSON.stringify({ error: '缺少角色ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 获取角色信息
    const charResult = await getCharacter(characterId);
    const character = charResult.character;

    // 获取最近的记忆
    const recentMemories = await getRecentMemories(characterId);
    const recentContext = await getRecentContext(characterId);

    // 构建 system prompt
    const personality = character?.personality || '温暖、慈祥的长辈';
    const name = character?.name || '亲爱的';
    const relation = character?.relation || '亲人';

    let systemPrompt = `你扮演的是${name}，与用户的关系是${relation}。

性格特点：${personality}

请用温暖、亲切的口吻与用户对话。回复要自然、真实，符合${name}的身份和性格。`;

    // 如果有记忆，添加到 system prompt
    if (recentMemories.length > 0) {
      systemPrompt += `\n\n以下是一些关于你们的共同记忆：\n`;
      recentMemories.forEach((memory, index) => {
        systemPrompt += `${index + 1}. ${memory}\n`;
      });
      systemPrompt += `\n在对话中，你可以适当提及这些记忆，让对话更加温馨真实。`;
    }

    // 构建消息列表
    const chatMessages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
    ];

    // 添加对话历史
    if (recentContext && recentContext.length > 0) {
      recentContext.forEach((msg) => {
        chatMessages.push({
          role: msg.role,
          content: msg.content,
        });
      });
    }

    // 添加当前用户消息
    if (messages && messages.length > 0) {
      chatMessages.push({ role: 'user', content: messages[messages.length - 1].content });
    }

    // 如果没有配置 API Key，返回模拟回复
    if (!DEEPSEEK_API_KEY || DEEPSEEK_API_KEY === 'your-deepseek-api-key') {
      const mockReplies = [
        `乖孙孙，${getRandomSuffix()}`,
        `听到你这么说，我很开心...${getRandomSuffix()}`,
        `${getRandomMemory(name)}。${getRandomSuffix()}`,
        '你知道吗，我一直在天上看着你呢...',
        '想起以前和你在一起的时光，总是觉得很温暖。',
      ];
      const reply = mockReplies[Math.floor(Math.random() * mockReplies.length)];
      return new Response(reply);
    }

    // 调用 DeepSeek API
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: chatMessages,
        stream: true,
        temperature: 0.8,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('DeepSeek API Error:', errorData);
      return new Response(JSON.stringify({ error: 'AI 服务暂时不可用' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 返回流式响应
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ error: '服务器错误，请重试' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// 辅助函数：获取随机后缀
function getRandomSuffix(): string {
  const suffixes = [
    '奶奶一直都想你。',
    '要好好照顾自己啊。',
    '有什么事都可以跟我说。',
    '你开心我就开心了。',
    '相信你一定能做到的。',
  ];
  return suffixes[Math.floor(Math.random() * suffixes.length)];
}

// 辅助函数：获取随机记忆
function getRandomMemory(name: string): string {
  const memories = [
    `想起以前${name}教你认字的时候，你学得可认真了。`,
    `还记得你小时候最喜欢让我讲故事哄你睡觉。`,
    `每次看到你健康成长，我就觉得很欣慰。`,
    `${name}一直记得你第一次叫我的时候，那声音真好听。`,
  ];
  return memories[Math.floor(Math.random() * memories.length)];
}