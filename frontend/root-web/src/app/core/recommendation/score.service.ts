import { Injectable } from '@angular/core';
import {
  CATEGORIES,
  HabitCategoryId,
  InteractionEvent,
} from '../../features/dashboard/models/dashboard.models';
import { FitnessGoal } from '../../features/onboarding/models/onboarding.models';

export interface CategoryScore {
  categoryId: HabitCategoryId;
  frequency: number;
  daysSinceLastActivity: number | null;
  needScore: number;
}

const WINDOW_DAYS = 7;
const DISMISS_COOLDOWN_HOURS = 6;

const GOAL_CATEGORY: Partial<Record<FitnessGoal, HabitCategoryId>> = {
  strength: 'strength',
  weight_loss: 'cardio',
  mobility: 'mobility',
};

@Injectable({ providedIn: 'root' })
export class ScoreService {
  calculate(history: InteractionEvent[], goal?: FitnessGoal): CategoryScore[] {
    const now = Date.now();
    const windowStart = now - WINDOW_DAYS * 24 * 60 * 60 * 1000;

    return (Object.keys(CATEGORIES) as HabitCategoryId[]).map((categoryId) => {
      const positiveEvents = history.filter((event) => {
        const createdAt = new Date(event.createdAt).getTime();
        return (
          event.category === categoryId &&
          (event.type === 'habit_completed' || event.type === 'workout_completed') &&
          createdAt >= windowStart &&
          createdAt <= now
        );
      });

      const lastPositive = positiveEvents[0];
      const daysSinceLastActivity = lastPositive
        ? (now - new Date(lastPositive.createdAt).getTime()) / (1000 * 60 * 60 * 24)
        : null;

      const lastDismissal = history.find(
        (e) => e.category === categoryId && e.type === 'recommendation_dismissed',
      );
      const isCoolingDown =
        !!lastDismissal &&
        new Date(lastDismissal.createdAt).getTime() <= now &&
        now - new Date(lastDismissal.createdAt).getTime() < DISMISS_COOLDOWN_HOURS * 60 * 60 * 1000;

      const frequencyGap = Math.max(0, 5 - positiveEvents.length);
      const recencyGap =
        daysSinceLastActivity === null ? WINDOW_DAYS : Math.min(daysSinceLastActivity, WINDOW_DAYS);
      let needScore = frequencyGap * 10 + recencyGap * 5;

      if (isCoolingDown) {
        needScore *= 0.3;
      }

      if (goal && GOAL_CATEGORY[goal] === categoryId) needScore *= 1.15;

      return { categoryId, frequency: positiveEvents.length, daysSinceLastActivity, needScore };
    });
  }
}
