export interface BookOutline {
  preview: {
    hook: string;
    painPoint: string;
    value: string;
    promise: string;
  };
  chapters: Chapter[];
  summary: {
    review: string;
    transformation: string;
    callToAction: string;
    furtherReading: string;
  };
}

export interface Chapter {
  day: number;
  title: string;
  subtitle: string;
  keyPoints: string[];
  case: string;
  dailyQuestion: string;
  morningQuote: string;
}

export interface ReadingDraft {
  day: number;
  title: string;
  content: string;
}

export interface ShortVideoScript {
  title: string;
  scenes: {
    timing: string;
    visual: string;
    text: string;
  }[];
}

export interface CommunityPost {
  day: number;
  morningGreeting: string;
  discussionTopic: string;
  reflectionPrompt: string;
}

export interface DemoBook {
  id: string;
  title: string;
  author: string;
  cover: string;
  description: string;
}
