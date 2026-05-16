import React, { createContext, useContext, useState, useCallback } from 'react';
import type { DemoBook, BookOutline, ReadingDraft, ShortVideoScript, CommunityPost } from '../types';

interface AppState {
  apiKey: string;
  setApiKey: (key: string) => void;
  analyzedBook: DemoBook | null;
  setAnalyzedBook: (book: DemoBook | null) => void;
  bookOutline: BookOutline | null;
  setBookOutline: (outline: BookOutline | null) => void;
  readingDrafts: ReadingDraft[];
  setReadingDrafts: (drafts: ReadingDraft[]) => void;
  videoScripts: ShortVideoScript[];
  setVideoScripts: (scripts: ShortVideoScript[]) => void;
  communityPosts: CommunityPost[];
  setCommunityPosts: (posts: CommunityPost[]) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (v: boolean) => void;
  analysisProgress: number;
  setAnalysisProgress: (v: number | ((prev: number) => number)) => void;
  useRealApi: boolean;
  bookContent: string;
  setBookContent: (v: string) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('youshu_api_key') || '');
  const [analyzedBook, setAnalyzedBook] = useState<DemoBook | null>(null);
  const [bookOutline, setBookOutline] = useState<BookOutline | null>(null);
  const [readingDrafts, setReadingDrafts] = useState<ReadingDraft[]>([]);
  const [videoScripts, setVideoScripts] = useState<ShortVideoScript[]>([]);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [bookContent, setBookContent] = useState('');

  const handleSetApiKey = useCallback((key: string) => {
    setApiKey(key);
    if (key) localStorage.setItem('youshu_api_key', key);
    else localStorage.removeItem('youshu_api_key');
  }, []);

  const useRealApi = !!apiKey;

  return (
    <AppContext.Provider value={{
      apiKey, setApiKey: handleSetApiKey,
      analyzedBook, setAnalyzedBook,
      bookOutline, setBookOutline,
      readingDrafts, setReadingDrafts,
      videoScripts, setVideoScripts,
      communityPosts, setCommunityPosts,
      isAnalyzing, setIsAnalyzing,
      analysisProgress, setAnalysisProgress,
      useRealApi,
      bookContent, setBookContent
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
