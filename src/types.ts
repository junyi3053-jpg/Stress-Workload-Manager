/**
 * Core Domain Models & Schemas
 * 
 * DESIGNED FOR DIRECT CROSS-LANGUAGE PORTABILITY:
 * All interfaces map 1:1 to:
 * - Dart (Flutter): class Task / enum LifeCategory
 * - Swift (iOS / SwiftUI): struct Task: Identifiable, Codable / enum LifeCategory: String, Codable
 * - Kotlin (Android / Jetpack Compose): @Serializable data class Task / enum class LifeCategory
 */

export type LifeCategory = 'Mental' | 'Physical' | 'Social' | 'Errands';

export interface CategoryImpact {
  mental: number;
  physical: number;
  social: number;
  errands: number;
}

export interface SubTask {
  id: string;
  title: string;
  category: LifeCategory;
  estimatedMinutes: number;
  cortisolDelta: number; // e.g. 12 means +12 impact points
  completed: boolean;
  date?: string; // Optional user-assigned date (YYYY-MM-DD)
}

export interface Task {
  id: string;
  name: string;
  description: string;
  importance: number; // 1 to 5 scale
  dueDate: string; // ISO string 'YYYY-MM-DD'
  isRepeated?: boolean; // When true, due date is not strictly enforced
  dominantCategory: LifeCategory;
  totalMinutes: number;
  subtasks: SubTask[];
  impact: CategoryImpact;
  aiNote?: string;
  createdAt: string;
}

export type ScreenType = 
  | 'dashboard'
  | 'new_task'
  | 'breakdown_confirm'
  | 'task_detail'
  | 'health_stress'
  | 'guidance_alerts';

export interface CategoryMeta {
  name: LifeCategory;
  color: string;
  bgFaint: string;
  borderFaint: string;
  iconName: string;
}

export const CATEGORY_CONFIG: Record<LifeCategory, CategoryMeta> = {
  Mental: {
    name: 'Mental',
    color: '#7B6CC4',
    bgFaint: '#7B6CC415',
    borderFaint: '#7B6CC430',
    iconName: 'Brain',
  },
  Physical: {
    name: 'Physical',
    color: '#C68A2E',
    bgFaint: '#C68A2E15',
    borderFaint: '#C68A2E30',
    iconName: 'Zap',
  },
  Social: {
    name: 'Social',
    color: '#D9685F',
    bgFaint: '#D9685F15',
    borderFaint: '#D9685F30',
    iconName: 'Users',
  },
  Errands: {
    name: 'Errands',
    color: '#3E8E8A',
    bgFaint: '#3E8E8A15',
    borderFaint: '#3E8E8A30',
    iconName: 'CheckCircle2',
  },
};
