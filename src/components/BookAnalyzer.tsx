import { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Lightbulb, HelpCircle, Star } from 'lucide-react';
import { bookOutline as defaultOutline } from '../data/demoData';
import { useApp } from '../context/AppContext';

export default function BookAnalyzer() {
  const { bookOutline } = useApp();
  const [expandedDays, setExpandedDays] = useState<number[]>([1]);

  const outline = bookOutline || defaultOutline;

  const toggleDay = (day: number) => {
    setExpandedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  return (
    <div className="animate-fade-in">
      {/* 预告篇 */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 mb-6 border border-amber-200">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-amber-600" />
          <h3 className="font-bold text-amber-800 text-lg">预告篇</h3>
        </div>
        <div className="space-y-3">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-xs font-semibold text-amber-600 mb-1">核心钩子</p>
            <p className="text-gray-700">{outline.preview.hook}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-xs font-semibold text-amber-600 mb-1">痛点共鸣</p>
            <p className="text-gray-700">{outline.preview.painPoint}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-xs font-semibold text-amber-600 mb-1">全书价值</p>
            <p className="text-gray-700">{outline.preview.value}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-xs font-semibold text-amber-600 mb-1">阅读承诺</p>
            <p className="text-gray-700">{outline.preview.promise}</p>
          </div>
        </div>
      </div>

      {/* 正文篇 */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-blue-800 text-lg">正文篇（{outline.chapters.length}天）</h3>
        </div>
        <div className="space-y-3">
          {outline.chapters.map(chapter => (
            <div
              key={chapter.day}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => toggleDay(chapter.day)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                    {chapter.day}
                  </span>
                  <div className="text-left">
                    <p className="font-semibold text-gray-800">{chapter.title}</p>
                    <p className="text-xs text-gray-500">{chapter.subtitle}</p>
                  </div>
                </div>
                {expandedDays.includes(chapter.day) ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {expandedDays.includes(chapter.day) && (
                <div className="px-4 pb-4 space-y-3">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="w-4 h-4 text-blue-600" />
                      <p className="text-xs font-semibold text-blue-700">核心观点</p>
                    </div>
                    <ul className="space-y-1">
                      {chapter.keyPoints.map((point, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">•</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-gray-600 mb-1">案例</p>
                    <p className="text-sm text-gray-700">{chapter.case}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-purple-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <HelpCircle className="w-4 h-4 text-purple-600" />
                        <p className="text-xs font-semibold text-purple-700">每日一问</p>
                      </div>
                      <p className="text-sm text-gray-700">{chapter.dailyQuestion}</p>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Star className="w-4 h-4 text-yellow-600" />
                        <p className="text-xs font-semibold text-yellow-700">早安金句</p>
                      </div>
                      <p className="text-sm text-gray-700 italic">{chapter.morningQuote}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 总结篇 */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-green-600" />
          <h3 className="font-bold text-green-800 text-lg">总结篇</h3>
        </div>
        <div className="space-y-3">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-xs font-semibold text-green-600 mb-1">全书回顾</p>
            <p className="text-gray-700">{outline.summary.review}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-xs font-semibold text-green-600 mb-1">核心转变</p>
            <p className="text-gray-700">{outline.summary.transformation}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-xs font-semibold text-green-600 mb-1">行动号召</p>
            <p className="text-gray-700">{outline.summary.callToAction}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-xs font-semibold text-green-600 mb-1">延伸阅读</p>
            <p className="text-gray-700">{outline.summary.furtherReading}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
