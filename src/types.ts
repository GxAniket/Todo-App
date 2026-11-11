export type ThemeId = 'dark' | 'light' | 'galaxy';
export type TimerMode = 'focus' | 'short' | 'long';
export type CursorStyle = 'default' | 'arc' | 'celebration' | 'gyroscope';

export interface AppTheme {
  id: ThemeId;
  name: string;
  description: string;
  emoji: string;
  bg: string;
  sidebarBg: string;
  cardBg: string;
  cardBorder: string;
  accent1: string;
  accent2: string;
  accent3: string;
  textPrimary: string;
  textSecondary: string;
  glow: string;
  gradientText: string;
}

export type Priority = 'low' | 'medium' | 'high';
export type NavItem = 'home' | 'today' | 'week' | 'month' | 'study' | 'important' | 'completed' | 'trash' | 'settings';

export interface Task {
  id: string;
  title: string;
  date: string;
  time: string;
  priority: Priority;
  completed: boolean;
  deleted: boolean;
  important: boolean;
  createdAt: string;
}

export interface StudySession {
  id: string;
  subject: string;
  plannedDuration: number;
  actualDuration: number;
  completed: boolean;
  date: string;
}

export interface Subject {
  id: string;
  name: string;
  color: string;
  totalHours: number;
  targetHours: number;
}
