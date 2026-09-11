/**
 * AI Task Prediction & Decomposition Logic
 * 
 * CROSS-LANGUAGE CONVERSION NOTES:
 * This module is designed with zero framework dependencies for seamless porting:
 * - Dart (Flutter): class AIBreakdownService / Map<String, dynamic> or custom DTOs
 * - Swift (iOS / SwiftUI): struct AIBreakdownService / enum or Codable structs
 * - Kotlin (Android / Compose): object AIBreakdownService / data class PredictionResult
 * All heuristics and regex patterns are standard across PCRE, ECMAScript, and JVM regex.
 */

import { CategoryImpact, LifeCategory, SubTask } from '../types';

export interface PredictionResult {
  impact: CategoryImpact;
  note: string;
}

export function predictTaskImpact(
  name: string,
  description: string,
  importance: number = 3
): PredictionResult {
  const combined = (name + ' ' + description).toLowerCase();

  let mentalScore = 0;
  let physicalScore = 0;
  let socialScore = 0;
  let errandsScore = 0;

  // Mental indicators
  if (/exam|study|quiz|test|midterm|final|paper|essay|reading|homework|assignment|code|debug|project|thesis|lecture/.test(combined)) {
    mentalScore += 24;
  }
  // Physical indicators
  if (/workout|gym|run|lift|training|exercise|cardio|walk|hike|bike|swim|stretch|yoga|sports|soccer|basketball/.test(combined)) {
    physicalScore += 22;
  }
  // Social indicators
  if (/dinner|lunch|meet|group|friend|friends|party|coffee|call|club|hangout|date|team|sync|roommate/.test(combined)) {
    socialScore += 20;
  }
  // Errands indicators
  if (/groceries|grocery|clean|laundry|errand|chores|pharmacy|buy|mail|package|dishes|cook|trash|admin|register/.test(combined)) {
    errandsScore += 18;
  }

  // Base weighting if general or unclassified
  if (mentalScore === 0 && physicalScore === 0 && socialScore === 0 && errandsScore === 0) {
    mentalScore = 14;
    errandsScore = 8;
  }

  // Factor in importance (1-5)
  const multiplier = 0.7 + (importance * 0.2); // 0.9 to 1.7
  mentalScore = Math.round(mentalScore * multiplier);
  physicalScore = Math.round(physicalScore * multiplier);
  socialScore = Math.round(socialScore * multiplier);
  errandsScore = Math.round(errandsScore * multiplier);

  // Derive human-centered AI insight
  let note = 'Moderate baseline load across regular student commitments.';
  if (mentalScore >= physicalScore && mentalScore >= socialScore && mentalScore >= errandsScore && mentalScore > 15) {
    if (importance >= 4) {
      note = 'Heavy cognitive strain detected. Protect uninterrupted deep-work blocks and hydration.';
    } else {
      note = 'Focused intellectual effort required; pace with short screen-free pauses.';
    }
  } else if (physicalScore >= mentalScore && physicalScore >= socialScore) {
    note = 'Cardiovascular & muscular exertion; will temporarily elevate heart rate then deepen sleep.';
  } else if (socialScore >= mentalScore && socialScore >= errandsScore) {
    note = 'Interpersonal interaction; recharges emotional mood while expending conversational energy.';
  } else if (errandsScore > 10) {
    note = 'Low-friction administrative movement; ideal as an active break from screen fatigue.';
  }

  return {
    impact: {
      mental: Math.max(0, mentalScore),
      physical: Math.max(0, physicalScore),
      social: Math.max(0, socialScore),
      errands: Math.max(0, errandsScore),
    },
    note,
  };
}

export function generateBreakdownSteps(
  name: string,
  description: string,
  importance: number
): { steps: SubTask[]; dominantCategory: LifeCategory } {
  const combined = (name + ' ' + description).toLowerCase();
  const baseId = 'step-' + Date.now();

  let category: LifeCategory = 'Mental';
  let steps: { title: string; category: LifeCategory; minutes: number; delta: number }[] = [];

  if (/exam|midterm|final|test|quiz|study|lab/.test(combined)) {
    category = 'Mental';
    steps = [
      {
        title: 'Organize study space, gather textbooks, and print out reference materials',
        category: 'Errands',
        minutes: 10,
        delta: 4,
      },
      {
        title: `Consolidate key concepts and formula cheat-sheet for ${name.slice(0, 30)}`,
        category: 'Mental',
        minutes: 30,
        delta: 14 + importance,
      },
      {
        title: 'Run 25 minutes of timed practice questions without checking solutions',
        category: 'Mental',
        minutes: 25,
        delta: 12 + importance,
      },
      {
        title: 'Take a brief stretching and hydration walk to reset cognitive fatigue',
        category: 'Physical',
        minutes: 10,
        delta: 5,
      },
    ];
  } else if (/paper|essay|thesis|write|writing|draft|report/.test(combined)) {
    category = 'Mental';
    steps = [
      {
        title: 'Outline thesis argument, 3 supporting claims, and evidence sources',
        category: 'Mental',
        minutes: 25,
        delta: 10 + importance,
      },
      {
        title: 'Draft body paragraphs focusing on flow over syntax perfection',
        category: 'Mental',
        minutes: 45,
        delta: 16 + importance,
      },
      {
        title: 'Discuss paper topic briefly with a peer to validate logic and arguments',
        category: 'Social',
        minutes: 15,
        delta: 6,
      },
      {
        title: 'Polish citations, bibliography, and run voice read-aloud check',
        category: 'Errands',
        minutes: 20,
        delta: 6 + importance,
      },
    ];
  } else if (/workout|gym|run|lift|exercise|cardio|training|fitness|swim/.test(combined)) {
    category = 'Physical';
    steps = [
      {
        title: 'Prepare gym gear, water flask, and pre-workout hydration',
        category: 'Errands',
        minutes: 10,
        delta: 4,
      },
      {
        title: `Execute targeted set: ${name.slice(0, 35)} with proper rest cadence`,
        category: 'Physical',
        minutes: 40,
        delta: 18 + importance,
      },
      {
        title: 'Cool down stretching, foam roller recovery, and protein intake',
        category: 'Physical',
        minutes: 15,
        delta: 6,
      },
    ];
  } else if (/dinner|meet|coffee|party|hangout|date|sync|friends|group|club/.test(combined)) {
    category = 'Social';
    steps = [
      {
        title: 'Confirm meeting time, location, and commute route with group',
        category: 'Errands',
        minutes: 10,
        delta: 5,
      },
      {
        title: `Attend ${name.slice(0, 35)} and engage without checking notifications`,
        category: 'Social',
        minutes: 50,
        delta: 16 + importance,
      },
      {
        title: 'Post-gathering decompression and evening wind-down',
        category: 'Mental',
        minutes: 15,
        delta: 5,
      },
    ];
  } else if (/groceries|grocery|laundry|clean|dishes|apartment|dorm|errand|chores|pharmacy/.test(combined)) {
    category = 'Errands';
    steps = [
      {
        title: `Assemble checklist or prep items for ${name.slice(0, 30)}`,
        category: 'Errands',
        minutes: 10,
        delta: 6,
      },
      {
        title: `Complete execution of ${name.slice(0, 35)}`,
        category: 'Physical',
        minutes: 30,
        delta: 12 + importance,
      },
      {
        title: 'Review schedule and take a mindful breath after finishing chores',
        category: 'Mental',
        minutes: 5,
        delta: 2,
      },
      {
        title: 'Put away supplies, tidy space, and check off confirmation',
        category: 'Errands',
        minutes: 15,
        delta: 5,
      },
    ];
  } else {
    // Default tailored decomposition
    category = 'Mental';
    steps = [
      {
        title: `Define the core deliverable and gather prerequisites for ${name.slice(0, 28)}`,
        category: 'Mental',
        minutes: 15,
        delta: 8 + importance,
      },
      {
        title: `Focused active block: execute primary milestone`,
        category: 'Mental',
        minutes: 35,
        delta: 15 + importance,
      },
      {
        title: `Wrap up, save progress, and organize next touchpoint`,
        category: 'Errands',
        minutes: 10,
        delta: 5,
      },
    ];
  }

  const generatedSubtasks: SubTask[] = steps.map((s, index) => ({
    id: `${baseId}-${index}`,
    title: s.title,
    category: s.category,
    estimatedMinutes: s.minutes,
    cortisolDelta: s.delta,
    completed: false,
  }));

  return {
    steps: generatedSubtasks,
    dominantCategory: category,
  };
}

export function formatUrgency(dueDateString: string): { label: string; isUrgent: boolean } {
  if (!dueDateString) return { label: 'No date', isUrgent: false };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if string matches YYYY-MM-DD
  const parts = dueDateString.split('-');
  let targetDate: Date;

  if (parts.length === 3) {
    targetDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  } else {
    targetDate = new Date(dueDateString);
  }

  if (isNaN(targetDate.getTime())) {
    return { label: dueDateString, isUrgent: false };
  }

  targetDate.setHours(0, 0, 0, 0);
  const diffDays = Math.round((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { label: `Overdue by ${Math.abs(diffDays)}d`, isUrgent: true };
  } else if (diffDays === 0) {
    return { label: 'Due today', isUrgent: true };
  } else if (diffDays === 1) {
    return { label: 'Due tomorrow', isUrgent: false };
  } else if (diffDays <= 6) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return { label: `Due ${days[targetDate.getDay()]}`, isUrgent: false };
  } else {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return { label: `${months[targetDate.getMonth()]} ${targetDate.getDate()}`, isUrgent: false };
  }
}
