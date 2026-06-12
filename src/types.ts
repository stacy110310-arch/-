/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type MoodType = 'happy' | 'calm' | 'sad' | 'angry' | 'anxious';

export interface MoodConfig {
  type: MoodType;
  label: string;
  emoji: string;
  color: string;
  bgClass: string;
  borderColor: string;
  textClass: string;
  xpEffect: number; // Positive for happy/calm, negative/neutral for others
}

export const MOOD_DEFINITIONS: Record<MoodType, MoodConfig> = {
  happy: {
    type: 'happy',
    label: '開心',
    emoji: '😸',
    color: '#FF6B8B',
    bgClass: 'bg-rose-50 hover:bg-rose-100 active:bg-rose-200',
    borderColor: 'border-rose-400',
    textClass: 'text-rose-600',
    xpEffect: 15,
  },
  calm: {
    type: 'calm',
    label: '平靜',
    emoji: '🍵',
    color: '#4DABF7',
    bgClass: 'bg-sky-50 hover:bg-sky-100 active:bg-sky-200',
    borderColor: 'border-sky-400',
    textClass: 'text-sky-600',
    xpEffect: 10,
  },
  anxious: {
    type: 'anxious',
    label: '焦慮',
    emoji: '🌀',
    color: '#FCC419',
    bgClass: 'bg-amber-50 hover:bg-amber-100 active:bg-amber-200',
    borderColor: 'border-amber-400',
    textClass: 'text-amber-700',
    xpEffect: 2,
  },
  angry: {
    type: 'angry',
    label: '生氣',
    emoji: '💢',
    color: '#FF922B',
    bgClass: 'bg-orange-50 hover:bg-orange-100 active:bg-orange-200',
    borderColor: 'border-orange-400',
    textClass: 'text-orange-600',
    xpEffect: 0,
  },
  sad: {
    type: 'sad',
    label: '難過',
    emoji: '💧',
    color: '#3B5BDB',
    bgClass: 'bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200',
    borderColor: 'border-indigo-400',
    textClass: 'text-indigo-600',
    xpEffect: -5,
  }
};

export interface MoodLog {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  mood: MoodType;
  note: string;
  tags: string[];
  xpGained: number;
}

export type PetType = 'slime' | 'cat' | 'dino';

export interface PetState {
  name: string;
  type: PetType;
  level: number;
  xp: number;
  energy: number;     // 0 - 100
  fullness: number;   // 0 - 100
  love: number;       // 0 - 100
  cleanliness: number; // 0 - 100
  lastInteracted: string; // timestamp
}

export interface TagOption {
  label: string;
  category: 'work' | 'health' | 'life' | 'social' | 'emotion';
}

export const TAG_OPTIONS: TagOption[] = [
  { label: '運動健身', category: 'health' },
  { label: '睡眠充足', category: 'health' },
  { label: '美食享受', category: 'life' },
  { label: '大自然', category: 'life' },
  { label: '朋友聚會', category: 'social' },
  { label: '家庭時光', category: 'social' },
  { label: '工作順利', category: 'work' },
  { label: '學習進度', category: 'work' },
  { label: '購物放鬆', category: 'life' },
  { label: '自理清潔', category: 'health' },
  { label: '追劇看書', category: 'life' },
  { label: '感到疲憊', category: 'emotion' },
];
