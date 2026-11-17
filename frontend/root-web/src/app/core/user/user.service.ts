import { Injectable, computed, inject, signal } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { UserProfile } from '../../features/onboarding/models/onboarding.models';
import { z } from 'zod';

const STORAGE_KEY = 'user-profile';
const SESSION_KEY = 'session-active';
const userProfileSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  goal: z.enum(['strength', 'general_health', 'weight_loss', 'mobility', 'wellbeing']),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  availableDaysPerWeek: z.number().int().min(1).max(7),
  createdAt: z.string().refine((value) => !Number.isNaN(Date.parse(value))),
});

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly storage = inject(StorageService);

  private readonly _profile = signal<UserProfile | null>(
    this.storage.read<UserProfile | null>(STORAGE_KEY, null, userProfileSchema.nullable()),
  );
  private readonly _isAuthenticated = signal(this.storage.read(SESSION_KEY, false, z.boolean()));

  readonly profile = this._profile.asReadonly();
  readonly isOnboarded = computed(() => this._profile() !== null);
  readonly isAuthenticated = computed(() => this._isAuthenticated() && this.isOnboarded());

  saveProfile(profile: UserProfile): void {
    this._profile.set(profile);
    this.storage.write(STORAGE_KEY, profile);
    this._isAuthenticated.set(true);
    this.storage.write(SESSION_KEY, true);
  }

  clearProfile(): void {
    this._profile.set(null);
    this.storage.clear(STORAGE_KEY);
    this._isAuthenticated.set(false);
    this.storage.clear(SESSION_KEY);
  }

  signInWithEmail(email: string): boolean {
    const matches = this._profile()?.email.trim().toLocaleLowerCase() === email.trim().toLocaleLowerCase();
    if (!matches) return false;

    this._isAuthenticated.set(true);
    this.storage.write(SESSION_KEY, true);
    return true;
  }

  signOut(): void {
    this._isAuthenticated.set(false);
    this.storage.write(SESSION_KEY, false);
  }
}
