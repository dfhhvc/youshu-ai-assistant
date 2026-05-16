import { useState } from 'react';
import { Upload, BookOpen, FileText, ChevronRight, Sparkles } from 'lucide-react';
import { demoBooks } from '../data/demoData';
import type { DemoBook } from '../types';

interface UploadZoneProps {
  onAnalyze: (book: DemoBook) => void;
}

export default function UploadZone({ onAnalyze }: UploadZoneProps) {
  const [selectedBook, setSelectedBook] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleAnalyze = () => {
    const book = demoBooks.find(b => b.id === selectedBook);
    if (!book) return;

    setIsAnalyzing(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          onAnalyze(book);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 300);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-3">AI智能拆书引擎</h2>
        <p className="text-gray-500">选择一本书，AI将在30秒内生成拆书大纲、领读稿、思维导图等全套内容</p>
      </div>

      {/* 预置示例 */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          <h3 className="font-semibold text-gray-700">选择预置示例书籍</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {demoBooks.map(book => (
            <div
              key={book.id}
              onClick={() => setSelectedBook(book.id)}
              className={`border-2 rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${
                selectedBook === book.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="text-4xl mb-2">{book.cover}</div>
              <h4 className="font-bold text-gray-800 mb-1">{book.title}</h4>
              <p className="text-xs text-gray-500 mb-2">{book.author}</p>
              <p className="text-xs text-gray-400 line-clamp-2">{book.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 上传区域 */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:border-blue-400 transition-colors">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">拖拽PDF/EPUB/TXT文件到此处</p>
          <p className="text-xs text-gray-400">或点击选择文件（演示模式暂不支持真实上传）</p>
          <div className="flex justify-center gap-4 mt-4 text-xs text-gray-400">
            <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> PDF</span>
            <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> EPUB</span>
            <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> TXT</span>
          </div>
        </div>
      </div>

      {/* 分析按钮 */}
      <div className="text-center">
        <button
          onClick={handleAnalyze}
          disabled={!selectedBook || isAnalyzing}
          className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white font-semibold text-lg transition-all ${
            selectedBook && !isAnalyzing
              ? 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {isAnalyzing ? (
            <>
              <Sparkles className="w-5 h-5 animate-spin" />
              AI正在拆书中...
            </>
          ) : (
            <>
              开始AI拆书
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>

      {/* 进度条 */}
      {isAnalyzing && (
        <div className="mt-6 max-w-md mx-auto">
          <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <p className="text-center text-sm text-gray-500 mt-2">
            {progress < 30 && '正在解析书籍结构...'}
            {progress >= 30 && progress < 60 && '正在提取核心观点...'}
            {progress >= 60 && progress < 90 && '正在生成领读内容...'}
            {progress >= 90 && '即将完成...'}
          </p>
        </div>
      )}
    </div>
  );
}
