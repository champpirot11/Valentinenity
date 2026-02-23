
export enum Scene {
  AUTH = 'AUTH',
  SETUP = 'SETUP',
  DASHBOARD = 'DASHBOARD',
  ADMIN = 'ADMIN',
  PHOTO_GALLERY = 'PHOTO_GALLERY',
  PLAYER_LOGIN = 'PLAYER_LOGIN',
  WELCOME = 'WELCOME',
  INTRO = 'INTRO',
  QUIZ = 'QUIZ',
  MEMORY_GAME = 'MEMORY_GAME',
  SHOOTER_GAME = 'SHOOTER_GAME',
  LEVEL_UP = 'LEVEL_UP',
  GACHA = 'GACHA',
  KEEP_MEMORIES = 'KEEP_MEMORIES'
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface Gift {
  id: string;
  name: string;
  emoji?: string;
  imageUrl?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  description: string;
  message: string;
  order: number;
}

export interface AppConfig {
  adminName: string;
  dialogueEmoji: string;
  primaryColor: string;
  secondaryColor: string;
  partnerName: string;
  specialDate: string;
  hint1: string;
  hint2: string;
  questions: QuizQuestion[];
  gifts: Gift[];
  finalMessage: string;
  finalImageUrl: string;
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
