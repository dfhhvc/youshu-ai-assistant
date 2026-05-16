import React, { createContext, useContext, useState } from 'react';
import type { BookOutline, ReadingDraft, ShortVideoScript, CommunityPost, DemoBook } from '../types';

interface AppState {
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
  bookContent: string;
  setBookContent: (v: string) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [analyzedBook, setAnalyzedBook] = useState<DemoBook | null>(null);
  const [bookOutline, setBookOutline] = useState<BookOutline | null>(null);
  const [readingDrafts, setReadingDrafts] = useState<ReadingDraft[]>([]);
  const [videoScripts, setVideoScripts] = useState<ShortVideoScript[]>([]);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [bookContent, setBookContent] = useState('');

  return (
    <AppContext.Provider value={{
      analyzedBook, setAnalyzedBook,
      bookOutline, setBookOutline,
      readingDrafts, setReadingDrafts,
      videoScripts, setVideoScripts,
      communityPosts, setCommunityPosts,
      isAnalyzing, setIsAnalyzing,
      analysisProgress, setAnalysisProgress,
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
