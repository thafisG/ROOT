import { Injectable, inject, signal } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { z } from 'zod';
import {
  InteractionEvent,
  InteractionType,
  HabitCategoryId,
} from '../../features/dashboard/models/dashboard.models';

const STORAGE_KEY = 'interactions';
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
});

@Injectable({ providedIn: 'root' })
export class InteractionService {
  private readonly storage = inject(StorageService);

  private readonly _history = signal<InteractionEvent[]>(
    this.storage.read(STORAGE_KEY, [], z.array(interactionEventSchema)),
  );

  readonly history = this._history.asReadonly();

  register(type: InteractionType, category: HabitCategoryId): void {
    const event: InteractionEvent = {
      id: crypto.randomUUID(),
      type,
      category,
      createdAt: new Date().toISOString(),
    };

    const updated = [event, ...this._history()].slice(0, MAX_HISTORY);
    this._history.set(updated);
    this.storage.write(STORAGE_KEY, updated);
  }

  recentEntries(limit: number): InteractionEvent[] {
    return this._history()
      .filter((event) => event.type !== 'recommendation_dismissed')
      .slice(0, limit);
  }

  clearHistory(): void {
    this._history.set([]);
    this.storage.clear(STORAGE_KEY);
  }
}
