import { useState } from 'react';
import { BookOpen, Copy, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { readingDrafts as defaultDrafts } from '../data/demoData';
import { useApp } from '../context/AppContext';

export default function ReadingDraft() {
  const [currentDay, setCurrentDay] = useState(1);
  const [copied, setCopied] = useState(false);
  const { readingDrafts } = useApp();

  const drafts = readingDrafts.length > 0 ? readingDrafts : defaultDrafts;
  const draft = drafts.find(d => d.day === currentDay);
  const totalDays = drafts.length;

  const handleCopy = () => {
    if (!draft) return;
    navigator.clipboard.writeText(draft.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!draft) return null;

  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentDay(prev => Math.max(1, prev - 1))}
            disabled={currentDay === 1}
            className="flex items-center gap-1 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            上一天
          </button>

          <div className="flex items-center gap-2">
            {drafts.map(d => (
              <button
                key={d.day}
                onClick={() => setCurrentDay(d.day)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  currentDay === d.day
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {d.day}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentDay(prev => Math.min(totalDays, prev + 1))}
            disabled={currentDay === totalDays}
            className="flex items-center gap-1 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            下一天
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5" />
            <div>
              <h3 className="font-bold">Day {draft.day}：{draft.title}</h3>
              <p className="text-xs text-blue-100">
                {readingDrafts.length > 0 ? 'AI实时生成' : '预置演示稿'}
              </p>
            </div>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? '已复制' : '复制全文'}
          </button>
        </div>

        <div className="p-6">
          <div className="prose prose-blue max-w-none">
            {draft.content.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={idx} className="text-xl font-bold text-blue-800 mt-6 mb-3">
                    {paragraph.replace('## ', '')}
                  </h2>
                );
              }
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={idx} className="text-lg font-semibold text-gray-800 mt-4 mb-2">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('> ')) {
                return (
                  <blockquote key={idx} className="border-l-4 border-blue-400 bg-blue-50 pl-4 py-2 my-3 italic text-gray-700">
                    {paragraph.replace('> ', '')}
                  </blockquote>
                );
              }
              if (paragraph.startsWith('- ')) {
                return (
                  <ul key={idx} className="list-disc list-inside my-2 space-y-1">
                    {paragraph.split('\n').map((item, i) => (
                      <li key={i} className="text-gray-700">{item.replace('- ', '')}</li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={idx} className="text-gray-700 leading-relaxed my-2">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
