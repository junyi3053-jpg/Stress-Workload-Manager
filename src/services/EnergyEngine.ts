/**
 * Energy & Workload Calculation Engine
 * 
 * DESIGNED FOR EASY CROSS-LANGUAGE PORTABILITY:
 * This domain logic uses pure functions with primitive inputs and outputs.
 * Direct conversion targets:
 * - Dart (Flutter): energy_engine.dart
 * - Swift (iOS): EnergyEngine.swift
 * - Kotlin (Android): EnergyEngine.kt
 */

import { CategoryImpact, LifeCategory, SubTask, Task } from '../types';

export interface DailyLoadPercentages {
  mental: number;
  physical: number;
  social: number;
  errands: number;
}

export class EnergyEngine {
  // Baseline student reserves (points capacity)
  private static readonly MENTAL_CAPACITY = 65;
  private static readonly PHYSICAL_CAPACITY = 50;
  private static readonly SOCIAL_CAPACITY = 45;
  private static readonly ERRANDS_CAPACITY = 50;

  // Baseline resting student background stress
  private static readonly BASELINE_MENTAL = 15;
  private static readonly BASELINE_PHYSICAL = 10;
  private static readonly BASELINE_SOCIAL = 5;
  private static readonly BASELINE_ERRANDS = 12;

  public static readonly CAPACITIES = {
    mental: 65,
    physical: 50,
    social: 45,
    errands: 50,
  };

  /**
   * Calculates dynamic ring meter percentages (0 - 100) based on remaining incomplete tasks
   */
  public static calculateRingPercentages(tasks: Task[]): DailyLoadPercentages {
    const raw = this.calculateRingPoints(tasks);
    return {
      mental: Math.min(100, Math.max(0, Math.round((raw.mental / this.CAPACITIES.mental) * 100))),
      physical: Math.min(100, Math.max(0, Math.round((raw.physical / this.CAPACITIES.physical) * 100))),
      social: Math.min(100, Math.max(0, Math.round((raw.social / this.CAPACITIES.social) * 100))),
      errands: Math.min(100, Math.max(0, Math.round((raw.errands / this.CAPACITIES.errands) * 100))),
    };
  }

  /**
   * Calculates dynamic ring meter raw points based on remaining incomplete tasks
   */
  public static calculateRingPoints(tasks: Task[]): DailyLoadPercentages {
    let rawMental = this.BASELINE_MENTAL;
    let rawPhysical = this.BASELINE_PHYSICAL;
    let rawSocial = this.BASELINE_SOCIAL;
    let rawErrands = this.BASELINE_ERRANDS;

    for (const task of tasks) {
      // Incomplete ratio adjusts load
      const incompleteCount = task.subtasks.filter((s) => !s.completed).length;
      const ratio = task.subtasks.length > 0 ? incompleteCount / task.subtasks.length : 1;

      rawMental += (task.impact.mental || 0) * ratio;
      rawPhysical += (task.impact.physical || 0) * ratio;
      rawSocial += (task.impact.social || 0) * ratio;
      rawErrands += (task.impact.errands || 0) * ratio;
    }

    return {
      mental: Math.round(rawMental),
      physical: Math.round(rawPhysical),
      social: Math.round(rawSocial),
      errands: Math.round(rawErrands),
    };
  }

  /**
   * Evaluates urgency state for a due date string
   */
  public static evaluateUrgency(dueDateString: string): { label: string; isUrgent: boolean; isOverdue: boolean } {
    if (!dueDateString) {
      return { label: 'No date', isUrgent: false, isOverdue: false };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const parts = dueDateString.split('-');
    let targetDate: Date;

    if (parts.length === 3) {
      targetDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    } else {
      targetDate = new Date(dueDateString);
    }

    if (isNaN(targetDate.getTime())) {
      return { label: dueDateString, isUrgent: false, isOverdue: false };
    }

    targetDate.setHours(0, 0, 0, 0);
    const diffDays = Math.round((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { label: `Overdue by ${Math.abs(diffDays)}d`, isUrgent: true, isOverdue: true };
    } else if (diffDays === 0) {
      return { label: 'Due today', isUrgent: true, isOverdue: false };
    } else if (diffDays === 1) {
      return { label: 'Due tomorrow', isUrgent: false, isOverdue: false };
    } else if (diffDays <= 6) {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return { label: `Due ${days[targetDate.getDay()]}`, isUrgent: false, isOverdue: false };
    } else {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return { label: `${months[targetDate.getMonth()]} ${targetDate.getDate()}`, isUrgent: false, isOverdue: false };
    }
  }

  /**
   * Sorts task collection by mobile urgency priorities:
   * 1. Overdue and Due Today
   * 2. Chronological Due Dates
   */
  public static sortTasksByUrgency(tasks: Task[]): Task[] {
    return [...tasks].sort((a, b) => {
      const aUrgency = this.evaluateUrgency(a.dueDate);
      const bUrgency = this.evaluateUrgency(b.dueDate);

      if (aUrgency.isUrgent && !bUrgency.isUrgent) return -1;
      if (!aUrgency.isUrgent && bUrgency.isUrgent) return 1;

      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  }

  /**
   * Aggregates category impact from subtasks
   */
  public static aggregateSubtaskImpact(subtasks: SubTask[]): CategoryImpact {
    const impact: CategoryImpact = { mental: 0, physical: 0, social: 0, errands: 0 };
    for (const step of subtasks) {
      const key = step.category.toLowerCase() as keyof CategoryImpact;
      impact[key] = (impact[key] || 0) + (step.cortisolDelta || 0);
    }
    return impact;
  }

  /**
   * Finds dominant category from impact totals
   */
  public static getDominantCategory(impact: CategoryImpact): LifeCategory {
    const categories: LifeCategory[] = ['Mental', 'Physical', 'Social', 'Errands'];
    let dominant: LifeCategory = 'Mental';
    let maxVal = -1;

    for (const cat of categories) {
      const key = cat.toLowerCase() as keyof CategoryImpact;
      const val = impact[key] || 0;
      if (val > maxVal) {
        maxVal = val;
        dominant = cat;
      }
    }
    return dominant;
  }
}
