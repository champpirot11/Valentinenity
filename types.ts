
export enum Scene {
  WELCOME = 'WELCOME',
  LOGIN = 'LOGIN',
  INTRO = 'INTRO',
  QUIZ = 'QUIZ',
  MEMORY_GAME = 'MEMORY_GAME',
  SHOOTER_GAME = 'SHOOTER_GAME',
  LEVEL_UP = 'LEVEL_UP',
  GACHA = 'GACHA',
  KEEP_MEMORIES = 'KEEP_MEMORIES',
  ADMIN = 'ADMIN',
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface AppConfig {
  adminName: string;
  dialogueEmoji: string;
  primaryColor: string; // Tailwind color name like 'green', 'pink', 'blue'
  secondaryColor: string;
  partnerName: string;
  specialDate: string; // สำหรับ Hint ในหน้า Login
  questions: QuizQuestion[];
}

export interface GachaItem {
  text: string;
  rarity: 'COMMON' | 'RARE' | 'LEGENDARY' | 'SPECIAL';
  icon?: string;
}

export type MemoryCard = {
  id: number;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
};
