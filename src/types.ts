/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum Difficulty {
  EASY = "Easy",
  MEDIUM = "Medium",
  HARD = "Hard"
}

export enum Language {
  ENGLISH = "English",
  HINDI = "Hindi"
}

export interface Question {
  id: string;
  quizId: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  points: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  categoryId: string; // e.g. "ssc", "current-affairs", "hindi", etc.
  examId?: string; // e.g. "ssc-gd", "rrb-group-d", etc.
  durationMinutes: number;
  difficulty: Difficulty;
  language: Language;
  questionsCount: number;
  attemptsCount: number;
  rating: number;
  tags: string[];
  isPremium?: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  iconName: string; // Lucide icon identifier
  quizCount: number;
  colorClass: string; // Tailwind color gradient class
}

export interface Exam {
  id: string;
  name: string;
  fullName: string;
  category: string;
  vacancies: string;
  lastDate: string;
  practiceUrl: string;
  colorClass: string;
  tier: string; // e.g. "Graduate", "12th Pass"
}

export interface Result {
  id: string;
  userId: string;
  quizId: string;
  quizTitle: string;
  score: number;
  totalPoints: number;
  correctAnswersCount: number;
  wrongAnswersCount: number;
  skippedCount: number;
  accuracy: number; // percentage
  timeSpentSeconds: number;
  rankPredicted?: number;
  percentile?: number;
  createdAt: string;
}

export interface Bookmark {
  id: string;
  userId: string;
  quizId: string;
  quizTitle: string;
  createdAt: string;
}

export interface LeaderboardItem {
  id: string;
  name: string;
  avatarUrl: string;
  score: number;
  accuracy: number;
  quizzesTaken: number;
  rank: number;
  badge?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  publishedAt: string;
  readTimeMinutes: number;
  views: number;
  imageUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  // New premium E-E-A-T & AdSense compliance fields
  metaTitle?: string;
  metaDescription?: string;
  featuredImagePrompt?: string;
  primaryKeyword?: string;
  secondaryKeywords?: string[];
  lsiKeywords?: string[];
  faqs?: Array<{ question: string; answer: string }>;
  author?: {
    name: string;
    role: string;
    bio: string;
    avatarUrl?: string;
  };
  lastUpdatedDate?: string;
  tableOfContents?: Array<{ id: string; text: string }>;
  relatedPosts?: string[];
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "alert";
  isRead: boolean;
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  avatarUrl: string;
  quizHistory: string[]; // Quiz IDs
  bookmarks: string[]; // Quiz IDs
  points: number;
  weeklyRank?: number;
  monthlyRank?: number;
  achievements: {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlockedAt: string;
  }[];
}
