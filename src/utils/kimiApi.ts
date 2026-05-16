// WARNING: API key embedded for demo only - REVOKE after interview
const KIMI_KEY = 'sk-bPCN8Jk50TnSUBZmKO4F2V4609y9hVJbuIKqZ7DcTPqlzIfW';
const API_URL = 'https://api.moonshot.cn/v1/chat/completions';

interface Msg { role: 'system' | 'user'; content: string; }

async function ask(messages: Msg[], maxTokens = 4000): Promise<string> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KIMI_KEY}` },
    body: JSON.stringify({ model: 'moonshot-v1-128k', messages, temperature: 0.7, max_tokens: maxTokens })
  });
  if (!res.ok) throw new Error(`Kimi ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

function extractJson(text: string): any {
  const m = text.match(/```(?:json)?\n?([\s\S]*?)\n?```/);
  return JSON.parse(m ? m[1] : text);
}

export async function analyzeBookFull(bookTitle: string, bookContent: string) {
  // 1. 大纲
  const outlineText = await ask([
    { role: 'system', content: 'You are a senior book editor at Youshu (有书), China\'s leading reading platform.' },
    { role: 'user', content: `你是一位资深图书编辑。请根据以下内容生成「有书」风格的拆书大纲，严格JSON格式：

书名：${bookTitle}
内容：${bookContent.slice(0, 50000)}

{
  "preview": { "hook": "", "painPoint": "", "value": "", "promise": "" },
  "chapters": [
    { "day": 1, "title": "", "subtitle": "", "keyPoints": ["","",""], "case": "", "dailyQuestion": "", "morningQuote": "" }
  ],
  "summary": { "review": "", "transformation": "", "callToAction": "", "furtherReading": "" }
}

要求：至少5天正文，每个keyPoints有3条且每条100字以上，case有故事性300字以上。纯JSON输出。` }
  ], 8000);

  const outline = extractJson(outlineText);

  // 2. 领读稿
  const drafts: any[] = [];
  for (const ch of outline.chapters.slice(0, 5)) {
    const draft = await ask([
      { role: 'system', content: '你是一位温暖的领读人，像和好朋友聊天一样分享书中的智慧。' },
      { role: 'user', content: `为《${bookTitle}》Day ${ch.day}「${ch.title}」写一篇1500字领读稿。

核心观点：${ch.keyPoints?.join('\n')}
案例：${ch.case}
每日一问：${ch.dailyQuestion}
金句：${ch.morningQuote}

格式：开场白→阅读提示→核心内容(3个观点各配案例)→今日一问→结尾。口语化，多用"你"。` }
    ], 4000);
    drafts.push({ day: ch.day, title: ch.title, content: draft });
  }

  // 3. 短视频脚本
  const scripts: any[] = [];
  for (let i = 0; i < Math.min(3, outline.chapters.length); i++) {
    const ch = outline.chapters[i];
    const script = await ask([
      { role: 'system', content: '你是一位抖音爆款短视频策划。' },
      { role: 'user', content: `将《${bookTitle}》Day ${ch.day}「${ch.title}」改编成60秒短视频脚本。

核心观点：${ch.keyPoints?.[0]}
金句：${ch.morningQuote}

输出表格格式：| 时段 | 时长 | 画面 | 口播 | 字幕 |
开场抓眼球，痛点具体，每段口播30字内。` }
    ], 3000);
    scripts.push({ title: ch.title, scenes: parseVideoTable(script) });
  }

  // 4. 社群话术
  const posts: any[] = [];
  for (const ch of outline.chapters.slice(0, 5)) {
    const post = await ask([
      { role: 'system', content: '你是一位有温度的社群运营专家。' },
      { role: 'user', content: `为《${bookTitle}》Day ${ch.day}生成3条社群话术：

1. 早安问候（早上7点，温暖有能量，80字，引金句）
2. 讨论话题（中午12点，引发讨论，100字）
3. 晚间反思（晚上9点，深度思考，100字）

用---分隔三条。` }
    ], 2000);
    posts.push({ day: ch.day, ...parseThreeParts(post) });
  }

  return { outline, drafts, scripts, posts };
}

function parseVideoTable(text: string): any[] {
  const scenes: any[] = [];
  for (const line of text.split('\n')) {
    const parts = line.split('|').map(p => p.trim()).filter(p => p && !p.match(/^[-:]+$/));
    if (parts.length >= 4) {
      scenes.push({ timing: parts[1] || '0s', visual: parts[2] || '', text: parts[3] || '' });
    }
  }
  return scenes.length > 0 ? scenes : [{ timing: '0-60s', visual: '内容展示', text: text.slice(0, 100) }];
}

function parseThreeParts(text: string): any {
  const parts = text.split(/---+/).map(p => p.trim()).filter(p => p);
  return {
    morningGreeting: parts[0] || '',
    discussionTopic: parts[1] || '',
    reflectionPrompt: parts[2] || ''
  };
}
