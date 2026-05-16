import { useState, useRef, useCallback } from 'react';
import { Upload, FileText, ChevronRight, Sparkles, Database, Link } from 'lucide-react';
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
    setBookOutline, setReadingDrafts, setVideoScripts, setCommunityPosts
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
      let content = fileContent;
      if (selectedBook && !fileContent) {
        content = `《${targetBook.title}》\n作者：${targetBook.author}\n简介：${targetBook.description}`;
      }

      setAnalysisProgress(10);
      const result = await analyzeBookFull(targetBook.title, content);
      setAnalysisProgress(90);

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

  const handleYoushuFetch = () => {
    if (!youshuBookId.trim()) return;
    alert(`有书数据源接入（需后端对接）：\n书籍ID: ${youshuBookId}\n\n实际调用: GET /api/books/${youshuBookId}/content`);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-gray-700">有书数据源接入</h3>
          </div>
          <button onClick={() => setShowYoushuInput(!showYoushuInput)} className="text-sm text-green-600">
            {showYoushuInput ? '收起' : '配置'}
          </button>
        </div>
        {showYoushuInput && (
          <div className="space-y-3">
            <div className="flex gap-3">
              <input type="text" value={youshuBookId} onChange={(e) => setYoushuBookId(e.target.value)}
                placeholder="有书书籍ID" className="flex-1 px-4 py-2 border rounded-lg text-sm" />
              <button onClick={handleYoushuFetch} className="px-4 py-2 bg-green-600 text-white rounded-lg"><Link className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>

      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-3">AI智能拆书引擎</h2>
        <p className="text-gray-500">选择一本书或上传文件，Kimi AI将实时生成完整内容矩阵</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          <h3 className="font-semibold text-gray-700">选择书籍</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {demoBooks.map(book => (
            <div key={book.id} onClick={() => { setSelectedBook(book.id); setFileName(''); setError(''); }}
              className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${selectedBook === book.id && !fileName ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
              <div className="text-4xl mb-2">{book.cover}</div>
              <h4 className="font-bold text-gray-800 mb-1">{book.title}</h4>
              <p className="text-xs text-gray-500">{book.author}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <div onClick={() => fileInputRef.current?.click()} onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}>
          <input ref={fileInputRef} type="file" accept=".txt" onChange={handleFileInputChange} className="hidden" />
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">点击选择文件 或 拖拽到此处</p>
          <p className="text-xs text-gray-400 mt-2">支持 TXT 格式</p>
        </div>
        {fileName && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center gap-3">
            <FileText className="w-5 h-5 text-blue-600" />
            <div className="flex-1">
              <p className="text-sm font-medium">{fileName}</p>
              <p className="text-xs text-gray-500">已读取 {fileContent.length} 字符</p>
            </div>
            <button onClick={() => { setFileName(''); setFileContent(''); setBookContent(''); }} className="text-xs text-red-500">移除</button>
          </div>
        )}
      </div>

      {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700 text-sm">{error}</div>}

      <div className="text-center">
        <button onClick={handleAnalyze} disabled={!selectedBook && !fileName}
          className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white font-semibold text-lg ${(selectedBook || fileName) ? 'bg-blue-600 hover:bg-blue-700 shadow-lg' : 'bg-gray-400 cursor-not-allowed'}`}>
          <Sparkles className="w-5 h-5" />开始AI拆书（真实Kimi API）<ChevronRight className="w-5 h-5" />
        </button>
        <p className="text-xs text-gray-400 mt-3">分析约30-60秒，将调用Kimi大模型实时生成</p>
      </div>
    </div>
  );
}
