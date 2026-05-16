import { useState, useRef, useCallback } from 'react';
import { Upload, BookOpen, FileText, ChevronRight, Sparkles, Database, Link } from 'lucide-react';
import { demoBooks } from '../data/demoData';
import type { DemoBook } from '../types';
import { useApp } from '../context/AppContext';
import { analyzeBookFull } from '../utils/kimiApi';

interface UploadZoneProps {
  onAnalyze: (book: DemoBook) => void;
}

export default function UploadZone({ onAnalyze }: UploadZoneProps) {
  const {
    setIsAnalyzing, setAnalysisProgress, setBookContent,
    setBookOutline, setReadingDrafts, setVideoScripts,
    setCommunityPosts
  } = useApp();

  const [selectedBook, setSelectedBook] = useState<string>('');
  const [showYoushuInput, setShowYoushuInput] = useState(false);
  const [youshuBookId, setYoushuBookId] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    setFileName(file.name);
    setError('');

    if (file.type === 'text/plain') {
      const text = await file.text();
      setFileContent(text);
      setBookContent(text);
    } else {
      setFileContent('[PDF/EPUB需要后端解析]');
      setBookContent('[文件已上传]');
    }
  }, [setBookContent]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleAnalyze = async () => {
    setError('');
    const book = demoBooks.find(b => b.id === selectedBook);
    if (!book && !fileName) return;

    const targetBook = book || {
      id: 'custom',
      title: fileName.replace(/\.[^.]+$/, '') || '自定义书籍',
      author: '未知作者',
      cover: '📄',
      description: '用户上传的书籍'
    };

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    try {
      // 获取书籍内容
      let content = fileContent;
      if (selectedBook && !fileContent) {
        // 预置书籍使用demoData中的内容作为基础
        content = `《${targetBook.title}》\n作者：${targetBook.author}\n简介：${targetBook.description}`;
      }

      setAnalysisProgress(10);

      // 调用Kimi API进行完整分析
      const result = await analyzeBookFull(targetBook.title, content);

      setAnalysisProgress(90);

      // 保存结果到全局状态
      setBookOutline(result.outline);
      setReadingDrafts(result.drafts.map((d: any) => ({
        day: d.day,
        title: d.title,
        content: d.content
      })));
      setVideoScripts(result.scripts);
      setCommunityPosts(result.posts);

      setAnalysisProgress(100);
      setIsAnalyzing(false);
      onAnalyze(targetBook);
    } catch (err: any) {
      setError(err.message || '分析失败，请重试');
      setIsAnalyzing(false);
      setAnalysisProgress(0);
    }
  };

  const handleYoushuFetch = async () => {
    if (!youshuBookId.trim()) return;
    alert(`有书数据源接入（需后端对接）：\n书籍ID: ${youshuBookId}\n\n实际调用: GET /api/books/${youshuBookId}/content`);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
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
              输入有书平台书籍ID，直接从有书内容库获取书籍进行AI拆书。
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                value={youshuBookId}
                onChange={(e) => setYoushuBookId(e.target.value)}
                placeholder="有书书籍ID，如: book_12345"
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
              <code className="text-blue-600">GET /api/books/{'{bookId}'}/content</code>
            </div>
          </div>
        )}
      </div>

      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-3">AI智能拆书引擎</h2>
        <p className="text-gray-500">
          选择一本书或上传文件，Kimi AI将实时生成完整内容矩阵
        </p>
      </div>

      {/* 预置示例 */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          <h3 className="font-semibold text-gray-700">选择书籍</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {demoBooks.map(book => (
            <div
              key={book.id}
              onClick={() => { setSelectedBook(book.id); setFileName(''); setError(''); }}
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
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          className={`border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer ${
            dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt"
            onChange={handleFileInputChange}
            className="hidden"
          />
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2 font-medium">点击选择文件 或 拖拽到此处</p>
          <p className="text-xs text-gray-400">支持 TXT 格式（PDF/EPUB需后端支持）</p>
          <div className="flex justify-center gap-4 mt-4 text-xs text-gray-400">
            <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> TXT</span>
          </div>
        </div>

        {fileName && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center gap-3">
            <FileText className="w-5 h-5 text-blue-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">{fileName}</p>
              <p className="text-xs text-gray-500">已读取 {fileContent.length} 字符</p>
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

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* 分析按钮 */}
      <div className="text-center">
        <button
          onClick={handleAnalyze}
          disabled={!selectedBook && !fileName}
          className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white font-semibold text-lg transition-all ${
            (selectedBook || fileName)
              ? 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          开始AI拆书（真实Kimi API）
          <ChevronRight className="w-5 h-5" />
        </button>
        <p className="text-xs text-gray-400 mt-3">
          分析过程约30-60秒，将调用Kimi大模型实时生成内容
        </p>
      </div>
    </div>
  );
}
