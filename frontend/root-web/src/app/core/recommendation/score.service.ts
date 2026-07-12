import { Injectable } from '@angular/core';
import {
  CATEGORIES,
  HabitCategoryId,
  InteractionEvent,
} from '../../features/dashboard/models/dashboard.models';

export interface CategoryScore {
  categoryId: HabitCategoryId;
  frequency: number;
  daysSinceLastActivity: number | null;
  needScore: number;
}

const WINDOW_DAYS = 7;
const DISMISS_COOLDOWN_HOURS = 6;

@Injectable({ providedIn: 'root' })
export class ScoreService {
  calculate(history: InteractionEvent[]): CategoryScore[] {
    const now = Date.now();
    const windowStart = now - WINDOW_DAYS * 24 * 60 * 60 * 1000;

    return (Object.keys(CATEGORIES) as HabitCategoryId[]).map((categoryId) => {
      const positiveEvents = history.filter(
        (e) =>
          e.category === categoryId &&
          (e.type === 'habit_completed' || e.type === 'workout_completed') &&
          new Date(e.createdAt).getTime() >= windowStart,
      );

      const lastPositive = positiveEvents[0];
      const daysSinceLastActivity = lastPositive
        ? (now - new Date(lastPositive.createdAt).getTime()) / (1000 * 60 * 60 * 24)
        : null;

      const lastDismissal = history.find(
        (e) => e.category === categoryId && e.type === 'recommendation_dismissed',
      );
      const isCoolingDown =
        !!lastDismissal &&
        now - new Date(lastDismissal.createdAt).getTime() < DISMISS_COOLDOWN_HOURS * 60 * 60 * 1000;

      const frequencyGap = Math.max(0, 5 - positiveEvents.length);
      const recencyGap =
        daysSinceLastActivity === null ? WINDOW_DAYS : Math.min(daysSinceLastActivity, WINDOW_DAYS);
      let needScore = frequencyGap * 10 + recencyGap * 5;

      if (isCoolingDown) {
        needScore *= 0.3;
      }

      return { categoryId, frequency: positiveEvents.length, daysSinceLastActivity, needScore };
    });
  }
}
