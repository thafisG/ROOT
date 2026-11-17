import { Injectable, inject, signal } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { z } from 'zod';
import {
  InteractionEvent,
  InteractionType,
  HabitCategoryId,
} from '../../features/dashboard/models/dashboard.models';

const STORAGE_KEY = 'interactions';
const XP_STORAGE_KEY = 'experience-points';
const MAX_HISTORY = 500;
const interactionEventSchema = z.object({
  id: z.string().min(1),
  type: z.enum([
    'workout_completed',
    'habit_completed',
    'recommendation_clicked',
    'recommendation_dismissed',
  ]),
  category: z.enum(['strength', 'mobility', 'hydration', 'sleep', 'nutrition', 'cardio']),
  createdAt: z.string().refine((value) => !Number.isNaN(Date.parse(value))),
  details: z.string().max(300).optional(),
});

@Injectable({ providedIn: 'root' })
export class InteractionService {
  private readonly storage = inject(StorageService);

  private readonly _history = signal<InteractionEvent[]>(
    this.storage.read(STORAGE_KEY, [], z.array(interactionEventSchema)),
  );
  private readonly _experiencePoints = signal(
    this.storage.read(
      XP_STORAGE_KEY,
      this._history().filter((event) => event.type === 'habit_completed' || event.type === 'workout_completed').length * 10,
      z.number().int().nonnegative(),
    ),
  );

  readonly history = this._history.asReadonly();
  readonly experiencePoints = this._experiencePoints.asReadonly();

  register(type: InteractionType, category: HabitCategoryId, details?: string): void {
    const event: InteractionEvent = {
      id: crypto.randomUUID(),
      type,
      category,
      createdAt: new Date().toISOString(),
      ...(details ? { details: details.slice(0, 300) } : {}),
    };

    const updated = [event, ...this._history()].slice(0, MAX_HISTORY);
    this._history.set(updated);
    this.storage.write(STORAGE_KEY, updated);
    if (type === 'habit_completed' || type === 'workout_completed') {
      this._experiencePoints.update((points) => points + 10);
      this.storage.write(XP_STORAGE_KEY, this._experiencePoints());
    }
  }

  recentEntries(limit: number): InteractionEvent[] {
    return this._history()
      .filter((event) => event.type !== 'recommendation_dismissed')
      .slice(0, limit);
  }

  clearHistory(): void {
    this._history.set([]);
    this.storage.clear(STORAGE_KEY);
    this._experiencePoints.set(0);
    this.storage.clear(XP_STORAGE_KEY);
  }
}
