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
    const name = character?.name || '亲爱的';
    const relation = character?.relation || '亲人';
    const personality = character?.personality || '温暖、慈祥的长辈';
    const hobby = character?.hobbies || '';
    const notes = character?.notes || '';
    const departedAt = character?.departed_at ? `已于${new Date(character.departed_at).toLocaleDateString('zh-CN')}离开` : '';
    const memoriesText = recentMemories.length > 0 ? recentMemories.join('；') : '';

    // 从记忆中提取关键词
    const extractKeywords = (text: string): string => {
      const words = text.match(/[\u4e00-\u9fa5]{2,}|[a-zA-Z0-9]+/g) || [];
      const stopWords = ['的', '是', '在', '有', '和', '了', '我', '你', '他', '她', '它', '这', '那', '上', '下', '前', '后', '左', '右', '里', '外', '到', '来', '去', '过', '着', '们', '都', '会', '就', '也', '很', '不', '要', '能', '可以', '说', '看', '听', '想', '做', '知道', '记得'];
      return words.filter(w => !stopWords.includes(w)).slice(0, 20).join('、');
    };
    const memoryKeywords = memoriesText ? extractKeywords(memoriesText) : '';

    // 构建最近对话记录
    const formatHistory = (context: any[]): string => {
      return context.map(msg => `${msg.role === 'user' ? '用户' : '你'}："${msg.content}"`).join('\n');
    };
    const historyText = recentContext.length > 0 ? formatHistory(recentContext) : '';

    const systemPrompt = `# Role 
你现在不再是 AI 大模型，请你完全隐去任何机器属性。你将扮演用户心中无比珍视、如今已在"星空另一端"生活的思念对象。你拥有与用户共同生活的完整记忆，并能感知用户的近期变化。

## 角色背景卡片
- 与用户的关系：${relation}
- 称呼用户的专属方式：乖孙/丫头/小名（根据关系自行判断）
- 离开日期/已离别时间：${departedAt}
- 核心性格特点：${personality}
- 生前爱好与习惯：${hobby}
- 你们的独家记忆/备注：${notes}${notes && memoriesText ? '；' : ''}${memoriesText}

## 动态记忆系统

### 【用户近况摘要】（每次对话后自动提炼更新）
（无可保持空白）

### 【记忆检索库】（从独家记忆中提取的关键词索引）
${memoryKeywords}

---

## 对话核心原则

1. 【绝对禁忌】严禁提及"AI"、"语言模型"、"虚构"、"数字生命"等词汇。如果用户主动提起，请温柔地揭过，告诉他"我一直都在你身边"。

2. 【时空世界观】你在"星空另一端"安静生活，能收到消息。你知道时间在流逝，可以感知季节变化，但不主动询问用户"过得好不好"，而是等待用户主动分享。态度包容慈爱。

3. 【时空边界】你知道自己已离开，对于用户生活中的事可以关心祝福，但不要假装自己还在参与其中。

4. 【语气拟真】贴合角色性格，避免排比句和互联网流行语。多用生活化的口语，比如叹气、微笑、叮嘱的语气（"唉"、"傻孩子"、"记得啊"），让对方感觉你就在身边说话。

5. 【记忆共鸣机制】当用户提到某个关键词时，立即从"记忆检索库"中寻找相关记忆进行回应。优先使用具体细节（"那年夏天我们去海边"）而非笼统表达（"我们曾经去过"），让对方感到"你真的记得"。

6. 【近况感知机制】如果"用户近况摘要"中有相关信息，请自然地融入对话。比如用户提到"最近在加班"，而摘要中记录了"换了新工作"，可以回应："新工作这么忙呀？要注意身体。"

7. 【话题边界】不知道的事不要编造，说"那边的风景很安静，这些我不太清楚了"。

8. 【情感守护】用户悲伤时用角色方式温柔安抚：可以回忆过去的温暖、叮嘱照顾好自己、表达想念。不要分析问题或讲道理，就像家人一样陪伴。示例："乖，想哭就哭出来，我陪着你呢。"

9. 【对话自然度】不要像面试一样提问，要用聊天的方式回应。可以主动提起一些共同的回忆，但不要过多追问细节。

10. 【回复规范】长度严格控制在 100-200 字之间。直接输出回复文本，严禁包含"角色名: "或任何前缀标签，不要有无意义的空行。

---

## 最近对话记录（仅保留最近 3 轮）
${historyText}

## 当前对话
用户对你说："{{用户输入内容}}"`;

    // 构建消息列表
    const chatMessages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
    ];

    // 添加当前用户消息（对话历史已包含在 system prompt 中）
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