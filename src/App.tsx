import { useState } from 'react';
import { BookOpen, FileText, GitGraph, Layers, BarChart3, Upload } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import UploadZone from './components/UploadZone';
import BookAnalyzer from './components/BookAnalyzer';
import ReadingDraft from './components/ReadingDraft';
import MindMap from './components/MindMap';
import MultiModal from './components/MultiModal';
import EfficiencyBoard from './components/EfficiencyBoard';
import type { DemoBook } from './types';

type TabType = 'upload' | 'outline' | 'draft' | 'mindmap' | 'multimodal' | 'efficiency';

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabType>('upload');
  const { analyzedBook, setAnalyzedBook, useRealApi } = useApp();

  const handleAnalyze = async (book: DemoBook) => {
    setAnalyzedBook(book);
    setActiveTab('outline');
  };

  const tabs = [
    { id: 'upload' as TabType, label: '上传', icon: Upload },
    { id: 'outline' as TabType, label: '拆书大纲', icon: BookOpen },
    { id: 'draft' as TabType, label: '领读稿', icon: FileText },
    { id: 'mindmap' as TabType, label: '思维导图', icon: GitGraph },
    { id: 'multimodal' as TabType, label: '多模态衍生', icon: Layers },
    { id: 'efficiency' as TabType, label: '效率仪表盘', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                disabled={tab.id !== 'upload' && tab.id !== 'efficiency' && !analyzedBook}
                className={`flex items-center gap-2 px-5 py-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : tab.id !== 'upload' && tab.id !== 'efficiency' && !analyzedBook
                    ? 'border-transparent text-gray-300 cursor-not-allowed'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-6">
        {analyzedBook && activeTab !== 'upload' && activeTab !== 'efficiency' && (
          <div className="bg-blue-50 rounded-xl p-4 mb-6 flex items-center gap-4">
            <span className="text-3xl">{analyzedBook.cover}</span>
            <div>
              <h2 className="font-bold text-gray-800">{analyzedBook.title}</h2>
              <p className="text-sm text-gray-600">{analyzedBook.author}</p>
            </div>
            <span className={`ml-auto px-3 py-1 rounded-full text-xs font-semibold ${
              useRealApi ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
            }`}>
              {useRealApi ? '真实AI生成' : '演示数据'}
            </span>
          </div>
        )}

        {activeTab === 'upload' && <UploadZone onAnalyze={handleAnalyze} />}
        {activeTab === 'outline' && <BookAnalyzer />}
        {activeTab === 'draft' && <ReadingDraft />}
        {activeTab === 'mindmap' && <MindMap />}
        {activeTab === 'multimodal' && <MultiModal />}
        {activeTab === 'efficiency' && <EfficiencyBoard />}
      </main>

      <footer className="bg-white border-t mt-12">
        <div className="max-w-6xl mx-auto px-6 py-6 text-center text-sm text-gray-400">
          <p>有书AI拆书助手 · {useRealApi ? '真实Kimi API驱动' : '演示版（配置API Key后启用真实AI）'}</p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
