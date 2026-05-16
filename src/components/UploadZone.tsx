import { useState, useRef, useCallback } from 'react';
import { Upload, BookOpen, FileText, ChevronRight, Sparkles, Key, Link, Database, AlertTriangle, CheckCircle } from 'lucide-react';
import { demoBooks } from '../data/demoData';
import type { DemoBook } from '../types';
import { useApp } from '../context/AppContext';

interface UploadZoneProps {
  onAnalyze: (book: DemoBook) => void;
}

export default function UploadZone({ onAnalyze }: UploadZoneProps) {
  const {
    apiKey, setApiKey, setIsAnalyzing, setAnalysisProgress,
    setBookContent, useRealApi
  } = useApp();

  const [selectedBook, setSelectedBook] = useState<string>('');
  const [showApiInput, setShowApiInput] = useState(false);
  const [showYoushuInput, setShowYoushuInput] = useState(false);
  const [youshuBookId, setYoushuBookId] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    setFileName(file.name);

    if (file.type === 'text/plain') {
      const text = await file.text();
      setFileContent(text);
      setBookContent(text);
    } else if (file.type === 'application/pdf') {
      setFileContent('[PDF文件已选择，需要后端支持解析]');
      setBookContent('[PDF内容]');
    } else {
      setFileContent('[文件已选择]');
      setBookContent('[文件内容]');
    }
  }, [setBookContent]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleAnalyze = async () => {
    const book = demoBooks.find(b => b.id === selectedBook);
    if (!book && !fileName) return;

    const targetBook = book || {
      id: 'custom',
      title: fileName || '自定义书籍',
      author: '未知作者',
      cover: '📄',
      description: '用户上传的书籍'
    };

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    // 模拟进度
    const interval = setInterval(() => {
      setAnalysisProgress((prev: number) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          onAnalyze(targetBook);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 300);
  };

  const handleYoushuFetch = async () => {
    if (!youshuBookId.trim()) return;
    // 这里演示有书数据接入的接口设计
    alert(`有书数据源接入设计：\n\n实际接入时需要调用有书内部API：\nGET /api/books/{bookId}/content\n\n当前输入的书籍ID: ${youshuBookId}\n\n（需要与有书后端对接后才能真实调用）`);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      {/* API Key 设置 */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-700">Kimi API 配置</h3>
          </div>
          <button
            onClick={() => setShowApiInput(!showApiInput)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {showApiInput ? '收起' : '配置'}
          </button>
        </div>

        {showApiInput && (
          <div className="space-y-3">
            <p className="text-sm text-gray-500">
              输入Kimi API Key后，AI拆书将调用真实的大模型API生成内容，而非预置数据。
              <br />
              <span className="text-xs">Key仅存储在本地浏览器中，不会上传到服务器。</span>
            </p>
            <div className="flex gap-3">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-xxxxxxxxxxxxxxxx"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={() => { setApiKey(''); }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                清除
              </button>
            </div>
            {useRealApi ? (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="w-4 h-4" />
                已启用真实AI调用（Kimi API）
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-amber-600">
                <AlertTriangle className="w-4 h-4" />
                当前使用预置演示数据（未配置API Key）
              </div>
            )}
          </div>
        )}
      </div>

      {/* 有书数据源接入 */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-gray-700">有书数据源接入</h3>
          </div>
          <button
            onClick={() => setShowYoushuInput(!showYoushuInput)}
            className="text-sm text-green-600 hover:text-green-700"
          >
            {showYoushuInput ? '收起' : '配置'}
          </button>
        </div>

        {showYoushuInput && (
          <div className="space-y-3">
            <p className="text-sm text-gray-500">
              直接输入有书平台的书籍ID，从有书内容库获取书籍进行AI拆书。
              <br />
              <span className="text-xs">需要与有书后端API对接后生效。</span>
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                value={youshuBookId}
                onChange={(e) => setYoushuBookId(e.target.value)}
                placeholder="输入有书书籍ID，如: book_12345"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500"
              />
              <button
                onClick={handleYoushuFetch}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
              >
                <Link className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-500">
              <p className="font-semibold mb-1">接入设计（需后端对接）：</p>
              <code className="text-blue-600">GET https://api.youshu.cn/v1/books/&#123;bookId&#125;/content</code>
              <p className="mt-1">返回：书籍完整文本内容 → 传入AI拆书引擎</p>
            </div>
          </div>
        )}
      </div>

      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-3">AI智能拆书引擎</h2>
        <p className="text-gray-500">
          {useRealApi
            ? '已连接Kimi AI，将调用真实大模型生成内容'
            : '选择一本书或上传文件，AI将生成完整内容矩阵'}
        </p>
      </div>

      {/* 预置示例 */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          <h3 className="font-semibold text-gray-700">选择预置示例书籍</h3>
          <span className="text-xs text-gray-400 ml-auto">
            {useRealApi ? '(将调用AI重新生成)' : '(使用预置数据)'}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {demoBooks.map(book => (
            <div
              key={book.id}
              onClick={() => { setSelectedBook(book.id); setFileName(''); }}
              className={`border-2 rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${
                selectedBook === book.id && !fileName
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
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer ${
            dragOver
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.epub,.txt"
            onChange={handleFileInputChange}
            className="hidden"
          />
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2 font-medium">点击选择文件 或 拖拽到此处</p>
          <p className="text-xs text-gray-400 mb-4">支持 PDF / EPUB / TXT 格式</p>
          <div className="flex justify-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> PDF</span>
            <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> EPUB</span>
            <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> TXT</span>
          </div>
        </div>

        {fileName && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center gap-3">
            <FileText className="w-5 h-5 text-blue-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">{fileName}</p>
              <p className="text-xs text-gray-500">
                {fileContent ? '文件内容已读取' : '等待解析...'}
              </p>
            </div>
            <button
              onClick={() => { setFileName(''); setFileContent(''); setBookContent(''); }}
              className="text-xs text-red-500 hover:text-red-700"
            >
              移除
            </button>
          </div>
        )}
      </div>

      {/* 分析按钮 */}
      <div className="text-center">
        <button
          onClick={handleAnalyze}
          disabled={(!selectedBook && !fileName) || false}
          className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white font-semibold text-lg transition-all ${
            (selectedBook || fileName)
              ? 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          {useRealApi ? '开始AI拆书（真实API）' : '开始AI拆书（演示数据）'}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
