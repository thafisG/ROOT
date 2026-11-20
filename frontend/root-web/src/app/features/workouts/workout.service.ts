import { Injectable, inject, signal } from '@angular/core';
import { z } from 'zod';
import { StorageService } from '../../core/storage/storage.service';

export interface WorkoutRoutine {
  id: string;
  name: string;
  exercises: string[];
  createdAt: string;
  referenceImage?: string;
  cardTheme?: 'moss' | 'sunset' | 'ocean' | 'royal';
  cardEmblem?: string;
  cardArtwork?: string;
  cardTitle?: string;
  cardLore?: string;
  cardFrame?: 'classic' | 'gilded' | 'arcane' | 'etched';
  cardAccent?: string;
  cardColor?: string;
  completions?: number;
  cycleDays?: number;
  cycleStartedAt?: string;
  cardWins?: number;
  cardLosses?: number;
  cardDraws?: number;
}

export interface WorkoutExerciseDraft {
  id: string;
  name: string;
  sets: number;
  repetitions: number;
  restSeconds: number;
  groupName?: string;
  groupId?: string;
  sourceMode?: 'message' | 'photo' | 'manual';
  load?: string;
  notes?: string;
}

const STORAGE_KEY = 'workout-routines';
const workoutRoutineSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(80),
  exercises: z.array(z.string().min(1).max(300)).min(1).max(20),
  createdAt: z.string().refine((value) => !Number.isNaN(Date.parse(value))),
  referenceImage: z.string().max(650_000).optional(),
  cardTheme: z.enum(['moss', 'sunset', 'ocean', 'royal']).optional(),
  cardEmblem: z.string().max(8).optional(),
  cardArtwork: z.string().max(650_000).optional(),
  cardTitle: z.string().max(40).optional(),
  cardLore: z.string().max(120).optional(),
  cardFrame: z.enum(['classic', 'gilded', 'arcane', 'etched']).optional(),
  cardAccent: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  cardColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  completions: z.number().int().nonnegative().optional(),
  cycleDays: z.number().int().min(7).max(90).optional(),
  cycleStartedAt: z.string().refine((value) => !Number.isNaN(Date.parse(value))).optional(),
  cardWins: z.number().int().nonnegative().optional(),
  cardLosses: z.number().int().nonnegative().optional(),
  cardDraws: z.number().int().nonnegative().optional(),
});

@Injectable({ providedIn: 'root' })
export class WorkoutService {
  private readonly storage = inject(StorageService);
  private readonly _routines = signal(
    this.storage.read<WorkoutRoutine[]>(STORAGE_KEY, [], z.array(workoutRoutineSchema)),
  );
  private readonly _lastCompletedId = signal<string | null>(null);

  readonly routines = this._routines.asReadonly();
  readonly lastCompletedId = this._lastCompletedId.asReadonly();

  create(name: string, exercises: string[], referenceImage?: string | null): WorkoutRoutine {
    const routine: WorkoutRoutine = {
      id: crypto.randomUUID(),
      name: name.trim(),
      exercises: exercises.map((exercise) => exercise.trim()).filter(Boolean).slice(0, 20),
      createdAt: new Date().toISOString(),
      cardTheme: 'moss',
      cardEmblem: '🌿',
      completions: 0,
      cycleDays: 28,
      cardFrame: 'classic',
      ...(referenceImage ? { referenceImage } : {}),
    };
    const updated = [routine, ...this._routines()];
    this._routines.set(updated);
    this.storage.write(STORAGE_KEY, updated);
    return routine;
  }

  delete(id: string): WorkoutRoutine | null {
    const routine = this._routines().find((item) => item.id === id);
    if (!routine) return null;

    this._routines.set(this._routines().filter((item) => item.id !== id));
    this.storage.write(STORAGE_KEY, this._routines());
    return routine;
  }

  customizeCard(id: string, cardTheme: NonNullable<WorkoutRoutine['cardTheme']>, cardEmblem: string): void {
    const updated = this._routines().map((routine) => routine.id === id
      ? { ...routine, cardTheme, cardEmblem }
      : routine);
    this._routines.set(updated);
    this.storage.write(STORAGE_KEY, updated);
  }

  customizeArtwork(id: string, cardArtwork: string | null): void {
    const updated = this._routines().map((routine) => {
      if (routine.id !== id) return routine;
      if (cardArtwork) return { ...routine, cardArtwork };
      const withoutArtwork = { ...routine };
      delete withoutArtwork.cardArtwork;
      return withoutArtwork;
    });
    this._routines.set(updated);
    this.storage.write(STORAGE_KEY, updated);
  }

  updateCardDetails(id: string, details: Partial<Pick<WorkoutRoutine, 'cardTitle' | 'cardLore' | 'cardTheme' | 'cardFrame' | 'cardAccent' | 'cardColor' | 'cardEmblem' | 'cycleDays'>>): void {
    const updated = this._routines().map((routine) => routine.id === id ? { ...routine, ...details } : routine);
    this._routines.set(updated);
    this.storage.write(STORAGE_KEY, updated);
  }

  startCycle(id: string): void {
    const updated = this._routines().map((routine) => routine.id === id && !routine.cycleStartedAt
      ? { ...routine, cycleStartedAt: new Date().toISOString() }
      : routine);
    this._routines.set(updated);
    this.storage.write(STORAGE_KEY, updated);
  }

  renewCycle(id: string): void {
    const updated = this._routines().map((routine) => routine.id === id
      ? { ...routine, cycleStartedAt: new Date().toISOString() }
      : routine);
    this._routines.set(updated);
    this.storage.write(STORAGE_KEY, updated);
  }

  recordCardBattle(id: string, result: 'won' | 'lost' | 'draw'): void {
    const field = result === 'won' ? 'cardWins' : result === 'lost' ? 'cardLosses' : 'cardDraws';
    const updated = this._routines().map((routine) => routine.id === id
      ? { ...routine, [field]: (routine[field] ?? 0) + 1 }
      : routine);
    this._routines.set(updated);
    this.storage.write(STORAGE_KEY, updated);
  }

  recordCompletion(id: string): number {
    let count = 0;
    const updated = this._routines().map((routine) => {
      if (routine.id !== id) return routine;
      count = (routine.completions ?? 0) + 1;
      return { ...routine, completions: count };
    });
    this._routines.set(updated);
    this._lastCompletedId.set(id);
    this.storage.write(STORAGE_KEY, updated);
    return count;
  }

  clearAll(): void {
    this._routines.set([]);
    this.storage.clear(STORAGE_KEY);
  }
}
