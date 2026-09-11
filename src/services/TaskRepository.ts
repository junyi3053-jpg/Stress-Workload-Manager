/**
 * Task Repository & Persistence Service
 * 
 * DESIGNED FOR EASY CROSS-LANGUAGE PORTABILITY:
 * Mirrors standard mobile persistence patterns (Room in Android/Kotlin,
 * CoreData / SwiftData in iOS/Swift, SharedPreferences / SQLite / Hive in Flutter).
 */

import { Task, SubTask } from '../types';
import { INITIAL_TASKS } from '../data/initialTasks';

export class TaskRepository {
  private static readonly STORAGE_KEY = 'swm_student_tasks_v1';

  /**
   * Load tasks from local persistence
   */
  public static loadTasks(): Task[] {
    try {
      const serialized = localStorage.getItem(this.STORAGE_KEY);
      if (serialized) {
        const parsed = JSON.parse(serialized);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error loading persisted tasks, falling back to initial data', e);
    }
    return INITIAL_TASKS;
  }

  /**
   * Save tasks to local persistence
   */
  public static saveTasks(tasks: Task[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error('Error saving tasks to persistence', e);
    }
  }

  /**
   * Reset to initial sample student dataset
   */
  public static getSampleTasks(): Task[] {
    return JSON.parse(JSON.stringify(INITIAL_TASKS));
  }

  /**
   * Toggle a subtask completion status immutably
   */
  public static toggleSubtask(tasks: Task[], taskId: string, subtaskId: string): Task[] {
    return tasks.map((task) => {
      if (task.id !== taskId) return task;
      const updatedSubtasks: SubTask[] = task.subtasks.map((step) =>
        step.id === subtaskId ? { ...step, completed: !step.completed } : step
      );
      return { ...task, subtasks: updatedSubtasks };
    });
  }

  /**
   * Remove a task by ID immutably
   */
  public static deleteTask(tasks: Task[], taskId: string): Task[] {
    return tasks.filter((t) => t.id !== taskId);
  }

  /**
   * Add a new task immutably at the top
   */
  public static addTask(tasks: Task[], newTask: Task): Task[] {
    return [newTask, ...tasks];
  }
}
