import { Injectable, inject, signal } from '@angular/core';
import { z } from 'zod';
import { StorageService } from '../../core/storage/storage.service';

export interface WorkoutRoutine {
  id: string;
  name: string;
  exercises: string[];
  createdAt: string;
  referenceImage?: string;
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
});

@Injectable({ providedIn: 'root' })
export class WorkoutService {
  private readonly storage = inject(StorageService);
  private readonly _routines = signal(
    this.storage.read<WorkoutRoutine[]>(STORAGE_KEY, [], z.array(workoutRoutineSchema)),
  );

  readonly routines = this._routines.asReadonly();

  create(name: string, exercises: string[], referenceImage?: string | null): WorkoutRoutine {
    const routine: WorkoutRoutine = {
      id: crypto.randomUUID(),
      name: name.trim(),
      exercises: exercises.map((exercise) => exercise.trim()).filter(Boolean).slice(0, 20),
      createdAt: new Date().toISOString(),
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

  clearAll(): void {
    this._routines.set([]);
    this.storage.clear(STORAGE_KEY);
  }
}
