import { Injectable, inject, signal } from '@angular/core';
import { z } from 'zod';
import { StorageService } from '../../core/storage/storage.service';

export type NutritionMealType = 'breakfast' | 'lunch' | 'snack' | 'dinner';
export type NutritionPlanSource = 'personal' | 'professional';

export interface NutritionPlanMeal {
  id: string;
  type: NutritionMealType;
  description: string;
}

export interface NutritionPlan {
  id: string;
  name: string;
  source: NutritionPlanSource;
  meals: NutritionPlanMeal[];
  createdAt: string;
}

const STORAGE_KEY = 'nutrition-plans';
const mealSchema = z.object({
  id: z.string().min(1),
  type: z.enum(['breakfast', 'lunch', 'snack', 'dinner']),
  description: z.string().min(1).max(220),
});
const planSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(80),
  source: z.enum(['personal', 'professional']),
  meals: z.array(mealSchema).min(1).max(16),
  createdAt: z.string().refine((value) => !Number.isNaN(Date.parse(value))),
});

@Injectable({ providedIn: 'root' })
export class NutritionService {
  private readonly storage = inject(StorageService);
  private readonly _plans = signal(
    this.storage.read<NutritionPlan[]>(STORAGE_KEY, [], z.array(planSchema)),
  );

  readonly plans = this._plans.asReadonly();

  createPlan(name: string, meals: NutritionPlanMeal[], source: NutritionPlanSource): NutritionPlan {
    const plan: NutritionPlan = {
      id: crypto.randomUUID(),
      name: name.trim(),
      source,
      meals: meals.slice(0, 16),
      createdAt: new Date().toISOString(),
    };
    const updated = [plan, ...this._plans()];
    this._plans.set(updated);
    this.storage.write(STORAGE_KEY, updated);
    return plan;
  }

  deletePlan(id: string): NutritionPlan | null {
    const plan = this._plans().find((item) => item.id === id);
    if (!plan) return null;
    const updated = this._plans().filter((item) => item.id !== id);
    this._plans.set(updated);
    this.storage.write(STORAGE_KEY, updated);
    return plan;
  }

  clearAll(): void {
    this._plans.set([]);
    this.storage.clear(STORAGE_KEY);
  }
}
