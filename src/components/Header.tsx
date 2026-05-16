import { BookOpen, Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">有书AI拆书助手</h1>
            <p className="text-xs text-blue-100">上传一本书，30秒生成完整内容矩阵</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Sparkles className="w-4 h-4 text-yellow-300" />
          <span>AI驱动</span>
        </div>
      </div>
    </header>
  );
}
