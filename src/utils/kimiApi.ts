import type { BookOutline } from '../types';

const API_URL = 'https://api.moonshot.cn/v1/chat/completions';

export async function analyzeBook(apiKey: string, title: string, content: string): Promise<BookOutline> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'moonshot-v1-128k',
      messages: [
        { role: 'system', content: 'You are a professional book analyst. Analyze the book and return a structured outline in JSON format.' },
        { role: 'user', content: `Analyze this book and return JSON with fields: preview (hook, painPoint, value, promise), chapters (array of day, title, subtitle, keyPoints, case, dailyQuestion, morningQuote), summary (review, transformation, callToAction, furtherReading). Book title: ${title}. Content: ${content.slice(0, 50000)}` }
      ],
      temperature: 0.7
    })
  });

  if (!response.ok) throw new Error(`API error: ${response.status}`);
  const data = await response.json();
  const text = data.choices[0]?.message?.content || '';

  try {
    const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text);
    return normalizeOutline(parsed);
  } catch {
    throw new Error('Failed to parse AI response');
  }
}

function normalizeOutline(parsed: any): BookOutline {
  const chapters = (parsed.chapters || parsed.正文篇 || []).map((ch: any, i: number) => ({
    day: ch.day || i + 1,
    title: ch.title || ch.标题 || `Day ${i + 1}`,
    subtitle: ch.subtitle || ch.副标题 || '',
    keyPoints: Array.isArray(ch.keyPoints || ch.核心观点) ? (ch.keyPoints || ch.核心观点) : [(ch.keyPoints || ch.核心观点 || '')],
    case: ch.case || ch.案例 || '',
    dailyQuestion: ch.dailyQuestion || ch.每日一问 || '',
    morningQuote: ch.morningQuote || ch.早安金句 || ''
  }));

  return {
    preview: {
      hook: parsed.preview?.hook || parsed.预告篇?.核心钩子 || '',
      painPoint: parsed.preview?.painPoint || parsed.预告篇?.痛点共鸣 || '',
      value: parsed.preview?.value || parsed.预告篇?.全书价值 || '',
      promise: parsed.preview?.promise || parsed.预告篇?.阅读承诺 || ''
    },
    chapters: chapters.length > 0 ? chapters : [],
    summary: {
      review: parsed.summary?.review || parsed.总结篇?.全书回顾 || '',
      transformation: parsed.summary?.transformation || parsed.总结篇?.核心转变 || '',
      callToAction: parsed.summary?.callToAction || parsed.总结篇?.行动号召 || '',
      furtherReading: parsed.summary?.furtherReading || parsed.总结篇?.延伸阅读 || ''
    }
  };
}
