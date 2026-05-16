// WARNING: This API key is embedded for interview demo only.
// REVOKE IMMEDIATELY after the interview.
const KIMI_API_KEY = 'sk-bPCN8Jk50TnSUBZmKO4F2V4609y9hVJbuIKqZ7DcTPqlzIfW';
const API_URL = 'https://api.moonshot.cn/v1/chat/completions';

interface KimiMessage {
  role: 'system' | 'user';
  content: string;
}

async function callKimi(messages: KimiMessage[], maxTokens = 4000): Promise<string> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${KIMI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'moonshot-v1-128k',
      messages,
      temperature: 0.7,
      max_tokens: maxTokens
    })
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Kimi API ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

// ==================== 1. 拆书大纲 ====================
export async function analyzeBookOutline(bookTitle: string, bookContent: string) {
  const prompt = `你是一位拥有10年经验的资深图书编辑，专精于将有深度的书籍拆解成适合大众阅读、传播的内容。

## 任务
根据以下书籍内容，生成符合「有书」平台风格的拆书大纲。这是中国有书APP的内容生产标准。

## 书籍信息
书名：${bookTitle}

## 内容节选（前50%）
${bookContent.slice(0, 50000)}

## 输出格式（严格JSON）
{
  "preview": {
    "hook": "核心钩子：用一句话抓住读者注意力（100字以内）",
    "painPoint": "痛点共鸣：描述读者最常见的3个困扰（200字以内）",
    "value": "全书价值：一句话说明这本书能解决什么（100字以内）",
    "promise": "阅读承诺：给读者一个明确的收获预期（100字以内）"
  },
  "chapters": [
    {
      "day": 1,
      "title": "吸引人的小标题",
      "subtitle": "补充说明，点出核心",
      "keyPoints": ["观点1：详细解释（150字）", "观点2：详细解释（150字）", "观点3：详细解释（150字）"],
      "case": "真实或典型案例故事（300-500字，要有情节、冲突、转折、结果）",
      "dailyQuestion": "围绕本节内容的互动问题",
      "morningQuote": "书中发人深省的金句"
    }
  ],
  "summary": {
    "review": "全书回顾：用300字概括核心观点和脉络",
    "transformation": "核心转变：读者读完后会有什么改变（200字）",
    "callToAction": "行动号召：给出3个具体的下一步行动（200字）",
    "furtherReading": "延伸阅读：推荐3-5本相关书籍，每本附一句话推荐理由"
  }
}

## 要求
1. 生成至少5天的正文篇（chapters数组至少5个元素）
2. 每个章节的核心观点必须有详细解释，不能只是一句话
3. 案例要有故事性，不是干巴巴的道理
4. 风格口语化，像朋友聊天，多用"你"
5. 所有字段必须存在，不能省略
6. 必须输出纯JSON，不要任何markdown标记或其他文字`;

  const text = await callKimi([
    { role: 'system', content: 'You are a professional book editor at Youshu (有书), China\'s leading reading platform. You specialize in breaking down books into engaging, shareable content.' },
    { role: 'user', content: prompt }
  ], 8000);

  return parseJsonFromResponse(text);
}

// ==================== 2. 领读稿生成 ====================
export async function generateReadingDraft(
  bookTitle: string,
  chapter: { day: number; title: string; subtitle: string; keyPoints: string[]; case: string; dailyQuestion: string; morningQuote: string }
) {
  const prompt = `你是一位温暖、有亲和力的领读人，正在「有书」APP上为读者领读《${bookTitle}》。

## 今天的内容
Day ${chapter.day}: ${chapter.title}
副标题：${chapter.subtitle}
核心观点：
${chapter.keyPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')}

案例：${chapter.case}

每日一问：${chapter.dailyQuestion}
早安金句：${chapter.morningQuote}

## 任务
请生成一篇完整的领读稿，1500-2000字。

## 格式要求（使用Markdown）
## 开场白（100字）
- 亲切的问候，像和老朋友聊天
- 简单介绍今天读的内容

## 阅读提示（100字）
- 告知读者今天读哪部分
- 给一个小悬念

## 核心内容（1200-1500字）
对每个核心观点：
1. 先用生活化的语言引出
2. 详细展开，配具体例子
3. 与读者产生共鸣
4. 每300-500字设置一个小钩子

## 案例深化（200字）
把案例讲得更生动，加入细节和情感

## 今日一问（100字）
重新表述问题，引导读者深入思考

## 结尾（100字）
温暖的总结，预告明天内容

## 风格要求
- 口语化，像面对面聊天
- 多用"你"，制造对话感
- 避免学术化、说教语气
- 适当加入emoji增加亲和力
- 每段不要太长，适合手机阅读`;

  return callKimi([
    { role: 'system', content: '你是一位温暖、有智慧的领读人，擅长把书中的智慧用通俗易懂的语言传达给读者。你的文字有温度，像和好朋友聊天。' },
    { role: 'user', content: prompt }
  ], 4000);
}

// ==================== 3. 短视频脚本 ====================
export async function generateVideoScript(
  bookTitle: string,
  chapter: { day: number; title: string; keyPoints: string[]; case: string; morningQuote: string }
) {
  const prompt = `你是一位爆款短视频内容策划，擅长把书籍内容转化成抖音/视频号上的热门短视频。

## 书籍信息
书名：《${bookTitle}》
Day ${chapter.day}: ${chapter.title}
核心观点：${chapter.keyPoints[0]}
金句：${chapter.morningQuote}

## 任务
生成一条60秒的短视频脚本。

## 输出格式（Markdown表格）
| 时段 | 时长 | 画面描述 | 口播文案 | 字幕/特效 |
|------|------|----------|----------|-----------|
| 开场 | 0-3s | ... | ... | ... |
| 痛点 | 3-10s | ... | ... | ... |
| 转折 | 10-14s | ... | ... | ... |
| 观点 | 14-25s | ... | ... | ... |
| 案例 | 25-40s | ... | ... | ... |
| 金句 | 40-50s | ... | ... | ... |
| 行动号召 | 50-60s | ... | ... | ... |

## 要求
1. 开场必须抓人眼球（可以用反问、惊人数据、冲突场景）
2. 痛点要具体，让观众有代入感
3. 画面描述要具体，可执行
4. 口播文案控制在每段30字以内
5. 适合竖屏（9:16）拍摄
6. 输出完整表格，不要省略`;

  return callKimi([
    { role: 'system', content: '你是一位抖音爆款短视频策划，深谙短视频传播规律。你知道如何用3秒抓住注意力，如何用8秒讲清一个观点。' },
    { role: 'user', content: prompt }
  ], 3000);
}

// ==================== 4. 社群话术 ====================
export async function generateCommunityPost(
  bookTitle: string,
  chapter: { day: number; title: string; keyPoints: string[]; dailyQuestion: string; morningQuote: string }
) {
  const prompt = `你是一位社群运营专家，运营着一个20万人的读书社群。你要为今天的共读内容生成社群运营素材。

## 书籍信息
书名：《${bookTitle}》
Day ${chapter.day}: ${chapter.title}
核心观点：${chapter.keyPoints.join('；')}
每日一问：${chapter.dailyQuestion}
金句：${chapter.morningQuote}

## 任务
生成以下3条社群话术：

### 1. 早安问候（适合早上7:00发布）
- 温暖、有能量
- 引用今日金句
- 预告今天共读内容
- 80字以内

### 2. 讨论话题（适合中午12:00发布）
- 基于今日内容设计互动话题
- 能引发讨论和分享
- 带1-2个emoji
- 100字以内

### 3. 晚间反思（适合晚上21:00发布）
- 引导读者回顾今天收获
- 抛出深度思考问题
- 营造温暖的睡前氛围
- 100字以内

## 要求
- 每条话术要独立完整
- 风格亲切，像朋友对话
- 适合微信社群发布
- 直接输出3条话术，用---分隔`;

  return callKimi([
    { role: 'system', content: '你是一位有温度的社群运营专家，擅长用文字连接人心。你的话术能让读者感到被理解、被鼓励。' },
    { role: 'user', content: prompt }
  ], 2000);
}

// ==================== 5. 测试题 ====================
export async function generateQuiz(
  bookTitle: string,
  chapter: { day: number; title: string; keyPoints: string[] }
) {
  const prompt = `你是一位教育内容设计师，擅长设计既能检验学习效果、又有趣味性的测试题。

## 书籍信息
书名：《${bookTitle}》
Day ${chapter.day}: ${chapter.title}
核心观点：${chapter.keyPoints.join('；')}

## 任务
生成1道测试题。

## 输出格式（JSON）
{
  "question": "题目内容（单选题）",
  "options": ["选项A", "选项B", "选项C", "选项D"],
  "answer": 0,
  "explanation": "答案解析（为什么选这个，其他为什么错，100字）"
}

## 要求
1. 题目要围绕核心观点，不是细枝末节
2. 干扰项要有迷惑性，不能太明显
3. 解析要有教育意义
4. 纯JSON输出`;

  const text = await callKimi([
    { role: 'system', content: 'You are an educational content designer who creates engaging quiz questions that test deep understanding.' },
    { role: 'user', content: prompt }
  ], 1500);

  return parseJsonFromResponse(text);
}

// ==================== 6. 思维导图数据 ====================
export async function generateMindMapData(
  bookTitle: string,
  outline: { preview: any; chapters: any[]; summary: any }
) {
  const prompt = `你是一位信息可视化专家，擅长将复杂内容转化为清晰的思维导图结构。

## 书籍信息
书名：《${bookTitle}》

## 拆书大纲
预告篇：
- 钩子：${outline.preview.hook}
- 痛点：${outline.preview.painPoint}
- 价值：${outline.preview.value}

正文篇：
${outline.chapters.map((c, i) => `Day ${i + 1}: ${c.title} - ${c.subtitle}`).join('\n')}

总结篇：
- 回顾：${outline.summary.review}
- 转变：${outline.summary.transformation}

## 任务
生成思维导图节点数据。

## 输出格式（JSON）
{
  "nodes": [
    { "id": "root", "label": "核心主题", "x": 400, "y": 50, "color": "#2563eb" },
    { "id": "preview", "label": "预告篇", "x": 200, "y": 150, "color": "#d97706", "parent": "root" },
    { "id": "hook", "label": "核心钩子", "x": 100, "y": 250, "color": "#f59e0b", "parent": "preview" }
  ]
}

## 要求
1. 包含所有章节节点
2. 每个章节下包含3个子节点（核心观点提炼）
3. x坐标在50-750之间，y坐标按层级递增
4. 纯JSON输出`;

  const text = await callKimi([
    { role: 'system', content: 'You are an information visualization expert.' },
    { role: 'user', content: prompt }
  ], 3000);

  return parseJsonFromResponse(text);
}

// ==================== 辅助函数 ====================
function parseJsonFromResponse(text: string): any {
  try {
    // 尝试提取markdown代码块
    const codeBlock = text.match(/```(?:json)?\n?([\s\S]*?)\n?```/);
    const jsonStr = codeBlock ? codeBlock[1] : text;
    return JSON.parse(jsonStr.trim());
  } catch {
    // 如果JSON解析失败，尝试找到第一个{到最后一个}
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        // ignore
      }
    }
    throw new Error('无法解析AI返回的JSON');
  }
}

// ==================== 批量生成 ====================
export async function analyzeBookFull(bookTitle: string, bookContent: string) {
  // 1. 生成大纲
  const outline = await analyzeBookOutline(bookTitle, bookContent);

  // 2. 为每个章节生成领读稿
  const drafts: Array<{ day: number; title: string; content: string }> = [];
  for (const chapter of outline.chapters) {
    const content = await generateReadingDraft(bookTitle, chapter);
    drafts.push({ day: chapter.day, title: chapter.title, content });
  }

  // 3. 生成短视频脚本（取前3个章节）
  const scripts: Array<any> = [];
  for (let i = 0; i < Math.min(3, outline.chapters.length); i++) {
    const script = await generateVideoScript(bookTitle, outline.chapters[i]);
    scripts.push({ title: outline.chapters[i].title, scenes: parseVideoScript(script) });
  }

  // 4. 生成社群话术
  const posts: Array<any> = [];
  for (const chapter of outline.chapters) {
    const post = await generateCommunityPost(bookTitle, chapter);
    posts.push({ day: chapter.day, ...parseCommunityPost(post) });
  }

  // 5. 生成测试题
  const quizzes: Array<any> = [];
  for (const chapter of outline.chapters) {
    const quiz = await generateQuiz(bookTitle, chapter);
    quizzes.push({ day: chapter.day, ...quiz });
  }

  return { outline, drafts, scripts, posts, quizzes };
}

function parseVideoScript(text: string): Array<{ timing: string; visual: string; text: string }> {
  const scenes: Array<{ timing: string; visual: string; text: string }> = [];
  const lines = text.split('\n').filter(l => l.trim());

  for (const line of lines) {
    // 尝试匹配表格行或格式：时段 | 时长 | 画面 | 文案
    const parts = line.split('|').map(p => p.trim()).filter(p => p);
    if (parts.length >= 4) {
      scenes.push({
        timing: parts[1] || '0s',
        visual: parts[2] || '',
        text: parts[3] || ''
      });
    }
  }

  if (scenes.length === 0) {
    // 回退到简单解析
    return [
      { timing: '0-3s', visual: '开场画面', text: text.slice(0, 50) },
      { timing: '3-60s', visual: '内容展示', text: text.slice(50, 150) }
    ];
  }

  return scenes;
}

function parseCommunityPost(text: string): { morningGreeting: string; discussionTopic: string; reflectionPrompt: string } {
  const parts = text.split(/---+/).map(p => p.trim()).filter(p => p);
  return {
    morningGreeting: parts[0] || '',
    discussionTopic: parts[1] || '',
    reflectionPrompt: parts[2] || ''
  };
}
