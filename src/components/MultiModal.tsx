import { useState } from 'react';
import { Video, MessageCircle, FileQuestion, Copy, Check, Film, Users, HelpCircle } from 'lucide-react';
import { shortVideoScripts, communityPosts, quizQuestions } from '../data/demoData';

type TabType = 'video' | 'community' | 'quiz';

export default function MultiModal() {
  const [activeTab, setActiveTab] = useState<TabType>('video');
  const [copiedId, setCopiedId] = useState<string>('');

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(''), 2000);
  };

  const tabs = [
    { id: 'video' as TabType, label: '短视频脚本', icon: Video },
    { id: 'community' as TabType, label: '社群话术', icon: MessageCircle },
    { id: 'quiz' as TabType, label: '测试题', icon: FileQuestion }
  ];

  return (
    <div className="animate-fade-in">
      {/* 标签切换 */}
      <div className="bg-white rounded-xl shadow-sm p-2 mb-6">
        <div className="flex gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium text-sm transition-all flex-1 justify-center ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 短视频脚本 */}
      {activeTab === 'video' && (
        <div className="space-y-4">
          {shortVideoScripts.map((script, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-4">
                <div className="flex items-center gap-3">
                  <Film className="w-5 h-5" />
                  <h3 className="font-bold">短视频脚本 {idx + 1}：{script.title}</h3>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {script.scenes.map((scene, sIdx) => (
                    <div key={sIdx} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <span className="inline-block bg-pink-100 text-pink-700 px-2 py-1 rounded text-xs font-mono">
                          {scene.timing}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">{scene.visual}</p>
                        <p className="text-gray-700">{scene.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => handleCopy(
                    script.scenes.map(s => `${s.timing}: ${s.text}`).join('\n'),
                    `video-${idx}`
                  )}
                  className="mt-4 flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
                >
                  {copiedId === `video-${idx}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiedId === `video-${idx}` ? '已复制' : '复制脚本'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 社群话术 */}
      {activeTab === 'community' && (
        <div className="space-y-4">
          {communityPosts.map((post, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-green-100 text-green-700 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                  {post.day}
                </div>
                <h3 className="font-bold text-gray-800">Day {post.day}</h3>
              </div>

              <div className="space-y-4">
                <div className="bg-amber-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-amber-600" />
                    <p className="text-xs font-semibold text-amber-700">早安问候</p>
                  </div>
                  <p className="text-gray-700">{post.morningGreeting}</p>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="w-4 h-4 text-blue-600" />
                    <p className="text-xs font-semibold text-blue-700">讨论话题</p>
                  </div>
                  <p className="text-gray-700">{post.discussionTopic}</p>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <HelpCircle className="w-4 h-4 text-purple-600" />
                    <p className="text-xs font-semibold text-purple-700">反思提示</p>
                  </div>
                  <p className="text-gray-700">{post.reflectionPrompt}</p>
                </div>
              </div>

              <button
                onClick={() => handleCopy(
                  `早安问候：${post.morningGreeting}\n\n讨论话题：${post.discussionTopic}\n\n反思提示：${post.reflectionPrompt}`,
                  `community-${idx}`
                )}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
              >
                {copiedId === `community-${idx}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedId === `community-${idx}` ? '已复制' : '复制话术'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 测试题 */}
      {activeTab === 'quiz' && (
        <div className="space-y-4">
          {quizQuestions.map((quiz, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-indigo-100 text-indigo-700 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                  {quiz.day}
                </div>
                <span className="text-xs text-gray-500">Day {quiz.day}</span>
              </div>

              <p className="text-gray-800 font-medium mb-4">{quiz.question}</p>

              <div className="space-y-2">
                {quiz.options.map((option, oIdx) => (
                  <div
                    key={oIdx}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      oIdx === quiz.answer
                        ? 'border-green-400 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        oIdx === quiz.answer
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span className="text-gray-700">{option}</span>
                      {oIdx === quiz.answer && (
                        <span className="ml-auto text-xs text-green-600 font-semibold">正确答案</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
