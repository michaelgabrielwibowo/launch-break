/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: "Article" | "Book" | "Research Paper" | "Video Course" | "Lab";
  category: string; // e.g., "Machine Learning", "Mathematics", "Python"
  estimatedTime: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  prerequisites?: string;
  sourceUrl?: string; // Hotlink or PDF preview simulator code
  accentColor?: string; // e.g., border color
  isSaved?: boolean;
}

export interface TaskItem {
  id: string;
  title: string;
  completed: boolean;
}

export interface TopicTrack {
  id: string;
  title: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  estimatedTime: string;
  prerequisites: string;
  rating: number; // 1-5 star confidence or interest level
  tasks: TaskItem[];
  resources: Resource[];
}

export interface ActiveCourse {
  id: string;
  title: string;
  type: string;
  level: string;
  description: string;
  progressPercent: number;
  timeRemaining: string;
  currentModule: string;
  accentColor: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
  isPro: boolean;
  readingTimes?: Record<string, number>;
  streakCount?: number;
  lastActiveDate?: string;
  claimedRewardDays?: number;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
}
