export type ThemeColor = 'emerald' | 'cyan' | 'amber' | 'pink' | 'purple';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  accentColor: ThemeColor;
  customCursor: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LessonFolder {
  id: string;
  userId: string;
  lessonId: number; // 1 to 10
  name: string;
  cardCount: number;
  lastPercentage: number | null; // null if unplayed
  lastPlayedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Flashcard {
  id: string;
  userId: string;
  folderId: string;
  lessonId: number;
  question: string;
  answer: string;
  lastResult: 'correct' | 'wrong' | 'unplayed';
  lastTimeSpentMs: number;
  playCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface BiologyLesson {
  id: number;
  number: number;
  title: string;
  englishTitle: string;
  iconName: string;
  description: string;
}

export type PlayMode = 'shuffle' | 'dateModified' | 'forgottenFirst';

export interface GameCardReviewResult {
  cardId: string;
  question: string;
  answer: string;
  isCorrect: boolean;
  timeSpentMs: number;
}

export interface GameSessionSummary {
  folderId: string;
  lessonId: number;
  folderName: string;
  totalCards: number;
  correctCount: number;
  wrongCount: number;
  percentage: number;
  cardResults: GameCardReviewResult[]; // sorted by time spent descending
}

export type SyncStatus = 'synced' | 'saving' | 'offline';

export type Screen = 
  | { type: 'home' }
  | { type: 'folders'; lessonId: number }
  | { type: 'edit'; folderId: string; lessonId: number }
  | { type: 'game_setup'; folderId: string; lessonId: number }
  | { type: 'game_play'; folderId: string; lessonId: number; playMode: PlayMode }
  | { type: 'game_result'; summary: GameSessionSummary }
  | { type: 'settings' };
